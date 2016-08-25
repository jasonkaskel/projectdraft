import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { delay, isEmpty } from 'lodash'
import { Alert, Well } from 'react-bootstrap'

import actions from '../../actions'
import asyncActions from '../../services'
import { roundNumber, pickNumber, nextPickNumber } from '../../lib/draft'
import Athlete from './Athlete'
import CurrentPick from './CurrentPick'
import RoundHeader from './RoundHeader'
import { REFETCH_DELAY } from '../../constants'

const styles = {
  header: {
    marginBottom: "1em",
  },
  pastPicksContainer: {
    display: "block",
    height: 310, // TODO make responsive
    overflowY: "auto",
    overflowX: "hidden",
  },
  pastPicksContainerWhilePicking: {
    height: 150,
  },
  nextPickContainer: {
    display: "block",
    borderRadius: 7,
    outline: "none",
    boxShadow: "0 0 10px 5px #9ecaed",
    marginTop: "1em",
    marginLeft: "1em",
    marginRight: "1em",
    paddingTop: ".5em",
    paddingBottom: "1em",
  },
  nextPick: {
    width: "90%",
    margin: "0 auto",
  },
  pickContainer: {
    width: "100%",
  },
  picksContainer: {
    width: "100%",
  },
  picksHeaderCell: {
    verticalAlign: "top",
    minWidth: 92,
  },
  picksHeaderContainer: {
    marginLeft: "1em",
    marginRight: "1em",
  },
  sufficientCount: {
    color: "green",
  },
  deficientCount: {
    color: "red",
  },
}

class DraftPick extends Component {
  static propTypes = {
    draft: PropTypes.object,
    error: PropTypes.string,
    isPicking: PropTypes.bool.isRequired,
    fetchDraft: PropTypes.func.isRequired,
  }

  fetchDraft(draft_id) {
    const fetchAgain = () => { delay(() => { this.fetchDraft(draft_id) }, REFETCH_DELAY) }
    this.props.fetchDraft(draft_id)
      .then(fetchAgain, fetchAgain)
  }

  componentDidMount() {
    this.fetchDraft(this.props.routeParams.draft_id)
  }

  renderBlank() {
    return (
      <div className="error">
        No teams in draft.
      </div>
    )
  }

  renderPick(draft) {
    const teamCount = draft.teams.length
    const currentTeam = draft.can_pick ? draft.on_the_clock : this.props.team
    const teamPicks = draft.picks.filter(pick => pick.team_id === currentTeam.id)
    const lastPick = teamPicks[teamPicks.length-1]
    const nextPick = nextPickNumber(draft.picks, teamCount)
    const error = this.props.error ? (
      <Alert bsStyle="danger">{this.props.error}</Alert>
    ) : null
    const currentPick = draft.can_pick ? (
      <CurrentPick currentTeam={currentTeam} />
    ) : draft.on_the_clock ? (
      <div>
        <em>On the Clock: {draft.on_the_clock.name}</em>
      </div>
    ) : null
    const pastPicksContainerStyle = this.props.isPicking ?
      Object.assign({}, styles.pastPicksContainer, styles.pastPicksContainerWhilePicking) :
      draft.on_the_clock ?
      styles.pastPicksContainer :
      {}
    const nextPickContainer = draft.on_the_clock &&
      <div style={styles.nextPickContainer}>
            <h5>Round {roundNumber(lastPick.number+1, teamCount)}; Pick {nextPick}</h5>
            <div style={styles.nextPick}>{currentPick}</div>
          </div>

    return (
      <div>
        <div style={styles.header}>
          <h4>{currentTeam.name}</h4>
          <PositionSummary
            picks={teamPicks}
            positions={draft.positions}
          />
        </div>
        {error}
        <div className="DraftPick--picksSoFar">
          <table style={styles.picksContainer}>
            <tbody style={pastPicksContainerStyle}>
              {teamPicks.map(pick =>
                <tr key={pick.id}>
                  <RoundHeader
                    roundNumber={roundNumber(pick.number, teamCount)}
                    pickNumber={pickNumber(pick.number, teamCount)}
                  />
                  <td style={styles.pickContainer}>
                    <Athlete
                      key={`draft-pick-${pick.athlete.id}`}
                      athlete={pick.athlete}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {nextPickContainer}
        </div>
      </div>
    )
  }

  render() {
    return this.props.draft.teams.length > 0 ?
      this.renderPick(this.props.draft) :
      this.renderBlank()
  }

}

const mapDispatchToProps = (dispatch) => ({
  fetchDraft: (draft_id) => dispatch(asyncActions.fetchDraft(draft_id)),
  makePick: (picks, pick) => dispatch(actions.makePick(picks, pick)),
})

const mapStateToProps = ({ draft }) => ({
  draft: draft.draft,
  team: draft.team,
  error: draft.makePickError,
  isPicking: !!(!isEmpty(draft.searchTerm) || draft.currentPick),
})

export default connect(mapStateToProps, mapDispatchToProps)(DraftPick)

class PositionSummary extends React.Component {
  counts(teamPicks) {
    return teamPicks.reduce(function(positions, pick) {
      let position = pick.athlete.position
      return {
        ...positions,
        [position]: positions[position]+1
      }
    }, {
      QB: 0,
      WR: 0,
      RB: 0,
      TE: 0,
      K: 0,
      DEF: 0
    })
  }

  render() {
    const { picks, positions } = this.props
    const counts = this.counts(picks)

    return (
      <Well bsSize="small">
        {Object.keys(positions).map((position, i) => {
          return (
            <span
              key={`position-${position}`}
              style={counts[position] >= positions[position] ? styles.sufficientCount : styles.deficientCount}
            >
              {`${counts[position]} ${position}`}
              {i+1 < Object.keys(positions).length ? ' • ' : null}
            </span>
          )
        })}
      </Well>
    )
  }
}

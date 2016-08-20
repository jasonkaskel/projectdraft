import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { delay, isEmpty } from 'lodash'
import { Alert, Well } from 'react-bootstrap'

import actions from '../../actions'
import asyncActions from '../../services'
import { roundNumber, pickNumber, nextPickNumber } from '../../lib/draft'
import AccountNav from '../account/AccountNav'
import Athlete from './Athlete'
import CurrentPick from './CurrentPick'

const styles = {
  header: {
    marginBottom: "1em",
  },
  pastPicksContainer: {
    display: "block",
    height: 275, // TODO make responsive
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
}

class DraftPick extends Component {
  static propTypes = {
    draft: PropTypes.object,
    error: PropTypes.string,
    isPicking: PropTypes.bool.isRequired,
    fetchDraft: PropTypes.func.isRequired,
  }

  fetchDraft(draft_id) {
    const fetchAgain = () => { delay(() => { this.fetchDraft(draft_id) }, 8000) }
    this.props.fetchDraft(draft_id)
      .then(fetchAgain, fetchAgain)
  }

  componentDidMount() {
    this.fetchDraft(this.props.routeParams.draft_id)
  }

  positionsForTeam(teamPicks) {
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

  renderBlank() {
    return (
      <div className="error">
        No teams in draft.
      </div>
    )
  }

  renderPick(draft) {
    const teamCount = draft.teams.length
    const currentTeam = draft.on_the_clock
    const teamPicks = draft.picks.filter(pick => pick.team_id === currentTeam.id)
    const lastPick = teamPicks[teamPicks.length-1]
    const nextPick = nextPickNumber(draft.picks, teamCount)
    const positionsForTeam = this.positionsForTeam(teamPicks)
    const error = this.props.error ? (
      <Alert bsStyle="danger">{this.props.error}</Alert>
    ) : null
    const currentPick = draft.can_pick ? (
      <CurrentPick currentTeam={currentTeam} />
    ) : (
      <div>
        <em>Awaiting Selection</em>
      </div>
    )
    const pastPicksContainerStyle = this.props.isPicking ?
      Object.assign({}, styles.pastPicksContainer, styles.pastPicksContainerWhilePicking) :
      styles.pastPicksContainer
console.log('in DraftPick')
console.log(this)
    return (
      <div>
        <AccountNav />
        <div style={styles.header}>
          <h4>On the Clock: {currentTeam.name}</h4>
          <Well bsSize="small">
            {positionsForTeam["QB"]} QB &bull;&nbsp;
            {positionsForTeam["RB"]} RB &bull;&nbsp;
            {positionsForTeam["WR"]} WR &bull;&nbsp;
            {positionsForTeam["TE"]} TE &bull;&nbsp;
            {positionsForTeam["K"]} TE &bull;&nbsp;
            {positionsForTeam["DEF"]} DEF
          </Well>
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
          <div style={styles.nextPickContainer}>
            <h5>Round {roundNumber(lastPick.number, teamCount) + 1}; Pick {nextPick}</h5>
            <div style={styles.nextPick}>{currentPick}</div>
          </div>
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
  error: draft.makePickError,
  isPicking: !!(!isEmpty(draft.searchTerm) || draft.currentPick),
})

export default connect(mapStateToProps, mapDispatchToProps)(DraftPick)

class RoundHeader extends Component {
  render() {
    return (
      <th style={styles.picksHeaderCell}>
        <div style={styles.picksHeaderContainer}>
          <div>Round {this.props.roundNumber}</div>
          <div>Pick {this.props.pickNumber}</div>
        </div>
      </th>
    )
  }
}

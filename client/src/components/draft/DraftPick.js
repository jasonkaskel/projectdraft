import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { delay } from 'lodash'
import { Alert, Well } from 'react-bootstrap'

import actions from '../../actions'
import asyncActions from '../../services'
import { roundNumber, pickNumber, nextPickNumber } from '../../lib/draft'
import Athlete from './Athlete'
import CurrentPick from './CurrentPick'

const styles = {
  header: {
    marginBottom: "1em",
  },
  pastPicksContainer: {
    display: "block",
    height: 450, // TODO make responsive
    overflowY: "auto",
    overflowX: "hidden",
  },
  nextPickContainer: {
    display: "block",
    borderRadius: 7,
    outline: "none",
    boxShadow: "0 0 10px 5px #9ecaed",
    marginTop: "1em",
    marginLeft: "1em",
    marginRight: "1em",
    paddingTop: "1em",
    paddingBottom: "1em",
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
    fetchDraft: PropTypes.func.isRequired,
  }

  fetchDraft() {
    const fetchAgain = () => { delay(() => { this.fetchDraft() }, 8000) }
    this.props.fetchDraft()
      .then(fetchAgain, fetchAgain)
  }

  componentDidMount() {
    this.fetchDraft()
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
      <td>
        <div>
          <em>Awaiting Selection</em>
        </div>
      </td>
    )

    return (
      <div>
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
            <tbody style={styles.pastPicksContainer}>
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
            <tfoot style={styles.nextPickContainer}>
              <tr>
                <RoundHeader
                  roundNumber={roundNumber(lastPick.number, teamCount) + 1}
                  pickNumber={nextPick}
                />
                {currentPick}
              </tr>
            </tfoot>
          </table>
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
  fetchDraft: () => dispatch(asyncActions.fetchDraft()),
  makePick: (picks, pick) => dispatch(actions.makePick(picks, pick)),
})

const mapStateToProps = ({ draft }) => ({
  draft: draft.draft,
  error: draft.makePickError,
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

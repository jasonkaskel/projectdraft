import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { delay } from 'lodash'

import actions from '../../actions'
import asyncActions from '../../services'
import { roundNumber, pickNumber, nextPickNumber } from '../../lib/draft'
import Athlete from './Athlete'
import CurrentPick from './CurrentPick'
import RoundHeader from './RoundHeader'

class DraftPick extends Component {
  static propTypes = {
    draft: PropTypes.object,
    fetchDraft: PropTypes.func.isRequired,
  }

  fetchDraft() {
    this.props.fetchDraft()
      .then(() => {
        delay(() => { this.fetchDraft() }, 8000)
    })
  }

  componentDidMount() {
    this.fetchDraft()
  }

  currentTeamFromDraft(draft) {
    const teams = draft.teams
    const numPicks = draft.picks.length

    let currentTeam = teams[0]
    const currentRound = roundNumber(numPicks, teams.length)
    const currentPick = pickNumber(numPicks, teams.length)

    if (currentRound % 2 === 1) {
      currentTeam = teams[currentPick]
    } else {
      currentTeam = teams[teams.length-1-currentPick]
    }
    return currentTeam
  }

  positionsForTeam(teamPicks, team) {
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
    const currentTeam = this.currentTeamFromDraft(draft)
    const teamPicks = draft.picks.filter(pick => pick.team_id === currentTeam.id)
    const lastPick = teamPicks[teamPicks.length-1]
    const nextPick = nextPickNumber(draft.picks, teamCount)
    const positionsForTeam = this.positionsForTeam(teamPicks, currentTeam)

    return (
      <div>
        <div className="DraftPick--header">
          <div className="onTheClock">
            On the Clock: {currentTeam.name}
          </div>
          <div className="teamSummary">
            {positionsForTeam["QB"]} QB &bull;&nbsp;
            {positionsForTeam["RB"]} RB &bull;&nbsp;
            {positionsForTeam["WR"]} WR &bull;&nbsp;
            {positionsForTeam["TE"]} TE &bull;&nbsp;
            {positionsForTeam["K"]} TE &bull;&nbsp;
            {positionsForTeam["DEF"]} DEF
          </div>
        </div>
        <div className="DraftPick--picksSoFar">
          <table>
            <tbody>
              {teamPicks.map(pick =>
                <tr key={pick.id}>
                  <RoundHeader
                    roundNumber={roundNumber(pick.number, teamCount)}
                    pickNumber={pickNumber(pick.number, teamCount)}
                  />
                  <td>
                    <Athlete
                      key={`draft-pick-${pick.athlete.id}`}
                      athlete={pick.athlete}
                    />
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <RoundHeader
                  roundNumber={roundNumber(lastPick.number, teamCount) + 1}
                  pickNumber={nextPick}
                />
                <CurrentPick
                  currentTeam={currentTeam}
                />
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

const mapStateToProps = ({ draft }) => ({ draft: draft.draft })

export default connect(mapStateToProps, mapDispatchToProps)(DraftPick)

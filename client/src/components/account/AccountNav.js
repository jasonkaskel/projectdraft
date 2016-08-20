import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import BurgerMenu from 'react-burger-menu';
import { Well } from 'react-bootstrap'

import { roundNumber, pickNumber } from '../../lib/draft'
import asyncActions from '../../services'
import Athlete from '../draft/Athlete'
import RoundHeader from '../draft/RoundHeader'

const styles = {

}

class AccountNav extends Component {
  static propTypes = {
    drafts: PropTypes.array,
    error: PropTypes.string,
    fetchDrafts: PropTypes.func.isRequired,
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

  render() {
    const currentTeam = this.props.team
    const teamCount = this.props.draft.teams.length
    const teamPicks = this.props.draft.picks.filter(pick => pick.team_id === currentTeam.id)
    const positionsForTeam = this.positionsForTeam(teamPicks)

    return (
      <div>
        <BurgerMenu.slide right>
          <div style={styles.header}>
            <h4>{currentTeam.name}</h4>
            <Well bsSize="small">
              {positionsForTeam["QB"]} QB &bull;&nbsp;
              {positionsForTeam["RB"]} RB &bull;&nbsp;
              {positionsForTeam["WR"]} WR &bull;&nbsp;
              {positionsForTeam["TE"]} TE &bull;&nbsp;
              {positionsForTeam["K"]} TE &bull;&nbsp;
              {positionsForTeam["DEF"]} DEF
            </Well>
          </div>
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
            </table>
          </div>
        </BurgerMenu.slide>
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  fetchDrafts: () => dispatch(asyncActions.fetchDrafts()),
})

const mapStateToProps = ({ draft }) => ({
  team: draft.team,
  draft: draft.draft,
  error: draft.fetchDraftsError,
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountNav)

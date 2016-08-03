import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { delay } from 'lodash'

import actions from '../../actions'
import asyncActions from '../../services'
import Athlete from './Athlete'

class DraftBoard extends Component {
  static propTypes = {
    draft: PropTypes.object,
    fetchDraft: PropTypes.func.isRequired,
    makePick: PropTypes.func.isRequired,
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

  picksToRounds({ picks, size }) {
    let rounds = []
    let haveSetCurrent = false

    while (picks.length > 0) {
      let round = picks.splice(0, size)
      if (!haveSetCurrent && round.length < size) {
        round.push({ current: true })
        haveSetCurrent = true
      }
      if (rounds.length % 2 === 1) {
        while (round.length < size) {
          round.push({})
        }
        round = round.reverse()
      }
      rounds.push(round.map(function(pick, i) {
        let key = '' + rounds.length + i
        return {
          ...pick,
          key
        }
      }))
    }
    if (!haveSetCurrent) {
      if (rounds.length % 2 === 1) {
        let round = [...Array(size)].map(function(__undef, i) {
          let key = '' + rounds.length + i
          return { key, current: i === size-1 }
        })
        rounds.push(round)
      } else {
        let key = '' + rounds.length + 0
        rounds.push([{ current: true, key }])
      }
    }
    return rounds
  }

  renderBlankPick(pick) {
    return (
      <td
        className={pick.current ? 'currentPick' : null}
        key={pick.key}
      >
        {pick.current ? '(c)' : null}
      </td>
    )
  }

  render() {
    const draft = this.props.draft
    const rounds = this.picksToRounds({
      picks: draft.picks.slice(0),
      size: draft.teams.length
    })

    return (
      <table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            {draft.teams.map(function(team) {
              return <th key={team.name}>{team.name}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {rounds.map(function(round, i) {
            return (
              <tr key={`round${i}`}>
                <th>{i+1}</th>
                {round.map(function(pick, j) {
                  return !pick.athlete ? this.renderBlankPick(pick) : (
                    <td key={`pick-${i}-${j}`}>
                      <Athlete
                        athlete={pick.athlete}
                      />
                    </td>
                  )
                }, this)}
              </tr>
            )
          }, this)}
        </tbody>
      </table>
    )
  }

}

const mapStateToProps = ({ draft }) => ({ draft: draft.draft })
const mapDispatchToProps = (dispatch) => ({
  fetchDraft: () => dispatch(asyncActions.fetchDraft()),
  getDraft: () => dispatch(actions.getDraft()),
  makePick: (picks, pick) => dispatch(actions.makePick(picks, pick)),
  // refresh: () => dispatch(asyncActions.refresh()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DraftBoard)

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { delay } from 'lodash'

import actions from '../../actions'
import asyncActions from '../../services'
import Athlete from './Athlete'
import FootballField from '../../assets/football-field.jpg'
import { REFETCH_DELAY } from '../../constants'

const styles = {
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  table: {
    position: 'relative',
  },
  nameHeader: {
    paddingTop: 5,
    minWidth: 200,
    fontSize: '14pt',
  },
  roundHeader: {
    paddingLeft: 5,
    height: 92,
  },
  currentPick: {
    borderRadius: 7,
    outline: "none",
    boxShadow: "inset 0 0 10px 5px #9ecaed",
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 0,
    opacity: .1,
  },
}

class DraftBoard extends Component {
  static propTypes = {
    draft: PropTypes.object,
    fetchDraft: PropTypes.func.isRequired,
    makePick: PropTypes.func.isRequired,
  }

  fetchDraft(draft_id) {
    const fetchAgain = () => { delay(() => { this.fetchDraft(draft_id) }, REFETCH_DELAY) }
    this.props.fetchDraft(draft_id)
      .then(fetchAgain, fetchAgain)
  }

  componentDidMount() {
    this.fetchDraft(this.props.routeParams.draft_id)
  }

  picksToRounds(draft) {
    const picks = draft.picks
    const size = draft.teams.length
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
    if (!haveSetCurrent && draft.on_the_clock) {
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
    while (rounds.length < draft.total_rounds) {
      rounds.push([])
    }
    return rounds
  }

  renderBlankPick(pick) {
    return (
      <td
        style={pick.current ? styles.currentPick : null}
        key={pick.key}
      >
        {pick.current ? (
          <em>On the Clock</em>
        ) : null}
      </td>
    )
  }

  render() {
    const draft = this.props.draft
    const rounds = this.picksToRounds(draft)

    return (
      <div style={styles.container}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>&nbsp;</th>
              {draft.teams.map(function(team) {
                return <th style={styles.nameHeader} key={team.name}>{team.name}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {rounds.map(function(round, round_index) {
              return (
                <tr className={`round-${round_index}`} key={`round${round_index}`}>
                  <th style={styles.roundHeader}>{round_index+1}</th>
                  {round.map(function(pick, pick_index) {
                    return !pick.athlete ? this.renderBlankPick(pick) : (
                      <td key={`pick-${round_index}-${pick_index}`}>
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
        <img role="presentation" src={FootballField} style={styles.background} />
      </div>
    )
  }

}

const mapStateToProps = ({ draft }) => ({
  draft: draft.draft,
  error: draft.error,
})

const mapDispatchToProps = (dispatch) => ({
  fetchDraft: (draft_id) => dispatch(asyncActions.fetchDraft(draft_id)),
  getDraft: () => dispatch(actions.getDraft()),
  makePick: (picks, pick) => dispatch(actions.makePick(picks, pick)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DraftBoard)

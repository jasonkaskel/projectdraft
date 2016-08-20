import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import cx from 'classnames'

import actions from '../../actions'
import asyncActions from '../../services'
import SearchAthletes from './SearchAthletes'
import Athlete from './Athlete'

class CurrentPick extends Component {
  static propTypes = {
    clearCurrentPick: PropTypes.func,
    makePick: PropTypes.func,
    currentPick: PropTypes.object,
    currentTeam: PropTypes.object,
    isMakingPick: PropTypes.bool,
  }

  renderConfirmPick() {
    return (
      <div>
        <Athlete athlete={this.props.currentPick} />
        <Button
          className={cx({disabled: this.props.isMakingPick})}
          onClick={(e) => this.props.makePick(this.props.currentPick, this.props.currentTeam)}
        >
          Set Pick
        </Button>
        <Button
          className={cx({disabled: this.props.isMakingPick})}
          onClick={(e) => this.props.clearCurrentPick()}
        >
          Cancel
        </Button>
      </div>
    )
  }

  renderSearch() {
    return (
      <SearchAthletes
        key={`SearchAthletes--${this.props.currentTeam.id}`}
      />
    )
  }

  render() {
    return this.props.currentPick ?
      this.renderConfirmPick() :
      this.renderSearch()
  }

}

const mapDispatchToProps = (dispatch) => ({
  clearCurrentPick: () => dispatch(actions.setCurrentPick(null)),
  makePick: (athlete, team) => dispatch(asyncActions.makePick(athlete, team)),
})

const mapStateToProps = ({ draft }) => ({
  currentPick: draft.currentPick,
  isMakingPick: draft.isMakingPick,
})

export default connect(mapStateToProps, mapDispatchToProps)(CurrentPick)

import React, { Component, PropTypes } from 'react'

class RoundHeader extends Component {
  static propTypes = {
    roundNumber: PropTypes.number,
    pickNumber: PropTypes.number,
  }

  render() {
    return (
      <th style={{verticalAlign:"top"}}>
        <div className="roundNumber">
          Round {this.props.roundNumber}
        </div>
        <div className="pickNumber">
          Pick {this.props.pickNumber}
        </div>
      </th>
    )
  }

}

export default RoundHeader

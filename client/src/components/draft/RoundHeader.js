import React from 'react'

const styles = {
  picksHeaderCell: {
    verticalAlign: "top",
    minWidth: 92,
  },
  picksHeaderContainer: {
    marginLeft: "1em",
    marginRight: "1em",
  },
}
export default class RoundHeader extends React.Component {
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

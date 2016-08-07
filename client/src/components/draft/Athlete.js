import React, { Component, PropTypes } from 'react'

const styles = {
  playerCard: {
    minWidth: "202px",
    minHeight: "92px",
    border: "1px solid black",
    marginLeft: "1px",
    marginRight: "1px",
    marginBottom: ".25em",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  positionContainer: {
    width: "65px",
    height: "90px",
    fontSize: "24pt",
    fontWeight: "bold",
    float: "left",
    position: "relative",
  },
  position: {
    position: "relative",
    top: "50px",
  },
  photo: {
    opacity: 0.5,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    zIndex: -1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  bio: {
    minWidth: "135px",
  },
  name: {
    fontSize: "16pt",
    fontWeight: "bold",
    paddingTop: "10px",
  },
  teamBye: {
    fontSize: "10pt",
  },
}

export default class Athlete extends Component {
  static propTypes = {
    athlete: PropTypes.object,
  }

  render() {
    const { athlete } = this.props
    const POSITION_COLORS = {
      QB: "red",
      WR: "yellow",
      RB: "blue",
      TE: "green",
      K: "orange",
      DEF: "purple"
    }

    const PositionMaskStyle = {
      background: `url('${athlete.photo_url}') ${POSITION_COLORS[athlete.position]}`
    }

    return (
      <div style={styles.playerCard}>
          <div style={styles.positionContainer}>
            <div style={styles.position}>{athlete.position}</div>
            <div style={Object.assign({}, styles.photo, PositionMaskStyle)}></div>
          </div>
          <div style={styles.bio} className="clearfixAfter">
            <div style={styles.name}>
              { athlete.name.length < 12 ?
                athlete.name :
                athlete.short_name }
            </div>
            <div style={styles.teamBye}>
              {athlete.team} - Bye Week {athlete.bye_week }
            </div>
          </div>
      </div>
    )
  }
}

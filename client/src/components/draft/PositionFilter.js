import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ButtonGroup, Button } from 'react-bootstrap'
import cx from 'classnames'

import actions from '../../actions'

const styles = {
  filterButtonGroup: {
    width: "100%",
  },
  filterButton: {
    width: "16.7%",
  },
}

class PositionFilter extends Component {

  static propTypes = {
    updateSearchFilters: PropTypes.func.isRequired,
  }

  currentPositions(filters) {
    return ["QB","WR","RB","TE","K","DEF"].map(position => {
      return {
        position,
        on: filters.includes(position)
      }
    })
  }

  render() {
    const positions = this.currentPositions(this.props.filters)

    return (
      <ButtonGroup style={styles.filterButtonGroup}>
        {positions.map(p => {
          return (
            <Button
              key={`PositionFilter--${p.position}`}
              className={cx("btn-sm", {"disabled": !p.on})}
              style={styles.filterButton}
              onClick={(e) => this.props.updateSearchFilters(p.position, !p.on)}
            >
              {p.position}
            </Button>
          )
        })}
      </ButtonGroup>
    )
  }
}

const mapStateToProps = ({ draft }) => ({
  filters: draft.searchFilters
})

const mapDispatchToProps = (dispatch) => ({
  updateSearchFilters: (position, toggle) => dispatch(actions.updateSearchFilters(position, toggle))
})

export default connect(mapStateToProps, mapDispatchToProps)(PositionFilter)

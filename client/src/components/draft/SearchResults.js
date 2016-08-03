import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { partition } from 'lodash'

import actions from '../../actions'
import asyncActions from '../../services'
import Athlete from './Athlete'

const styles = {
  searchResult: {
    marginBottom: "2px",
  },
  available: {
    cursor: "pointer",
  },
  unavailable: {
    color: "grey",
    cursor: "not-allowed",
    background: "repeating-linear-gradient(45deg, rgba(255, 0, 0, 0.2), rgba(255, 0, 0, 0.2) 5px, rgba(255, 0, 0, 0.3) 5px, rgba(255, 0, 0, 0.3) 10px)"
  },
}

class SearchResults extends Component {

  static propTypes = {
    fetchAthletes: PropTypes.func,
    setCurrentPick: PropTypes.func,
    athletes: PropTypes.array,
    searchTerm: PropTypes.string,
    searchFilter: PropTypes.array,
  }

  componentWillMount() {
    if (!this.props.athletes) {
      this.props.fetchAthletes()
    }
  }

  filterResults({ athletes, searchTerm, searchFilters }) {
    if (!athletes) return []

    return athletes.filter(athlete => {
      return searchFilters.includes(athlete.position) &&
        athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }

  partitionResults(filtered) {
    return partition(
      filtered,
      (athlete) => athlete.pick === null
    )
  }

  render() {
    const filtered = this.filterResults(this.props)
    const [available, taken] = this.partitionResults(filtered)

    return (
      <div>
        {available.map(a => {
          return (
            <div
              className="searchResult"
              style={Object.assign({}, styles.searchResult, styles.available)}
              key={`search-result-${a.id}`}
              onClick={(e) => this.props.setCurrentPick(a)}
            >
              <Athlete athlete={a} />
            </div>
          )
        })}
        {taken.map(a => {
          return (
            <div
              style={Object.assign({}, styles.searchResult, styles.unavailable)}
              key={`search-result-${a.id}`}
            >
              <Athlete
                athlete={a}
                unavailable={true}
              />
            </div>
          )
        })}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchAthletes: () => dispatch(asyncActions.fetchAthletes()),
  setCurrentPick: (athlete) => dispatch(actions.setCurrentPick(athlete)),
})

const mapStateToProps = ({ draft }) => ({
  searchTerm: draft.searchTerm,
  searchFilters: draft.searchFilters,
  athletes: draft.athletes,
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults)

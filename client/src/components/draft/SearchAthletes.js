import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  Addon,
  FormGroup,
  InputGroup,
  FormControl,
  Glyphicon } from 'react-bootstrap'

import actions from '../../actions'
import PositionFilter from './PositionFilter'
import SearchResults from './SearchResults'

const styles = {
  blankSearch: {
    display: "inline-block",
    width: "100%",
    paddingRight: "1em",
    marginBottom: 0,
    fontSize: 16,
  },
  searchContainer: {
    width: "100%",
  },
  searchBox: {
    fontSize: 16,
  }
}

class SearchAthletes extends Component {
  static propTypes = {
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.func,
  }

  render() {
    return (
      <div style={styles.searchContainer}>
        <PositionFilter />
        <FormGroup style={styles.searchBox}>
          <InputGroup>
            <FormControl type="text" autoFocus
              ref="searchInput"
              value={this.props.searchTerm}
              onChange={(e) => this.props.setSearchTerm(e.target.value)}
            />
            <InputGroup.Addon>
              <Glyphicon glyph="search" />
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <SearchResults />
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  setSearchTerm: (term) => dispatch(actions.setSearchTerm(term)),
})

const mapStateToProps = ({ draft }) => ({
  searchTerm: draft.searchTerm,
  athletes: draft.athletes,
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchAthletes)

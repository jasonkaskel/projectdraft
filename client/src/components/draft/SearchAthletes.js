import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import {
  Addon,
  FormGroup,
  InputGroup,
  FormControl,
  Glyphicon } from 'react-bootstrap'

import actions from '../../actions'
import PositionFilter from './PositionFilter'
import SearchResults from './SearchResults'

class SearchAthletes extends Component {
  static propTypes = {
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.func,
  }

  renderBlankSearch() {
    return (
      <FormGroup>
        <InputGroup>
          <FormControl type="text" autoFocus
            onChange={(e) => this.props.setSearchTerm(e.target.value)}
          />
          <InputGroup.Addon>
            <Glyphicon glyph="search" />
          </InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    )
  }

  renderSearch() {
    return (
      <div>
        <PositionFilter />
        <FormGroup>
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

  render() {
    return isEmpty(this.props.searchTerm) ?
      this.renderBlankSearch() :
      this.renderSearch()
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

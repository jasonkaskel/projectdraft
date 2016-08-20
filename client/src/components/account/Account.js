import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import asyncActions from '../../services'

class Account extends Component {
  static propTypes = {
    drafts: PropTypes.array,
    error: PropTypes.string,
    fetchDrafts: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.fetchDrafts()
  }

  render() {
    return (
      <div>
        <h1>Your Drafts</h1>
        <ul>
          {this.props.drafts.map( draft =>
            <li key={draft.id}>
              <span>{draft.name}</span> |
              &nbsp;<a href={`/drafts/${draft.id}`}>Board</a> |
              &nbsp;<a href={`/drafts/${draft.id}/picks`}>Current Pick</a>
            </li>
          )}
        </ul>
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => ({
  fetchDrafts: () => dispatch(asyncActions.fetchDrafts()),
})

const mapStateToProps = ({ draft }) => ({
  drafts: draft.drafts,
  error: draft.fetchDraftsError,
})

export default connect(mapStateToProps, mapDispatchToProps)(Account)

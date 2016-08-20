import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import BurgerMenu from 'react-burger-menu';

import asyncActions from '../../services'

class AccountNav extends Component {
  static propTypes = {
    drafts: PropTypes.array,
    error: PropTypes.string,
    fetchDrafts: PropTypes.func.isRequired,
  }

  render() {
    console.log(this)
    return (
      <div>
        <BurgerMenu.slide right>
          <h2>Thing</h2>
        </BurgerMenu.slide>
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountNav)

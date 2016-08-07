import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import asyncActions from '../../services'

class Login extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
  }

  componentDidMount() {
    if (this.props.location.query.token) this.props.login(this.props.location.query.token)
  }

  render() {
    return (
      <div>
        Some loading screen.
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: (token) => dispatch(asyncActions.login(token)),
})

export default connect(null, mapDispatchToProps)(Login)

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import asyncActions from '../../services'

class Login extends Component {
  static propTypes = {
    token: PropTypes.string,
    login: PropTypes.func.isRequired,
  }

  componentDidMount() {
    if (this.props.token) this.props.login(this.props.token)
  }

  render() {
    return (
      <div>
        Some loading screen.
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  token: ownProps.routeParams.token,
})

const mapDispatchToProps = (dispatch) => ({
  login: (token) => dispatch(asyncActions.login(token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)

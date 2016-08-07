import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import asyncActions from '../../services'

class Login extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  static propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
  }

  redirectWhenLoggedIn() {
    if (this.props.loggedIn) {
      this.context.router.push('/pick')
    }
  }

  componentDidMount() {
    if (this.props.location.query.token) this.props.login(this.props.location.query.token)
    this.redirectWhenLoggedIn()
  }

  componentDidUpdate() {
    this.redirectWhenLoggedIn()
  }

  render() {
    return (
      <div>
        Some loading screen.
      </div>
    )
  }
}

const mapStateToProps = ({ login }) => ({
  loggedIn: login.loggedIn
})

const mapDispatchToProps = (dispatch) => ({
  login: (token) => dispatch(asyncActions.login(token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)

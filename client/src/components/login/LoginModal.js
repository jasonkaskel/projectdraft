import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Modal, Form, FormGroup, ControlLabel, FormControl, Button, Alert } from 'react-bootstrap'

import actions from '../../actions'
import asyncActions from '../../services'

class Login extends Component {
  static propTypes = {
    loginDisabled: PropTypes.bool,
    error: PropTypes.string,
    emailOrCell: PropTypes.string,
    caller: PropTypes.object,
    showLogin: PropTypes.bool,
    token: PropTypes.string,
    requestToken: PropTypes.func.isRequired,
    hideLogin: PropTypes.func.isRequired,
    setEmailOrCell: PropTypes.func.isRequired,
  }

  handleKeyDown(evt) {
    if (evt.keyCode === 13) {
      evt.preventDefault()
      this.props.requestToken(this.props.emailOrCell)
    }
  }

  render() {
    let message = this.props.error ? (
      <Alert bsStyle="danger">{this.props.error}</Alert>
    ) : null

    if ((0 || process.env.NODE_ENV === 'development') && !message && this.props.token) { // TODO: hook up postmark/twilio to send these links instead
      message = (
        <Alert bsStyle="success">
          <a href={`http://projectdraft.dev:3000/login?token=${this.props.token}`}>Login</a>
        </Alert>
      )
    }

    return (
      <Modal
        show={this.props.showLogin}
        onHide={close}
        container={this.props.caller}
        aria-labeledby="login-modal"
      >
        <Modal.Header>
          <Modal.Title id="login-modal">
            Login
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message}
          <Form inline onKeyDown={(e) => {this.handleKeyDown(e)}}>
            <FormGroup controlId="formInlineName">
              <ControlLabel>Enter Email or Cell Number</ControlLabel>
              {' '}
              <FormControl type="text" placeholder="Email or Cell Number"
                onChange={(e) => {this.props.setEmailOrCell(e.target.value)}}
              />
            </FormGroup>
            {' '}
            <Button type="button"
              onClick={(e) => {this.props.requestToken(this.props.emailOrCell)}}
            >
              Send Login Link
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }
}

const mapStateToProps = ({ login }, ownProps) => ({
  showLogin: login.showLogin,
  emailOrCell: login.emailOrCell,
  loginDisabled: login.loginDisabled,
  error: login.error,
  token: login.token,
})

const mapDispatchToProps = (dispatch) => ({
  hideLogin: () => dispatch(actions.hideLogin()),
  setEmailOrCell: (emailOrCell) => dispatch(actions.setEmailOrCell(emailOrCell)),
  requestToken: (emailOrCell) => dispatch(asyncActions.requestToken(emailOrCell)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)

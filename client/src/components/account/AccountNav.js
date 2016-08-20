import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

import asyncActions from '../../services'

class AccountNav extends Component {
  static propTypes = {
    drafts: PropTypes.array,
    error: PropTypes.string,
    fetchDrafts: PropTypes.func.isRequired,
  }

  render() {
    return (
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#">Link</NavItem>
            <NavItem eventKey={2} href="#">Link</NavItem>
            <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">Link Right</NavItem>
            <NavItem eventKey={2} href="#">Link Right</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
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

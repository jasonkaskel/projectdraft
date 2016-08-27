import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { Panel, ListGroup,
  ListGroupItem }           from 'react-bootstrap'
import { Link }             from 'react-router'
import asyncActions         from '../../services'
import LoadingPage          from '../LoadingPage'

class Commish extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)

    this.draftOrder = this.draftOrder.bind(this)
  }

  draftOrder() {
    const { draftId } = this.props.routeParams
    this.context.router.transitionTo('CommishOrder', {draftId})
  }

  componentDidMount() {
    console.log(this)
    const { draftId } = this.props.routeParams
    if (!this.props.draft || this.props.draft.id !== draftId) this.props.fetchDraft(draftId)
  }

  render() {
    const { draftId } = this.props.routeParams
    const { draft } = this.props
    if (!draft.name) return <LoadingPage />

    return (
      <Panel>
        <h4>{draft.name}</h4>
        <ListGroup>
          <ListGroupItem>
            <Link to={`/drafts/${draftId}/commish/order`}>Set Order</Link>
          </ListGroupItem>
          <ListGroupItem disabled>Change Settings</ListGroupItem>
          <ListGroupItem disabled>Edit Teams</ListGroupItem>
        </ListGroup>
      </Panel>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchDraft: (draftId) => dispatch(asyncActions.fetchDraft(draftId)),
})

const mapStateToProps = ({ draft }) => ({
  draft: draft.draft,
})

export default connect(mapStateToProps, mapDispatchToProps)(Commish)

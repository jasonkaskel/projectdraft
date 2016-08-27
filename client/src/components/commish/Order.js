import React, { Component }   from 'react'
import { connect }            from 'react-redux'
import { Panel, ListGroup, Button }   from 'react-bootstrap'
import { DragDropContext }    from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend'
import asyncActions           from '../../services'
import actions                from '../../actions'
import DraggableListGroupItem from './DraggableListGroupItem'

class Order extends Component {
  constructor(props, context) {
    super(props, context)

    this.moveCard = this.moveCard.bind(this)
    this.updateOrder = this.updateOrder.bind(this)
  }

  componentDidMount() {
    const { draftId } = this.props.routeParams
    if (this.props.draft.id !== draftId) this.props.fetchDraft(draftId)
  }

  moveCard(dragIndex, hoverIndex) {
    const { teams } = this.props.draft
    const dragTeam = teams[dragIndex]

    this.props.reorderTeams({
      dragged: dragIndex,
      hovered: hoverIndex,
      team:    dragTeam
    })
  }

  updateOrder() {
    const { draftId } = this.props.routeParams
    const { draft } = this.props
    this.props.updateDraftOrder(draftId, draft)
  }

  render() {
    return (
      <Panel>
        <h3>Set Draft Order</h3>
        <ListGroup>
          {this.props.draft.teams.map((team, i) => (
            <DraggableListGroupItem
              key={`draggable-${team.id}`}
              index={i}
              moveCard={this.moveCard}
            >
              {team.name}
            </DraggableListGroupItem>
          ))}
        </ListGroup>
        <Button onClick={this.updateOrder}>Update Order</Button>
      </Panel>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchDraft: (draftId) => dispatch(asyncActions.fetchDraft(draftId)),
  reorderTeams: ({ dragged, hovered, team }) => dispatch(actions.reorderTeams({ dragged, hovered, team })),
  updateDraftOrder: (draftId, draft) => dispatch(asyncActions.updateDraftOrder(draftId, draft)),
})

const mapStateToProps = ({ draft }) => ({
  draft: draft.draft,
})

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(connect(mapStateToProps, mapDispatchToProps)(Order))

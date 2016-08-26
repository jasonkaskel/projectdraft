import React, { Component, PropTypes } from 'react'
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'

import asyncActions from '../../services'

const styles = {
  link: {
    paddingRight: 5,
    paddingLeft: 5,
  },
}

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
    if (!this.props.drafts) return null

    return (
      <Panel header="Your drafts">
        <ListGroup>
          {this.props.drafts.map( draft =>
            <ListGroupItem header={draft.name} key={draft.id}>
              <a style={styles.link} href={`/drafts/${draft.id}`}>Board</a>|
              <a style={styles.link} href={`/drafts/${draft.id}/picks`}>Current Pick</a>
              {draft.is_commissioner &&
                <span>
                  <span>|</span>
                  <a style={styles.link} href={`/drafts/${draft.id}/commish`}>
                    <FontAwesome name='cog' />
                   </a>
                </span>
              }
            </ListGroupItem>
          )}
        </ListGroup>
      </Panel>
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

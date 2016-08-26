import React, { Component } from 'react'
import { Jumbotron, Tabs, Tab } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import gifffer from 'gifffer'

import Account from '../../components/account/Account'
import BoardSimulation from '../../assets/board_simulation.gif'
import PickSimulation from '../../assets/pick_simulation.gif'

const styles = {
  container: {
    padding: '1em',
    maxWidth: 600,
  },
  intro: {
    borderRadius: '10px',
    margin: '0 auto 1em auto',
    padding: '1em',
  },
  description: {
    textAlign: 'left',
  },
  tab: {
    minWidth: '49%',
  }
}

export default class Splash extends Component {
  componentDidMount() {
    gifffer()
  }

  render() {
    const tvIcon = (
      <span>
        <FontAwesome name='television' size='2x' />
        <span>Draft Board</span>
      </span>
    )
    const mobileIcon = (
      <span>
        <FontAwesome name='mobile' size='2x' />
        <span>Picker</span>
      </span>
    )

    return (
      <div style={styles.container}>
        <Jumbotron style={styles.intro}>
          <h1>Project Draft</h1>
          <p style={styles.description}>An in-person draft experience that
          provides a digital draft board, and a mobile picker
          with search and filter capabilities.</p>
        </Jumbotron>
        <Account />
        <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
          <Tab tabClassName="splashTab" eventKey={1} title={tvIcon}>
            <img role="presentation" data-gifffer={BoardSimulation} />
          </Tab>
          <Tab tabClassName="splashTab" eventKey={2} title={mobileIcon}>
            <img role="presentation" data-gifffer={PickSimulation} />
          </Tab>
        </Tabs>
      </div>
    )
  }

}

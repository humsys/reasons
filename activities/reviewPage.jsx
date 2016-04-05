import React from 'react'
import { NavBar, NavButton, Title } from 'react-ratchet'
import { Pager } from '../utils/widgets.jsx'

import Assessment from './assessment.jsx'
import LocalReviews from './localReviews'


export default class ActivitiesReviewPage extends React.Component {

  constructor(props){
    super(props)
    LocalReviews.setActivitiesSource(props.activitySource)
    this.state = { activities: props.activities }
  }

  componentWillMount(){
    LocalReviews.onActivitiesForReviewAvailable(
      (activities) => this.setState({activities: activities})
    )
  }

  onSkipped(activity){
    LocalReviews.wasReviewed(activity, 'skipped')
  }

  onWasAssessed(activity, how, reason){
    let { activitySource, wasReviewed } = this.props
    if (wasReviewed) wasReviewed(activity)
    LocalReviews.wasReviewed(activity, how)
  }

  unskip(){
    LocalReviews.removeFeeling('skipped')
  }

  render(){
    let { user } = this.props
    let { activities } = this.state
    if (!activities) return <div>Loading...</div>
    let hasSkipped = LocalReviews.hasFeeling('skipped')
    if (!activities.length) return <div className="content content-padded">
      No activity to review! Just use Chrome for 20 minutes or so.
      {
        hasSkipped && <a onClick={() => this.unskip()}>Show skipped</a>
      }
    </div>
    return <Pager>
      <NavBar> <Title>Assess!</Title> </NavBar>
      <div className="content content-padded">
        {
          activities.map(a => (
            <Assessment
              onSkipped={x => this.onSkipped(x)}
              onWasAssessed={(a,h,r) => this.onWasAssessed(a,h,r)}
              activity={a}
              key={`${a.blame} ${a.over[0]}`}
              />
          ))
        }
      </div>
    </Pager>
  }

}

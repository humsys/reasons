import React from 'react'
import moment from 'moment'
import url from 'url'

import {
  LabelizingTextField,
  TableRenderer,
  ButtonBar,
  Pager
} from '../utils/widgets.jsx'

import {ReasonCell, ReasonLabel} from '../cell.jsx'
import ReasonPickerModal from '../pickerModal.jsx'
import Reasons from '..'

let DAYS = 24*60*60*1000




export default class ActivityAssessment extends React.Component {

  constructor(props){
    super(props)
    this.state = { active: false, reason: null }
  }

  clicked(x){
    if (!this.state.reason || !this.state.reason.id) return
    let {onWasAssessed, activity} = this.props
    Reasons.pushAssessment(activity, x, this.state.reason)
    onWasAssessed(activity, x, this.state.reason)
  }

  setState(x){
    if (x.reason === undefined) return super.setState(x)
    if (x.reason && x.reason.id) x.matches = null
    else if (!x.reason){
      Reasons.commonForActivity(this.props.activity, 3).then(
        m => this.setState({matches: m})
      )
    } else {
      Reasons.completions(null, this.state.reason, 3).then(
        m => this.setState({matches: m})
      )
    }
    super.setState(x)
  }

  render(){
    let { active, reason, matches } = this.state
    let solidReason = reason && reason.id
    let { activity } = this.props
    let elapsed = moment.duration(activity.elapsed).humanize()
    let span = activity.over[1] - activity.over[0]
    var timeframe = moment(activity.over[0]).format('dddd'), connective = 'on'
    if (span > 2*DAYS){
      connective = 'over'
      timeframe = moment.duration(span).humanize()
    }
    let hostname = url.parse(activity.blame).host

    return <div className="Assessment Activity">
      <img src={activity.favIconUrl}/>
      <b>{elapsed}</b>

      <div>
        <LabelizingTextField
          placeholder={`Why ${hostname}?`}
          renderer={ReasonLabel}
          value={reason}
          focus={active}
          onCleared={() => this.setState({reason:null, active:true})}
          onFocusChanged={x => this.setState({active:x})}
          onTyped={text => this.setState({reason:text})}
          accessory={
            <a className="accessory"
              onClick={() => {
                this.context.pager.pushSubpage(
                <ReasonPickerModal
                  onPicked={obj => this.setState({reason:obj})}
                  />
                )
              }}
              >
              <span className="icon icon-plus"/>
            </a>
          }
          />
      </div>

      <TableRenderer
        list={matches}
        cells={ReasonCell}
        onClicked={obj => this.setState({reason: obj})}
        />

      {
        solidReason && <ButtonBar
          onClicked={x => this.clicked(x)}
          disabled={!reason || !reason.id}
          buttons={[
            ["Not good for this", "trash", "nogood"],
            ["Worked out", "star", "good"]
          ]}/>
      }


      <div className="Details">
        You were <b>{activity.verbPhrase}</b> like {activity.examples}
        <div className="tstamp">
          {connective} {timeframe}
        </div>
      </div>

      <div className="footer">
        <a onClick={() => this.props.onSkipped(activity)}>
          <span className="icon icon-refresh"/>
          Ask me later
        </a>
      </div>
    </div>
  }

}

ActivityAssessment.contextTypes = {
  pager: React.PropTypes.instanceOf(Pager)
}





// import EntryField from '../entryfield.jsx'
// export default class AssessmentCard extends Component {
//
//   setReason(r){
//     this.setState({reasons: r})
//     console.log(r)
//   }
//
//   done(how){
//     let {onComplete, activity} = this.props
//     onComplete(activity, how, this.state.reason)
//   }
//
//   render(){
//     let {activity} = this.props
//     let elapsed = moment.duration(activity.elapsed).humanize()
//     let timeframe = moment.duration(activity.over[1] - activity.over[0]).humanize()
//
//     return (
//       <div className="card">
//         <TableView>
//           <TableViewCell>
//             {elapsed} over {timeframe},
//             {activity.desc.was}: {activity.blame}
//           </TableViewCell>
//           <TableViewCell>
//             {activity.desc.details}
//           </TableViewCell>
//           <TableViewCell>
//             <EntryField onAdded={this.setReason} placeholder="add a reason" />
//           </TableViewCell>
//           <TableViewCell>
//             <a onClick={this.done.bind(this, 'bad')}>Bad choice</a>
//             <a onClick={this.done.bind(this, 'skip')}>Skip</a>
//             <a onClick={this.done.bind(this, 'good')}>Good choice</a>
//           </TableViewCell>
//         </TableView>
//       </div>
//     )
//   }
//
// }

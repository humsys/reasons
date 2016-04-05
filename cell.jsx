import React from 'react'
import { TableViewCell, Button } from 'react-ratchet'
import { TextField } from './utils/widgets.jsx'
import Reasons from '.'


export const ReasonCell = ({x, onClick}) => {
  let sentence = Reasons.sentence(x.type)
  let relationSentence = Reasons.relationSentence(x.rel)
  return <TableViewCell onClick={onClick}>
    {sentence[0]}
    <b>{x.title}</b>
    {sentence[1]}
    {
      x.rel && <div className="relHint">
        (
          {relationSentence[0]}
          <b>{x.rel[1]}</b>
          {relationSentence[1]}
        )
      </div>
    }
  </TableViewCell>
}


export class ReasonAdderCell extends React.Component {

  constructor(props){
    super(props)
    this.state = { active: false, text: "" }
  }

  makeReason(){
    let {text} = this.state
    let {type} = this.props
    if (!text) return
    let r = Reasons.addReason(type, text)
    this.props.onAdded(r)
  }

  render(){
    let {text, active} = this.state
    let {type} = this.props
    let sentence = Reasons.sentence(type)
    return <TableViewCell
      onClicked={() => this.setState({active:true})}
      >
      {sentence[0]}
      <TextField
        value={text}
        focus={active}
        onFocusChanged={x => this.setState({active:x})}
        onTyped={text => this.setState({text:text})}
        onSubmitted={() => this.makeReason()}
        />
      {sentence[1]}
      {
        active &&
        <Button
          disabled={!text}
          onClick={() => this.makeReason()}
          >
          Make a reason
        </Button>
      }
    </TableViewCell>
  }

}

import React from 'react'
import {
  TextField,
  Modal,
  Pager,
  Tabs,
  TableRenderer
} from './utils/widgets.jsx'

import { ReasonCell, ReasonAdderCell } from './cell.jsx'
import Reasons from '.'



export default class ReasonPickerModal extends React.Component {

  constructor(props){
    super(props)
    this.state = { text: "", type: Reasons.types()[0] }
  }

  componentDidMount(){
    Reasons.completions(this.state.type, "", 200).then(
      m => this.setState({matches: m})
    )
  }

  setState(x){
    if (x.text === undefined && !x.type) return super.setState(x)
    let newType = x.type || this.state.type
    let newText = x.text === undefined ? this.state.text : x.text
    Reasons.completions(newType, newText, 200).then(
      m => this.setState({matches: m})
    )
    super.setState(x)
  }

  render(){
    let {text, type, matches, active} = this.state
    let onPicked = (obj) => {
      this.context.pager.popSubpage()
      this.props.onPicked(obj)
    }
    return <Modal title="Reasons">
      <nav className="bar bar-standard bar-header-secondary">
        <TextField
          placeholder="Filter reasons..."
          value={text}
          focus={active}
          onFocusChanged={x => this.setState({active:x})}
          onTyped={text => this.setState({text:text})}
          />
      </nav>
      <div className="content">
        <Tabs
          states={Reasons.types()}
          state={type}
          onChanged={t => this.setState({type:t})}
          />
        <TableRenderer
          firstCell={
            <ReasonAdderCell type={type} onAdded={onPicked}/>
          }
          list={matches}
          cells={ReasonCell}
          onClicked={onPicked}
          />
      </div>
    </Modal>
  }

}

ReasonPickerModal.contextTypes = {
  pager: React.PropTypes.instanceOf(Pager)
}




// export default class ReasonBrowser extends Component {
//
//   render(){
//     let {type} = this.state || {type: "furtherance"}
//     let pager = this.context.pager
//     return (
//       <div>
//         <NavBar>
//           <NavButton left onClick={pager.popSubpage}>Close</NavButton>
//           <NavButton right icon="compose" onClick={this.addReason} />
//           <Title>Reasons</Title>
//         </NavBar>
//
//         <nav className="bar bar-standard bar-header-secondary">
//           <SegmentedControl>
//             {
//               Reasons.types().map(x => (
//                 <ControlItem
//                   onClick={() => this.setState({type: x})}
//                   active={type == x}
//                   >
//                   {x}
//                 </ControlItem>
//               ))
//             }
//           </SegmentedControl>
//         </nav>
//
//         <TableView>
//           {
//             Reasons.reasonsOfType(type).map(x => (
//               <TableViewCell> {x.title} </TableViewCell>
//             ))
//           }
//         </TableView>
//       </div>
//     )
//   }
//
// }

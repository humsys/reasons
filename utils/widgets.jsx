import React from 'react'
import {
  NavBar,
  NavButton,
  Title,
  TableView,
  TableViewCell,
  SegmentedControl,
  ControlItem
} from 'react-ratchet'


export const Tabs = ({states, state, onChanged}) => (
  <SegmentedControl>
    {
      states.map( s =>
        <ControlItem
          key={s}
          onClick={() => onChanged(s)}
          active={s == state}
          >
          {s}
        </ControlItem>
      )
    }
  </SegmentedControl>
)



export const TableRenderer = ({list, cells, firstCell, onClicked}) => {
  let CellRenderer = cells
  // if (!CellRenderer) throw "What the fuck!"
  // console.log('CellRenderer', CellRenderer)
  if (!firstCell && (!list || !list.length)) return <div></div>
  if (!list) list = []
  let cellList = list.map(
    i => <CellRenderer x={i} onClick={() => onClicked(i)}/>
  )
  if (firstCell) cellList.unshift(firstCell)
  return <TableView> { cellList } </TableView>
}



export const LabelizingTextField = (props) => {
  if (!props.value || !props.value.id){
    return <form className="LabelizingTextField">
      <TextField {...props} />
      {props.accessory}
    </form>
  }

  let Label = props.renderer
  return <div>
    <Label x={props.value}/>
    <a onClick={props.onCleared}>
       <span className="icon icon-close"></span>
    </a>
  </div>
}


/// BIGGER ONES: Pager and TextField

export class Pager extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
  }
  pushSubpage(x){
    // console.log('pushSubpage', x)
    this.setState({subpage: x})
  }

  popSubpage(){
    this.setState({subpage: null})
  }

  render(){
    // console.log(this.state.subpage)
    if (this.state.subpage) return this.state.subpage
    else return <div>{this.props.children}</div>
  }

  getChildContext() {
    return {pager: this}
  }
}

Pager.childContextTypes = {
  pager: React.PropTypes.instanceOf(Pager)
}


export class TextField extends React.Component {

  // onStatus, onTyped, onSubmitted

  render(){
    return <input
      type="search"
      tabIndex="-1"
      value={this.props.value}
      placeholder={this.props.placeholder}
      onChange={this.onChange.bind(this)}
      onKeyDown={this.onKeyDown.bind(this)}
      onFocus={() => this.props.onFocusChanged(true)}
      onBlur={() => this.props.onFocusChanged(false)}
    />
  }

  onChange(evt){
    this.props.onTyped(evt.currentTarget.value)
  }

  onKeyDown(evt){
    let {value, onSubmitted} = this.props
    if (evt.key == 'Enter' && value && onSubmitted) onSubmitted(value)
  }

  componentDidMount(){
    // if (this.props.focus) this.refs.input.focus()
    // if (this.props.focus === false) this.refs.input.blur()
  }

}

export const ButtonBar = ({buttons, disabled, onClicked}) => (
  <nav className="ButtonBar">
    {
      buttons.map(x => (
        <a
          key={x[0]}
          className={`ButtonBarButton ${disabled && "disabled"}`}
          onClick={() => onClicked(x[0])}
          >
          <span className={`icon icon-${x[1]}`}></span>
          <span>{x[0]}</span>
        </a>
      ))
    }
  </nav>
)

export const Modal = ({title, children}, {pager}) => (
  <div>
    <NavBar>
      <NavButton left onClick={() => pager.popSubpage()}>Close</NavButton>
      <Title>{title}</Title>
    </NavBar>
    {children}
  </div>
)

Modal.contextTypes = {
  pager: React.PropTypes.instanceOf(Pager)
}

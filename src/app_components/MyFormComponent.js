import React from 'react';
import {DropComponent} from './DropComponent';
import {ButtonComponent, IconTitleButtonComponent, ToggleButtonComponent} from './ButtonComponent';
import './MyFormComponent.css';

function MyFormComponent(props){
  // props: question_list:
  // array of object {question, default_val, type, setFunc}
  // question: string
  // default_val: any type of data object
  // type: string of form type
  // setfunc: function to execute when click submit
  const current_status = props.question_list.map(q => 
    SetHelper(q.default_val)
  );
  const handleSubmit = () => {
    current_status.forEach((status, i)=> {
      props.question_list[i].setFunc(status.current_val);
    });
  }
  const handleCancel = () => {
    current_status.forEach((status, i)=> {
      status.setVal(props.question_list[i].default_val);
    });
  }
  return (
    <div className="form gd g10 fg1">
      {props.question_list.map((q_item, i)=>
        <QuestionItem
          question_item={q_item}
          current={current_status[i]}
          key={`qustion_${i}`}
        />
      )}
      <div className="fx g10">
        <IconTitleButtonComponent
          cls_name={`primary save_and_close`}
          icon_cls_name="check"
          content="save"
          func={handleSubmit}
        />
        <IconTitleButtonComponent
          cls_name={`secondary save_and_close`}
          icon_cls_name="x"
          content="cancel"
          func={handleCancel}
        />
      </div>
    </div>
  );
}

function InputQuestionComponent(props){
  // props:  question, icon_cls_name, val, setVal
  // question: string
  // icon_cls_name: string of icon's classname to describe the question
  // val: object to display the data
  // setVal: function to update parent's state
  const handleInput = (event) => {
    props.setVal(event.target.value);
  }
  return (
    <div className="gd g5 fg1">
      <label htmlFor={props.question}>
        {props.question}
      </label>
      <div className="input_container gd">
        <i className={`${props.icon_cls_name} input_icon`}/>
        <input
          className="input circle_side fiw"
          name={props.question}
          type="text"
          placeholder={props.question}
          value={props.val}
          onChange={handleInput}
        />
      </div>
    </div>
  );
}
function ToggleQuestionComponent(props){
  // props:  question, val, setVal
  // question: string
  // val: object to display the data
  // setVal: function to update parent's state
  const handleClick = () => {
    props.setVal(! props.val);
  }
  return (
    <ToggleButtonComponent
      is_toggled={props.val}
      func={handleClick}
      content={props.question}
    />
  );
}
function SelectQuestionComponent(props){
  // props:  val, setVal, option_list
  // val: object to display the data
  // setVal: function to update parent's state
  // option_list: processed arr of object
  
  const optionList = (
    <div className="option_list gd g5 fg1">
      {props.option_list.map((option, i) =>
        <ButtonComponent
          cls_name={`option save_and_close ${option === props.val ? "selected": ""}`}
          content={option}
          func={()=>{props.setVal(option)}}
          key={`option-${i}`}
        />
      )}
    </div>
  );
  
  return (
    <DropComponent
      title={props.val}
      content={optionList}
      save_close={true}
    />
  );
}

function SetHelper(default_val){
  const [val, setVal] = React.useState(default_val);
  return {"current_val": val, "setVal": setVal};
}
function QuestionItem(props){
  // props: question_item, current
  // question_item: object {question, default_val, type, setFunc, ...}
  // current: object that is reference to question_item's current_status
  switch (props.question_item.type){
    case "input":
      return (
      <InputQuestionComponent
        question={props.question_item.question}
        icon_cls_name={props.question_item.icon_cls_name}
        val={props.current.current_val}
        setVal={props.current.setVal}
      />
      );
    case "select":
      return (
        <SelectQuestionComponent
          question={props.question_item.question}
          option_list={props.question_item.option_list}
          val={props.current.current_val}
          setVal={props.current.setVal}
        />
      );
    case "toggle":
      return (
        <ToggleQuestionComponent
          question={props.question_item.question}
          val={props.current.current_val}
          setVal={props.current.setVal}
        />
      );
    default:
      return <></>;
  }
}

export {MyFormComponent, SelectQuestionComponent};
import React from 'react';
import {ButtonComponent} from './ButtonComponent';
import {showContentEffect, hideContentEffect} from './MyEffect';
import './DropComponent.css';

function ContentDisplayController(){
  const [hide, setHide] = React.useState(true);
  const ref_content = React.useRef(null);
  const toggleOptions = (event) => {
    // possible to be nested, 
    // stop event bubbling to avoid close all content

    event.preventDefault()
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    if (hide){
      setHide(false);
      showContentEffect(ref_content);
      return;
    }
    hideContentEffect(ref_content);
    setTimeout(()=>{ setHide(true);}, 501);
  }
  const handleContentClick = (event) => {
    if (event.target.className.includes("save_and_close") ||
      event.target.parentNode.className.includes("save_and_close")){
        toggleOptions(event);
    }
  }
  return [hide, toggleOptions, handleContentClick, ref_content];
}

function DropComponent(props){
  // props: cls_name, title, content
  // cls_name: string of additional classname
  // title: string or jsx components
  // content: react components
  const [hide, toggleOptions, handleContentClick, ref_content] = ContentDisplayController();
  return (
    <div className={`drop_container ${props.cls_name || ""}`}>
      <ButtonComponent
        cls_name="drop_title"
        func={toggleOptions}
        content={
          <>
            {props.title}
            <i className={`bi bi-chevron-${hide ? "down" : "up"}`}/>
          </>
        }
      />
      <div className={`drop_content ${hide || "z1 pa rd"}`}
        hidden={hide}
        ref={ref_content}
        onClick={handleContentClick}
      >
        {props.content}
      </div>
    </div>
  );
}

function SideBarComponent(props){
  // props: cls_name, title, content
  // cls_name: string of additional classname
  // title: string or jsx component
  // content: jsx component
  const [hide, toggleOptions, handleContentClick, ref_content] = ContentDisplayController();
  return (
    <div className={`drop_container pf z1 ${hide || "fih fiw"}  ${props.cls_name || ""}`}>
      <ButtonComponent
        cls_name="drop_title sidebar_title pa z1"
        func={toggleOptions}
        content={props.title}
      />
      <div className={`${hide || "fg1 sidebar fih fiw"}`}
        hidden={hide}
        onClick={handleContentClick}
        ref={ref_content}
      >
        {props.content}
      </div>
    </div>
  );
}

export {DropComponent, SideBarComponent};
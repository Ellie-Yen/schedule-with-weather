import React from 'react';
import {FadeInEffect, FadeOutEffect} from './MyEffect';
import {CircleButtonComponent} from './ButtonComponent';
import './CardComponent.css';

function CardComponent(props){
  // props: cls_name, name, is_horizon, has_shadow,, content
  // cls_name, name: string of class/ id
  // is_horizon: bool indicates the direction of arrangement
  // has_shadow: bool indicates appearance
  // gap_size: int for gap size
  // content: jsx being wrapped
  let appearance = "";
  if (props.has_shadow){
    appearance += "shadow";
  }
  appearance += ` g${props.gap_size || 10}`;
  const d = props.is_horizon ? "dh": "dv";
  return (
    <div id={props.name}
      className={`card fx ${d} aii jst fg1 rd_big ${appearance} ${props.cls_name || ""}`}
    >
      {props.content}
    </div>
  );
}

function SlideCardsComponent(props){
  // props: content
  // content: array of object for card, see FigCardComponent
  const [page, SetPage] = React.useState(0);
  const ref_card = React.useRef(null);
  const nextPage = () => {
    if (page === props.content.length - 1){
      return;
    }
    FadeOutEffect(ref_card);
    setTimeout(()=> {
      SetPage(page + 1);
    }, 500);
    setTimeout(()=> {
      FadeInEffect(ref_card);
    }, 510);
  }
  const prePage = () => {
    if (page === 0){
      return;
    }
    FadeOutEffect(ref_card);
    setTimeout(()=> {
      SetPage(page - 1);
    }, 500);
    setTimeout(()=> {
      FadeInEffect(ref_card);
    }, 510);
  }
  // this is for some re-rendering situation 
  // ex in page 2 and suddenly refetch data
  // if not doing this, something would failed ...
  // even though the failed situation seems will not show on screen
  let card_title; let content; let fig_cap; let fig; let name;
  if (! props.content || ! props.content[page]){
    SetPage(0);
    card_title = "--";
    content = "--";
    fig_cap = "--";
    fig = "--";
    name = "--";
  }
  else {
    card_title = props.content[page].card_title;
    content = props.content[page].content;
    fig_cap = props.content[page].fig_cap;
    fig = props.content[page].fig;
    name = props.content[page].name;
  }
  return (
    <div className="sliding_card gd jsc fg1">
      <div className="sliding_card_content fx aii jst"
        ref={ref_card}
      >
        <FigCardComponent
          name={name}
          cls_name=""
          card_title={card_title}
          content={content}
          fig={fig}
          fig_cap={fig_cap}
        />
      </div>
      <CircleButtonComponent
        cls_name="prev_page"
        icon_cls_name="chevron-left"
        is_disable={page === 0}
        func={prePage}
      />
      <CircleButtonComponent
        cls_name="next_page"
        icon_cls_name="chevron-right"
        is_disable={page === props.content.length - 1}
        func={nextPage}
      />
    </div>
  );
}

function FigCardComponent(props){
  // props: cls_name, name, card_title, content, fig, fig_cap
  // cls_name, name: string of class/ id
  // card_title: string, primary title of card
  // content: string or jsx object 
  // fig: jsx component of primary visual
  // fig_cap: string to describe the fig

  const content = (
    <div className={`fig_card gd fg1 aii g5`}>
      <header className="card_title_container fx jsi">
        {props.card_title}
      </header>
      <main className="card_content_container fx dv aii jse g5 fg1">
        <div className="fig fx jsc aii">
          {props.fig}
        </div>
        <div className="fig_cap_container fx dv jsc g5">
          {props.fig_cap}
        </div>
      </main>
      <footer className="footer fx dv jsc g5">
        {props.content}
      </footer>
    </div>
  );
  return (
    <CardComponent
      name={props.name}
      cls_name={props.cls_name}
      has_shadow={true}
      content={content}
    />
  );
}

function HorizonCardComponent(props){
  // props: cls_name,title, content
  // cls_name: string of class
  // title, content: string or jsx object 
  const content = (
    <div className={`horizon_card gd acc jse fg1 g10`}>
      <div className="card_title_container fx jsc fg1">
        {props.title}
      </div>
      <div className="card_content_container fx dv aii jse g5 fg1">
        {props.content}
      </div>
    </div>
  );
  return (
    <CardComponent
      cls_name={props.cls_name}
      has_shadow={true}
      content={content}
    />
  );
}

function TextCardComponent(props){
  // props: cls_name, main, footer, func
  // cls_name: string of class
  // main, footer: string or object
  // func: action when clicking the main area
  return (
    <div className={`text_card fx dh aii fg1 ${props.cls_name || ""}`}
      onClick={props.func}
    >
      <div className="text_card_body fx dv aii fg1 p10">
        <main className="main fx jsi fg2 bf">
          {props.main}
        </main>
        <footer className="footer fx dv aii g5">
          {props.footer}
        </footer>
      </div>
    </div>
  );
}

export {CardComponent, SlideCardsComponent, HorizonCardComponent, TextCardComponent};
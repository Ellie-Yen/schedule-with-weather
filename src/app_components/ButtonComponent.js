import './ButtonComponent.css';

function ButtonComponent(props){
  // props: cls_name, func, content
  // cls_name: string of additional classname
  // func: function that to display when cliking it
  // content: jsx being wrapped
  return (
    <div className={`btn fx jsc fg1 circle_side ${props.cls_name || ""}`}
      onClick={props.func}
    >
      {props.content}
    </div>
  );
}
function CircleButtonComponent(props){
  // props: cls_name, func, icon_cls_name, is_disable
  // cls_name: string of additional classname
  // icon_cls_name: string, bootstrap classname
  // func: function that to display when cliking it
  // is_disable: bool indicates the status of the button
  const disabled = props.is_disable === undefined ? "false": props.is_disable;
  return (
    <i className={`bi bi-${props.icon_cls_name} disable-${disabled} circle_btn fx jsc circle shadow ${props.cls_name || ""}`}
      onClick={props.func}
    />
  );
}
function IconTitleButtonComponent(props){
  // props: icon_cls_name, content, cls_name, func
  // icon_cls_name: string of used icon classname in bootstrap
  // content: string as the button description
  // cls_name: string of additional classname
  // func: function that to display when cliking it
  return (
    <div className={`btn fx dh jsc fg1 circle_side g10 ${props.cls_name || ""}`}
      onClick={props.func}
    >
      <i className={`bi bi-${props.icon_cls_name} bf fx jsc`}/>
      {props.content}
    </div>
  );

}
function ToggleButtonComponent(props){
  // props: cls_name, func, content, is_checked
  // cls_name: string of additional classname
  // func: function that to display when cliking it
  // content: string as the button description
  // is_toggled: bool indicates the status of the button
  return (
    <div className={`fx dh fg1 g10 ${props.cls_name || ""}`}
      onClick={props.func}
    >
      <div className={`slider-${props.is_toggled} circle_side`}>
        <span className={`toggled-${props.is_toggled} circle_btn btn fx jsc circle shadow_small`}/>
      </div>
      {props.content} 
    </div>
  );
  
}

export {ButtonComponent, CircleButtonComponent, IconTitleButtonComponent, ToggleButtonComponent};
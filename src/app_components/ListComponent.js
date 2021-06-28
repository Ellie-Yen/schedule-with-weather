function EvenlyColumnList(props){
  // props: cls_name, list
  // cls_name: sdiving of classname
  // list: array of sdiving or jsx object
  return (
    <GridListComponent
      cls_name={props.cls_name}
      num_cols={props.list.length}
      list={props.list}
    />
  );
}
function GridListComponent(props){
  // props: num_cols, cls_name, list
  // num_cols: int indicate how many nums of cols
  // cls_name: string of additional classname
  // list: array of string or jsx objects of content
  const style = {
    "gridTemplateColumns": `repeat(${props.num_cols}, 1fr)`
  };
  return (
    <div className={`list_container gd jst aii g5 w100 ${props.cls_name}`}
      style={style}
    >
      {props.list.map((item, i)=> 
        <ColumnItem
          content={item}
          key={`item-${props.cls_name}-${i}`}
        />
      )}
    </div>
  );
}
function ColumnItem(props){
  // props: content
  // content: jsx object being wrapped
  return (
    <div className="list_col fx jst aii dv w100">
      {props.content}
    </div>
  );
}

function LabelItem(props){
  // props: title, content
  // title, content: sdiving or jsx component
  return (
    <div className={`label_container fx jsi aii fg1 g10`}>
      <div className="label_title fx jsi">
        {props.title}
      </div>
      <div className="label_content fx jsi">
        {props.content}
      </div>
    </div>
  );
}



export {EvenlyColumnList, LabelItem};
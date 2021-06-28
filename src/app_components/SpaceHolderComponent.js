import './SpaceHolderComponent.css';

function LoadingText(props){
  //props: lines: int of lines
  const lines = props.lines || 1;
  return (
    <div className="fiw fg1 ma">
      {Array.from(Array(lines).keys()).map(idx =>
        <p className="loading fiw circle_side" key={`loading_text_${idx}`}/>
      )}
    </div>
  );
}
function LoadingCircle(){
  return (
    <div className="circle rotating ma"/>
  );
}
function LoadingArea(){
  return (
    <div className="loading fx dv jsc fg1 fiw fih ma rd_small">
      loading ...
    </div>
  );
}
function SpaceHolderText(props){
  // props: lines: int of lines
  const lines = props.lines || 1;
  return (
    <div className="fiw fg1 ma">
      {Array.from(Array(lines).keys()).map(idx =>
        <p className="empty fiw circle_side" key={`empty_text_${idx}`}/>
      )}
    </div>
  );
}
function SpaceHolderArea(props){
  // props: msg
  // msg: optional, string or jsx object
  return (
    <div className="empty fx dv jsc fg1 fiw fih ma rd_small">
      {props.msg}
    </div>
  );
}

export {LoadingText, LoadingCircle, LoadingArea, SpaceHolderArea, SpaceHolderText};
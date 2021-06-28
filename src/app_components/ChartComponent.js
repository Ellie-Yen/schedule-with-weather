import {EvenlyColumnList} from './ListComponent';
import './ChartComponent.css';

function ChartComponent(props){
  // props: x_cords, data_list
  // x_cords: array of cords (string) on x-axis
  // data_list: array of object {title, vals}
  // title: string of data's name
  // vals: array of {y, label}
  // y: int represents percentage of y position
  // label: string

  // create x positions
  const x_unit = 100 / props.x_cords.length;
  const x_pos = [x_unit * 0.5];
  for (let i = 1; i < props.x_cords.length; i++){
    x_pos.push(x_pos[i - 1] + x_unit);
  }
  return (
  <div className="chart gd aii jst fg1 rd_small">
    <EvenlyColumnList
      cls_name="xaxis"
      list={props.x_cords.map((x_cord, i)=>
        <XCordContainer
          x_cord={x_cord}
          x_cord_idx={i}
          data_list={props.data_list}
          key={`x_cord-${i}`}
        />
      )}
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="chart_body fx fg1 fiw"
    >
      {props.data_list.map((data, i)=>
        <LineGroup
          x_pos={x_pos}
          y_pos={data.vals.map(cord => getY(cord.y))}
          key={`linegroup-${i}`}
        />
      )}
    </svg>
  </div>
  );
}

function XCordContainer(props){
  // props: x_cord, x_cord_idx, data_list
  // x_cord: string, cord at current x-axis position
  // x_cord_idx: int represents index of current x_cord
  // data_list: see above, inherit from parent
  return (
    <div className="xcord gd aii fiw fih ">
      {props.x_cord}
      {props.data_list.map((data, j)=>
        <div className="label "
          style={{top: getLabelY(data.vals[props.x_cord_idx].y)}}
          key={`label-${props.x_cord_idx}-${j}`}
        >
          {`${data.vals[props.x_cord_idx].label}`}
        </div>
      )}
    </div>
  );
}
function LineGroup(props){
  // props: x_pos, y_pos
  // array of int presents relative position in x/y axis
  // x_pos.length === y_pos.length
  const start_x = [props.x_pos[0], ...props.x_pos];
  const start_y = [props.y_pos[0], ...props.y_pos];
  return (
    <g className="line_group">
      {props.x_pos.map((x, i)=>
        <LineAndMarker
          x1={start_x[i]}
          y1={start_y[i]}
          x2={x}
          y2={props.y_pos[i]}
          key={`line-${i}`}
        />
      )}
      <animateTransform 
        attributeName="transform"
        attributeType="XML"
        type="scale"
        from="1 0"
        to="1 1"
        begin="1s"
        dur="3s"
        repeatCount="0"/>
    </g>
  );
}
function LineAndMarker(props){
  return (
    <>
      <line className="line_marker"
        x1={`${props.x1}%`} y1={`${props.y1}%`} 
        x2={`${props.x2}%`}  y2={`${props.y2}%`} 
      />
      <circle className="line_marker"
        r="3" cx={`${props.x2}%`} cy={`${props.y2}%`} 
      />
    </>
  );
}
function getY(y){
  // y: int
  // in order to leave some space for y axis
  return y * 0.9 + 5;
}
function getLabelY(y){
  // y: int
  // in order to not to overlap the lines
  return `${y * 0.8}%`;
}


export {ChartComponent};
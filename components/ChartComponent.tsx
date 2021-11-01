import styled from 'styled-components';
import { GridDiv, SmallRoundCss } from './appStyleWrappers';
import { 
  getXCoords, getListOfYCoords, getListOfYLabels
} from '../libs/chartHelpers';

interface ChartComponentProps {
  x_labels: Array<string>,
  data: {
    vals_lists: Array<Array<number>>,
    unit_list: Array<string>
  }
}
/**
 * @param props contains following keys:
 * - x_labels: array of labels on x-axis
 * - data: object which contains following keys:
 *    * vals_lists: Array<Array<number>>, each dataset(val_list) 
 *      has same (or larger) length as x_labels.
 *    * unit_list: Array<string>, unit for each dataset.
 */
export default function ChartComponent(props: ChartComponentProps){
  const x_coords = getXCoords(props.x_labels.length);
  const y_coords_list = getListOfYCoords(props.data.vals_lists);
  const y_labels_list = getListOfYLabels(props.data);
  
  return (
  <ChartContainer
    row='1fr'
    col='1fr'
    alignItems='stretch'
    justifyContent='stretch'
  >
    <ChartLabelComponent
      x_labels={props.x_labels}
      y_coords_list={y_coords_list}
      y_labels_list={y_labels_list}
    />
    <ChartBody
      x_coords={x_coords}
      y_coords_list={y_coords_list}
    />
  </ChartContainer>
  );
}

interface ChartLabelComponentProps {
  x_labels: Array<string>,
  y_labels_list: Array<Array<string>>,
  y_coords_list: Array<Array<number>>
}

function ChartLabelComponent(props: ChartLabelComponentProps){
  return (
    <ChartLabelContainer
      col={`repeat(${props.x_labels.length}, 1fr)`}
      alignItems='stretch'
      justifyContent='stretch'
    >
      {props.x_labels.map((x_label, i)=>
        <ChartLabelAtX
          x_label={x_label}
          y_labels={props.y_labels_list.map(y_labels => y_labels[i])}
          y_coords={props.y_coords_list.map(y_coords => y_coords[i])}
          key={`label_x-${i}`}
        />
      )}
    </ChartLabelContainer>
  );
}

interface ChartLabelAtXProps {
  x_label: string,
  y_labels: Array<string>,
  y_coords: Array<number>
}
function ChartLabelAtX(props: ChartLabelAtXProps){
  return (
    <ColAtX
      row="var(--fontsize_normal) 1fr"
      alignItems="start"
    >
      {props.x_label}
      {props.y_labels.map((label, i)=>
        <ChartLabel
          top={props.y_coords[i]}
          key={`label-${i}`}
        >
          {label}
        </ChartLabel>
      )}
    </ColAtX>
  );
}

interface ChartBodyProps {
  x_coords: Array<number>
  y_coords_list: Array<Array<number>>
}
function ChartBody(props: ChartBodyProps){
  return (
    <MySvg
      xmlns="http://www.w3.org/2000/svg"
    >
      {props.y_coords_list.map((y_coords, i)=>
        <LineGroup
          x_coords={props.x_coords}
          y_coords={y_coords}
          key={`linegroup-${i}`}
        />
      )}
    </MySvg>
  );
}

interface LineGroupProps {
  x_coords: Array<number>,
  y_coords: Array<number>
}
/**
 * @param props x_coords, y_coords;
 * coords for x/ y axises, x_coords.length === y_coords.length
 */
function LineGroup(props: LineGroupProps){
  if (props.x_coords.length > props.y_coords.length){
    return <g/>;
  }
  const Lines = [];
  let prevX = props.x_coords[0];
  let prevY = props.y_coords[0];
  for (let i = 0; i < props.x_coords.length; i ++){
    Lines.push(
      <LineAndMarker
        x1={prevX}
        y1={prevY}
        x2={props.x_coords[i]}
        y2={props.y_coords[i]}
        key={`line-${i}`}
      />
    );
    prevX = props.x_coords[i];
    prevY = props.y_coords[i];
  }
  return (
    <MyLineGroup>
      {Lines}
      <animateTransform 
        attributeName="transform"
        attributeType="XML"
        type="scale"
        from="1 0"
        to="1 1"
        begin="1s"
        dur="3s"
        repeatCount="0"/>
    </MyLineGroup>
  );
}

interface LineAndMarkerProps {
  x1: number,
  x2: number,
  y1: number,
  y2: number
}
function LineAndMarker(props: LineAndMarkerProps){
  return (
    <>
      <MyLine
        x1={`${props.x1}%`} y1={`${props.y1}%`} 
        x2={`${props.x2}%`}  y2={`${props.y2}%`} 
      />
      <MyCircle
        cx={`${props.x2}%`} cy={`${props.y2}%`} 
      />
    </>
  );
}

const ChartContainer = styled(GridDiv)`
  ${SmallRoundCss}
  backdrop-filter: blur( 1px ) brightness(0.75);
  height: 100%;
`;

const ColAtX = styled(GridDiv)`
  width: min-content;
  &:hover {
    background: var(--assistcolor);
    cursor: pointer;
  }
`;

const ChartLabelContainer = styled(GridDiv)`
  grid-area: 1/1/1/1;
  font-size: var(--fontsize_small);
  text-align: center;
`;

interface ChartLabelProps {
  top: number
}
const ChartLabel = styled.div((props: ChartLabelProps)=> `
  position: relative;
  top: ${props.top}%;
  grid-area: 2/1/2/1;
  filter: opacity(0);
  transform: translateY(var(--fontsize_small));
  height: fit-content;
  ${ColAtX}:hover & {
    filter: opacity(1);
  }
`);

const MySvg = styled.svg`
  grid-area: 1/1/1/1;
  width: 100%;
  margin-top: calc(var(--fontsize_normal) + var(--fontsize_normal));
  height: calc(100% - var(--fontsize_normal) - var(--fontsize_normal));
`;

const MyLineGroup = styled.g`
  transform-origin: center;
  filter: drop-shadow(1px 1px 2px var(--maincolor2)) brightness(1.1);
`;

const MyLine = styled.line`
  fill: var(--bgcolor);
  stroke: var(--bgcolor);
  stroke-linecap: round;
  stroke-width: 5;
`;

const MyCircle = styled.circle`
  fill: var(--bgcolor);
  stroke: var(--bgcolor);
  stroke-linecap: round;
  r: 5;
`;
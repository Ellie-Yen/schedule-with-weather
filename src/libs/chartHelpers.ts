/**
 * @returns Array<number> which can split x-axis evenly into split_number-th parts.
 */
export function getXCoords(split_number: number){
  const x_unit = 100 / split_number;
  const x_coords = [x_unit * 0.5];
  for (let i = 1; i < split_number; i++){
    x_coords.push(x_coords[i - 1] + x_unit);
  }
  return x_coords;
}

/**
 * @param val_lists: Array<Array<number>>: a mutiple set of data vals.
 * @returns Array<Array<number>> which turn vals of each set into y_coords.
 */
export function getListOfYCoords(val_lists: Array<Array<number>>){

  // calculate the range in y axis
  const y_coords = val_lists.flat();
  const minY = Math.min(...y_coords);
  const maxY = Math.max(...y_coords);

  // all val lists are empty
  if (minY > maxY){
    return [];
  }
  const getYPos: (val: number)=> number = getYposFunctionBuilder(minY, maxY);
  return val_lists.map(vals => 
    vals.map(val => getYPos(val))
  );
}

interface GetListOfYLabelsArgs {
  vals_lists: Array<Array<number>>,
  unit_list: Array<string>
}
/**
 * @param kwargs: contains following keys:
 * - vals_lists: Array<Array<number>>: a mutiple set of data vals.
 * - unit_list: Array<string>: a list of units for vals above.
 * @returns Array<Array<string>> which turn vals of each set into y_labels.
 */
export function getListOfYLabels(kwargs: GetListOfYLabelsArgs){
  return kwargs.vals_lists.map((vals, i) => 
    vals.map(val => `${val} ${kwargs.unit_list[i]}`)
  );
}

/**
 * @returns (val: number)=> number, a function helps decide y pos by range of y data.
 */
function getYposFunctionBuilder(minY: number, maxY: number) {
  // a horinzonal line
  if (maxY === minY){
    return ((val: number)=> 50);
  }
  return ((val: number)=> 10 + 80 * (1 - (val - minY) / (maxY - minY)));
}
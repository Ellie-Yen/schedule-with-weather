import {CardComponent} from '../app_components/CardComponent';
import {ChartComponent} from '../app_components/ChartComponent';
import {GetSomethingFailedIcon} from '../app_components/IconComponent';
import {LoadingArea, SpaceHolderArea} from '../app_components/SpaceHolderComponent';
import getModelByState from '../data_process_functions/getModelByState';

function WeatherSectionWeek(props){
  // props: data, loading, is_success
  // data: parsed object
  // loading: bool, see fetching state
  // is_success: bool indicates whether parsing data is success
  const data_model = getModelByState(
    props.loading,
    props.is_success,
    props.data ? props.data.temp: null, 
    {
      default: DefaultForecastWeek,
      success: ForecastWeek,
      failed: FaildForecastWeek,
      loading: LoadingForecastWeek
  });

  return (
    <section id="weather_week" className="section">
      <CardComponent
        cls_name="forecast_week"
        content={
          <>
            <header>
              本周溫度趨勢
            </header>
            {data_model}
          </>
        }
        has_shadow={true}
      /> 
    </section>
  );
}

function ForecastWeek(data){
  // data: object, see parse api
  // display_day, t_min, t_max, t_range
  const [minT, maxT] = data.t_range;
  const getTPos = (t) => {
    return {
      y: 100 - Math.floor(100 * (t - minT) / (maxT - minT)),
      label: `${t}°C`
    }
  }
  return (
    <ChartComponent
      x_cords={data.display_day}
      data_list={[
        {title: "最高溫", vals: data.t_max.map(t => getTPos(t))},
        {title: "最低溫", vals: data.t_min.map(t => getTPos(t))}
      ]}
    />
  );
}
function FaildForecastWeek(error_msg){
  // msg: string of current situation
  const msg = (
    <>
      {GetSomethingFailedIcon()}
      {error_msg}
    </>
  );
  return (
    <SpaceHolderArea msg={msg}/>
  );
}
function DefaultForecastWeek(){
  return (
    <SpaceHolderArea msg="請先設定所在城市"/>
  );
}
function LoadingForecastWeek(){
  return (
    <LoadingArea/>
  );
}

export default WeatherSectionWeek;
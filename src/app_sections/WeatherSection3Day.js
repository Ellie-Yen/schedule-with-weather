import {SlideCardsComponent} from '../app_components/CardComponent';
import {GetWeatherIcon, GetSomethingFailedIcon, GetLetsStartIcon} from '../app_components/IconComponent';
import {LabelItem} from '../app_components/ListComponent';
import {LoadingText, LoadingCircle, SpaceHolderText} from '../app_components/SpaceHolderComponent';
import getModelByState from '../data_process_functions/getModelByState';

function WeatherSection3Day(props){
  // props: data, loading, is_success
  // data: parsed object
  // loading: bool, see fetching state
  // is_success: bool indicates whether parsing data is success

  const data_model = getModelByState(
    props.loading,
    props.is_success,
    props.data, 
    {
      default: DefaultForecast3Day,
      success: Forecast3Day,
      failed: FaildForecast3Day,
      loading: LoadingForecast3Day}
  );
  return (
    <section id="weather_3day" className="section">
      <SlideCardsComponent
        content={data_model.map(d => ({
          name: "weather_3day_figcard",
          card_title: d.card_title,
          content: d.content,
          fig: d.fig,
          fig_cap: d.fig_cap,
        }))}
      />
    </section>
  );
}

function Forecast3Day(data){
  // data: array of {time, weather, feel, temp ... }
  // see parse api
  function GetContent(d){
    return (
      <>
        <LabelItem
          title={<i className="wi wi-humidity"/>}
          content={`濕度: ${d.humidity} %`}
        />
        <LabelItem
          title={<i className="bi bi-umbrella-fill"/>}
          content={`降雨: ${d.rain_pro} %`}
        />
      </>
    );
  }
  function GetFigCap(d){
    return (
      <>
        {d.weather}
        <LabelItem
          title={<span className="bf">{d.temp}</span>}
          content={`°C ${d.feel}`}
        />
      </>
    );
  }
  return (
    data.map(d => ({
      card_title: d.time,
      content: GetContent(d),
      fig: GetWeatherIcon(d.weather, d.is_night),
      fig_cap: GetFigCap(d),
    }))
  );
}
function FaildForecast3Day(error_msg){
  // error_msg: string of current situation
  return ([{
    card_title: "--",
    content: <SpaceHolderText lines={2}/>,
    fig: GetSomethingFailedIcon(),
    fig_cap: error_msg
  }]);
}
function DefaultForecast3Day(){
  return ([{
    card_title: "--",
    content: <SpaceHolderText lines={2}/>,
    fig: GetLetsStartIcon(),
    fig_cap: "請先選擇所在城市"
  }]);
}
function LoadingForecast3Day(){
  return ([{
    card_title: <LoadingText/>,
    content: <LoadingText lines={2}/>,
    fig: <LoadingCircle/>,
    fig_cap: "Loading ..."
  }]);
}

export default WeatherSection3Day;
import getModelByState from '../data_process_functions/getModelByState';
import { week_time_list } from '../data_process_functions/handleDatefunctions';
import {GetWeatherIcon, GetLetsStartIcon, GetSomethingFailedIcon} from '../app_components/IconComponent';
import {CardComponent, TextCardComponent, HorizonCardComponent} from '../app_components/CardComponent'
import {LabelItem} from '../app_components/ListComponent';
import {LoadingCircle, SpaceHolderArea} from '../app_components/SpaceHolderComponent';

function ScheduleSection(props){
  // props: schedule, weather
  // schedule, weather: object containing
  // {loading, is_success, data}
  // loading: bool indicate whether fetching is success
  // is_success: bool indicate whether data parsing is success
  // data: object if aboves are both success 
  const weather_list = getModelByState(
    props.weather.loading,
    props.weather.is_success,
    props.weather.data["week"] ?props.weather.data["week"] : null,
    {
      success: WeatherList,
      default: DefaultWeatherList,
      loading: LoadingWeatherList,
      failed: FailedWeatherList
    }
  );
  const schedule_list = getModelByState(
    props.schedule.loading,
    props.schedule.is_success,
    props.schedule.data,
    {
      success: ScheduleList,
      default: DefaultScheduleList,
      loading: LoadingScheduleList,
      failed: FailedScheduleList
    }
  ); 

  return (
    <section id="schedule_section"
      className="section"
    >
      <CardComponent
        name="schedule_list"
        gap_size={50}
        content={week_time_list.map((wt, i)=>
          <DayItemComponent
            time={wt.display_time}
            weather={weather_list[i]}
            schedule={
              schedule_list.event_by_day[i] || 
              <NoEventItemComponent date={wt.date_obj}/>
            }
            key={`weekday_${i}`}
          />
        )}
      />
    </section>
  );
}

function WeatherList(weather_week){
  // weather_week: object, see parseAPI 

  // data: object {weekidx : {day : detail, night: detail}}
  // detail: {weather, weather_point, rain_pro}
  const data = weather_week.weather_by_idx;
  const weather_by_day = [];
  for (let i = 0; i < 7; i++){
    const res = {
      day: {weather: "-", rain_pro: "-"},
      night: {weather: "-", rain_pro: "-"},
    }
    if (data[i]){
      const w = data[i];
      ["day", "night"].forEach(day_span => {
        if (w[day_span]){
          res[day_span].weather = w[day_span].weather;
          res[day_span].rain_pro = w[day_span].rain_pro;
        }
      });
    }
    weather_by_day.push(res);
  }
  return (
    weather_by_day.map((w, i) =>
      <DayWeatherComoponent
          weather_obj={w}
          key={`weather_by_day-${i}`}
      />
    )
  );
}
function FailedWeatherList(error_msg){
  // error msg: string indicate error
  const weather_by_day = [];
  const failed_component = 
    <SpaceHolderArea 
      msg={`氣象資料載入失敗: ${error_msg}`}
    />
  ;
  for (let i = 0; i < 7; i++){
    weather_by_day.push(
      failed_component
    );
  }
  return weather_by_day;
} 
function DefaultWeatherList(){
  const weather_by_day = [];
  const spaceholder = <SpaceHolderArea msg={`請先設定天氣地點`} />;
  for (let i = 0; i < 7; i++){
    weather_by_day.push(
      spaceholder
    );
  }
  return weather_by_day;
}
function LoadingWeatherList(){
  const weather_by_day = [];
  const spaceholder = <LoadingCircle/>;
  for (let i = 0; i < 7; i++){
    weather_by_day.push(
      spaceholder
    );
  }
  return weather_by_day;
}

function ScheduleList(data){
  // data, object of schedule
  const event_by_day = {};
  
  data.list.forEach(event_item => {
    event_item.time_spans.forEach(t => {
      let end = t.end_idx;
      if (t.display_time.substring(t.display_time.length - 5) !== "00:00"){
        end ++;
      }
      for (let start = t.start_idx; start < end; start ++){
        if (! event_by_day[start]){
          event_by_day[start] = {};
        }
        // to let same day events are sorted by display_time
        event_by_day[start][t.display_time] = {
          event_item: event_item,
          display_time: t.display_time
        };
      }
    });
  });
  for (let daykey in event_by_day){
    event_by_day[daykey] = (
      <div className="fx dv aii fg1 g50">
        {Object.keys(event_by_day[daykey]).sort().map((display_time, i)=>
          <EventItemComponent
            event_item={event_by_day[daykey][display_time].event_item}
            display_time={display_time}
            key={`event-${i}`}
          />
        )}
      </div>
    );
  }
  return {
    schedule_name: data.name,
    event_by_day
  };
}
function FailedScheduleList(error_msg){
  // error_msg, string indicate error
  const event_by_day = {};
  const item = (
    <TextCardComponent
      cls_name="event_item"
      func={null}
      footer={null}
      main={
        <LabelItem 
          title={GetSomethingFailedIcon()}
          content={error_msg}
        />
      }
    />
  );
  for (let i = 0; i < 7; i++){
    event_by_day[i] = item;
  }
  return {
    schedule_name: error_msg,
    event_by_day
  };
}
function DefaultScheduleList(){
  const event_by_day = {};
  const item = (
    <TextCardComponent
      cls_name="event_item"
      func={null}
      footer={null}
      main={
        <LabelItem 
          title={GetLetsStartIcon()}
          content="no data so far"
        />
      }
    />
  );
  for (let i = 0; i < 7; i++){
    event_by_day[i] = item;
  }
  return {
    schedule_name: "no data so far",
    event_by_day
  };
}
function LoadingScheduleList(){
  const event_by_day = {};
  const item = (
    <TextCardComponent
      cls_name="event_item"
      func={null}
      footer={null}
      main={<LoadingCircle/>}
    />
  );
  for (let i = 0; i < 7; i++){
    event_by_day[i] = item;
  }
  return {
    schedule_name: "no data so far",
    event_by_day
  };
}

function DayItemComponent(props){
  // props: time, weather, schedule
  // time: string
  // weather, schedule: jsx object
  const title = (
    <div className="fx dv">
      <h1 className="bf tc">
        {props.time}
      </h1>
      {props.weather}
    </div>
  );
  return (
    <HorizonCardComponent
      cls_name="schedule_day_item"
      title={title}
      content={props.schedule}
    />
  );
}
function DayWeatherComoponent(props){
  // props: weather_obj: object of weather
  // key: {day, night}
  // day, night: object {weather, rain_prop}
  return (
  <div className="gd fg1 g10">
    {["day", "night"].map((day_span, i)=>
      <div className="fx dv jsc fg1 secondary"
        key={`dayspan${i}`}
      >
        {GetWeatherIcon(props.weather_obj[day_span].weather, i === 1)}
        {`${props.weather_obj[day_span].rain_pro} %`}
      </div>
    )}
  </div>
  );
}
function EventItemComponent(props){
  // props: event_item, display_time
  // event_item: event object 
  // display_time: string represent event time span
  const event_name = props.event_item.event_name;
  const event_time = props.display_time;
  const event_location = props.event_item.location;
  const func = ()=> {window.open(props.event_item.link, "_blank");};

  return(
    <TextCardComponent
      cls_name="event_item"
      func={func}
      main={event_name}
      footer={
        <>
        <LabelItem
          title={<i className="bi bi-clock"/>}
          content={event_time}
        />
        <LabelItem
          title={<i className="bi bi-geo-alt"/>}
          content={event_location || "尚未設定"}
        />
        </>
      }
    />
  ); 
}
function NoEventItemComponent(props){
  // date: date object, in order to get the link to calendar
  const url = getCalendarLinkByDate(props.date);
  return (
    <TextCardComponent
      cls_name="event_item"
      func={()=> {window.open(url, "_blank");}}
      main={
        <LabelItem 
          title={GetLetsStartIcon()}
          content="尚無行程，點此設定 :D"
        />
      }
      footer={null}
    />
  );
}
function getCalendarLinkByDate(t){
  // t: date object
  const [year, month, date] = [t.getFullYear(), t.getMonth() + 1, t.getDate()];
  return `https://calendar.google.com/calendar/u/0/r/day/${year}/${month}/${date}`;
}
export default ScheduleSection;
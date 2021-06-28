import {default as WeatherIcon} from '../datastore/WeatherIcon.json';

function GetWeatherIcon(weather, is_night){
  // weather: string of relevant weather description
  // is_night: bool, for some cases there are day and night version
  if (WeatherIcon.data[weather] === undefined){
    console.log(weather);
    return <div>{weather}</div>;
  }
  const weather_code = WeatherIcon.data[weather].code;
  let icon_cls_name = WeatherIcon.ref_icons[weather_code];
  if (weather_code && weather_code < 4){
    icon_cls_name = icon_cls_name[is_night ? 1 : 0];
  }
  return <i className={`${icon_cls_name} bicon`}/>;
}

function GetSomethingFailedIcon(){
  return <i className="bi bi-emoji-dizzy bicon"/>;
}

function GetLetsStartIcon(){
  // yeah, i like to uses this icon to represent it's a fresh start
  return <i className="bi bi-stars bicon"/>;
}

export {GetWeatherIcon, GetSomethingFailedIcon, GetLetsStartIcon};
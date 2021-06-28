import {
  day_msecs, week_time_list, 
  getWeekListIdxByDate, getFormatDateString
} from '../data_process_functions/handleDatefunctions';

// unfortunately, eath data has different format and length...
function parseWeather(rawdata_3day, rawdata_week){
  // rawdata: unparsed JSON
  // return: object of weather element
  let res = {};
  try{
    res["3day"] = parseWeather3Day(rawdata_3day);
    res["week"] = parseWeatherWeek(rawdata_week);
    res["is_success"] = true;
  }
  catch(error){
    console.log(error);
    res["is_success"] = false;
  }
  return res;
}
function parseWeather3Day(data){
  // data: parsed JSON
  // return object
  if (data.success !== "true"){
    return new TypeError("fetch is not success");
  }
  const town_data = data.records.locations[0].location[0].weatherElement;

  if (town_data[0].time.length === 0){
    return new RangeError("no data");
  }

  // town_data = [ WeatherDescription ]
  const res = town_data[0].time.map(wt => {
    const time = parseWeatherTime(wt.startTime);
    const display_time = `${time.display_date} ${time.hr} ~ ${time.hr + 3}時`;
    
    let [weather, rain_pro, temp, feel, wind, humidity] = [];
    const multi_weather_data = wt.elementValue[0].value.split("。");
    
    // API will not have rain probability data if it's 0%.
    if (multi_weather_data.length === 7){
      [weather, rain_pro, temp, feel, wind, humidity] = multi_weather_data; 
    }
    else {
      [weather, temp, feel, wind, humidity] = multi_weather_data;
      rain_pro = " 0";
    }

    return {
      time: display_time,
      is_night: time.is_night,
      weather,
      rain_pro: rain_pro.split(" ")[1].replace("%", ""),
      temp: temp.substring(4).replace("度", ""),
      humidity: humidity.substring(4).replace("%", ""),
      feel,
      wind
    };
  });
  return res;
}
function parseWeatherWeek(data){
  // data: parsed JSON
  // return object, each keys
  // weather_by_idx: object of weather by week idx, includes keys:
  // day, night of {weather, weather_point, rain_pro}
  // temp: temperature data 
  // t_min, t_max: array of int
  // data: parsed JSON
  // return object

  if (data.success !== "true"){
    return new TypeError("fetch is not success");
  }
  const [rain_pro, weather, t_min, t_max] = data.records.locations[0].location[0].weatherElement;

  if (rain_pro.time.length === 0){
    return new RangeError("no data");
  }
  const res = {
    "weather_by_idx": {},
    "temp": {
      "display_day": [],
      "t_min": [],
      "t_max": [],
      "t_range": [100, -100]
    }
  };
  rain_pro.time.forEach((wt, i)=> {
    const rain_pro = parseInt(wt.elementValue[0].value) || 0;
    const w_pheno = weather.time[i].elementValue[0].value;
    const w_point = weather.time[i].elementValue[1].value;
    const min_t = t_min.time[i].elementValue[0].value;
    const max_t = t_max.time[i].elementValue[0].value;

    const time = parseWeatherTime(wt.startTime);
    const idx = getWeekListIdxByDate(time.time_stamp);
    if (idx !== -1){
      const day_span = time.is_night ? "night": "day";
      // same day
      if (res.weather_by_idx[idx]){
        // different day span, add new values
        if (! res.weather_by_idx[idx][day_span]){
          res.weather_by_idx[idx][day_span] = {
            weather: w_pheno,
            weather_point: w_point,
            rain_pro: rain_pro
          };
        }
        // find max value in same day span
        if (res.weather_by_idx[idx][day_span].weather_point < w_point){
          res.weather_by_idx[idx][day_span].weather_point = w_point;
          res.weather_by_idx[idx][day_span].weather = w_pheno;
        }
        res.weather_by_idx[idx][day_span].rain_pro = 
        Math.max(res.weather_by_idx[idx][day_span].rain_pro, rain_pro);

        // find max value in same day
        const last = res.temp.t_min.length - 1;
        res.temp.t_min[last] = Math.min(res.temp.t_min[last], min_t);
        res.temp.t_max[last] = Math.max(res.temp.t_max[last], max_t);
      }
      // new day
      else {
        res.weather_by_idx[idx] = {};
        res.weather_by_idx[idx][day_span] = {
          weather: w_pheno,
          weather_point: w_point,
          rain_pro: rain_pro
        };
        // only use day
        res.temp.display_day.push(time.display_date.split(" ")[1]);
        res.temp.t_min.push(min_t);
        res.temp.t_max.push(max_t);
      }
      res.temp.t_range[0] = Math.min(res.temp.t_range[0], min_t);
      res.temp.t_range[1] = Math.max(res.temp.t_range[1], max_t);
    }
  });

  return res;
}
function parseWeatherTime(date_str){
  const parsed = new Date(date_str);
  const hr = parsed.getHours();

  return {
    time_stamp: parsed,
    hr: hr,
    display_date: getFormatDateString(parsed, true, true, false),
    is_night: hr >= 18 || hr < 6
  };
}


function parseCalendar(data){
  // data: parsed JSON
  // return: object
  // console.log(data);
  try{ 
    const res = {
      is_success: true,
      name: data.result.summary,
      list: data.result.items.map(item => ({
        event_name: item.summary,
        location: item.location,
        link: item.htmlLink,
        time_spans: parseCalendarTimeSpan(item.start, item.end, item.recurrence)
      }))
    };
    return res;
  }
  catch (error){
    console.log(error);
    return {
      is_success: false
    };
  }
}
function parseCalendarTimeSpan(start, end, recurrence){
  // start, end: string that presents time
  // recurrence: array contains string represents recurrence rule
  // see api reference for detail
  const [parsed_start, parsed_end] = [start, end].map(t => parseCalendarTime(t));
  const delta_time = parsed_end - parsed_start;
  const time_spans = [];
  week_time_list.forEach((wt, i) => {
    const match_date = TryMatchRecurrenceRule(wt, parsed_start, recurrence);
    if (match_date !== false){
      const end_date = new Date(match_date + delta_time);
      const end_idx = getWeekListIdxByDate(end_date);
      time_spans.push({
        start_idx: i,
        end_idx: end_idx === -1 ? 7: end_idx,
        display_time: 
          getFormatDateString(new Date(match_date), true, true, true) + " ~ " +
          getFormatDateString(end_date, true, true, true)
      });
    }
  });
  return time_spans;
}
function TryMatchRecurrenceRule(T, target, recurrence){
  // T: item of week_time_list
  // object contains date object, date, month, day
  // target: reference date object
  // recurrence: arr of str or null
  // try if T matches the recurrence rule by compared to target
  // if so, return timestamp that has same hours and min to target
  // otherwise false
  const [month, date, day] = [target.getMonth(), target.getDate(), target.getDay()];
  if (recurrence === undefined){
    if (month === T.month && date === T.date & target - T.date_obj < day_msecs){
      return getSameTimeStamp(T.date_obj, target);
    }
    return false;
  }
  let valid = false;
  for (let rule of recurrence){
    if (rule.includes("BYDAY") && T.day === day){
      valid = true; break;
    }
    else if (rule.includes("BYMONTH") && T.date === date){
      valid = true; break;
    }
    else if (rule.includes("BYYEARDAY") && T.date === date && T.month === month){
      valid = true; break;
    }
    else if (rule.includes("DAILY")){
      valid = true; break;
    }
  }
  return valid ? getSameTimeStamp(T.date_obj, target): false;
}
function parseCalendarTime(api_time_obj){
  // api_timeobj: object that presents time and date
  // contains date string
  // time has different format for whole day event and not whole day event
  const parsed = api_time_obj.date ?
   new Date(api_time_obj.date + "T00:00:00") :
   new Date(api_time_obj.dateTime);
  return parsed;
}
function getSameTimeStamp(d_source, d_target){
  // d_source, d_target: date object
  d_source.setHours(d_target.getHours());
  d_source.setMinutes(d_target.getMinutes());
  return d_source.valueOf();
}

export {parseWeather, parseCalendar};
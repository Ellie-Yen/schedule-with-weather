import React from 'react';
import {fetchWeather_3day, fetchWeather_week, fetchCalendar} from '../API_process_functions/fetchingAPI';
import {parseWeather, parseCalendar} from '../API_process_functions/parseAPI';
import {WeatherFetchErrorMsg, CalendarFetchErrorMsg} from '../API_process_functions/handleFetchError';

/* ----------------------------------------------------------- 
* async get data, and return current fetching is loading or not
* if it's loading, we can use the data
-------------------------------------------------------------*/

function FetchingWeatherState(city, town, startTime){
  // city, town: string of location name
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    async function fetchingWeatherData() {
      try {
        setLoading(true);
        setData({is_success: undefined});
        //fetchWeather_3day, fetchWeather_week
        const fetchResult_3day = await fetchWeather_3day(city, town);
        const fetchResult_week = await fetchWeather_week(city, town);
        const parsedData = parseWeather(fetchResult_3day, fetchResult_week);
        setData(parsedData);
      } 
      catch (error) {
        setLoading(undefined);
        setData(WeatherFetchErrorMsg(error));
      }
    }
    if (city !== "" && town !== "") {
      fetchingWeatherData();
    }
  }, [city, town, startTime]);

  return [data, loading];
}

function FetchCalendarState(api_key, calendar_id, startTime, use_example_data){
  // api_key, calendar_id: essential string to fetch the api,
  // see google api for more info
  // startTime: int of time
  // use_example_data: bool indicates whether to use the example data
  // or user's own api key to fetch user's own calendar
  
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    async function fetchingCalendarData() {
      try{
        setLoading(true);
        setData({is_success: undefined});
        const EndTime = 604800000 + startTime;
        const res = await fetchCalendar(
          api_key, 
          calendar_id,
          new Date(startTime).toISOString(),
          new Date(EndTime).toISOString(),
          use_example_data
        );
        setData(parseCalendar(res));
      }
      catch(error){
        console.log(error);
        setLoading(undefined);
        setData(CalendarFetchErrorMsg(error));
      }
    }
    if (startTime){
      fetchingCalendarData();
    }
  }, [api_key, calendar_id, startTime, use_example_data]);

  return [data, loading];
}

export {FetchingWeatherState, FetchCalendarState};
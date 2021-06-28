import {default as WeatherAPI} from '../datastore/WeatherAPI.json';
import {default as CalendarAPI} from '../datastore/GoogleCalendarAPI.json';
import {default as CalendarExample} from '../datastore/ExampleData_CalendarAPI.json';

// fetching Weather data
// all encoding is based on WeatherAPI(v1)
async function fetchWeather_3day(city, town){
  // city, town: string of name
  const city_code = String(WeatherAPI.city_data[city].code_3day
                    ).padStart(3, "0");
  const url = `${WeatherAPI.base_url}${WeatherAPI.city_baseCode}${city_code}?Authorization=${WeatherAPI.authorization}&locationName=${town}&elementName=${WeatherAPI.select_3day}&sort=time`;
  console.log(url);

  const myRequest = new Request(url);
  const res = await fetch(myRequest);
  if (res.ok){
    return res.json();
  }
  return Promise.reject(new Error('failed to fetch'));
}

async function fetchWeather_week(city, town){
  // city, town: string of name
  // code_7day = code_3day + 2
  const city_code = String(WeatherAPI.city_data[city].code_3day
                    + 2 ).padStart(3, "0");
  const url = `${WeatherAPI.base_url}${WeatherAPI.city_baseCode}${city_code}?Authorization=${WeatherAPI.authorization}&locationName=${town}&elementName=${WeatherAPI.select_week}&sort=time`;
  console.log(url);

  const myRequest = new Request(url);
  const res = await fetch(myRequest);
  if (res.ok){
    return res.json();
  }
  return Promise.reject(new Error('failed to fetch'));
}

// fetch Calendar API
async function fetchCalendar(api_key, calendar_id, time_min, time_max, use_example_data=true){
  // api_key, calendar_id: essential string for authorization,
  // see google api for more info 
  // time_min, time_max: string of date object
  // for this app, we fetch the data of the current week
  
  // fetching api is ..... expensive, this is only for test and display
  if (use_example_data){
    return CalendarExample;
  }

  return new Promise((resolve, reject)=>{    
    const url = `${CalendarAPI.base_url}${calendar_id}/events?timeMax=${time_max}&timeMin=${time_min}`;
    console.log(url);
    let gapi;
    try{
      gapi = window.gapi;
    }
    catch(error){
      reject({
        status: error,
        statusText: "failed to fetch"
      });
    }
    async function start() {
      await gapi.client.init({
        'apiKey': api_key
      });
      const res = gapi.client.request({
        'path': url,
      });
      try {
        resolve(res);
      }
      catch(error){
        reject({
          status: error,
          statusText: "error"
        });
      }
    }
    gapi.load('client', start);
  });
}

export {
  fetchWeather_3day, fetchWeather_week, fetchCalendar
};
import { failed, exception, successFetchWeatherAPI } from './responseConstructors';

import {default as API} from '../datastore/weather_api_info.json';
import {default as WEATHER_CITY_MAP} from '../datastore/weather_city_map.json';
// fetching Weather data
// all encoding is based on weather api(v1)

/**
 * fetch 3 day forecast of this location.
 * @param location: WeatherParam contains:
 * - city str of city name
 * - town str of town name
 * @returns a json conatins SuccessWeatherAPI_3day if success,
 * else a FailedRes
 */
 export async function asyncFetchWeather_3day(location: WeatherParam): Promise<FailedRes | SuccessWeatherAPIRes>{
  const url = getFetchURL(location, 3);
  if (! url){
    return failed('invalid location');
  }
  return await requestAndFetch(url);
}

/**
 * fetch week forecast of this location.
 * @param city str of city name
 * @param town str of town name
 * @returns a json conatins SuccessWeatherAPI_week if success,
 * else a FailedRes
 */
export async function asyncFetchWeather_week(location: WeatherParam): Promise<FailedRes | SuccessWeatherAPIRes>{
  const url = getFetchURL(location, 7);
  if (! url){
    return failed('invalid location');
  }
  return await requestAndFetch(url);
}

/**
 * 
 * @param url: string, the url of api to request
 * @returns a json conatins SuccessWeatherAPI_3day / SuccessWeatherAPI_week if success,
 * else a FailedRes
 */
async function requestAndFetch(url: string): Promise<SuccessWeatherAPIRes | FailedRes>{
  try {
    const myRequest = new Request(url);
    const res = await fetch(myRequest);
    if ( ! res.ok){
      return exception(res);
    }
    const data = await res.json();

    // sometimes http status is fine but get error
    const error_msg = (data as FailedWeatherAPI).message;
    if (error_msg){
      return failed(`failed to fetch, ${error_msg}`);
    }
    if (! data.success){
      return failed(`failed to fetch, unknown api status`);
    }
    return successFetchWeatherAPI(data);
  }
  catch (error){
    return exception(error);
  }
}

/**
 @returns a code used for url in fetching weather api
 * or undefined if the city is not on the list.
 @param city string of name.
 @param time_span int, represents the time_span of forecast,
 * acceptable values are 3 and 7.
*/
function getCityCode(city: string, time_span: number = 3): string | undefined {
  type citykey = keyof typeof WEATHER_CITY_MAP.city_data;
  const city_root = WEATHER_CITY_MAP.city_data[city as citykey];
  if (! city_root){
    return ;
  }
  let cityCode_for_calc = city_root.code_3day;
  if (time_span === 7){
    cityCode_for_calc += 2;
  }
  return WEATHER_CITY_MAP.city_baseCode + String(cityCode_for_calc).padStart(3, "0");
}

/**
 @returns an url in fetching weather api
 * or undefined if the city is not on the list.
 @param location: WeatherParam contains:
 * - city str of city name
 * - town str of town name
 @param time_span int, represents the time_span of forecast,
 * acceptable values are 3 and 7.
*/
function getFetchURL(location: WeatherParam, time_span: number = 3): string | undefined {
  const AUTH_PART = `Authorization=${API.authorization_key}`;

  const cityCode = getCityCode(location.city, time_span);
  if (! cityCode){
    return;
  }

  type field_key = keyof typeof WEATHER_CITY_MAP.fetch_fields;
  const code = String(time_span);
  const fields = WEATHER_CITY_MAP.fetch_fields[code as field_key];
  const query_option = `locationName=${location.town}&elementName=${fields}&sort=time`;
  return `${API.base_url}${cityCode}?${query_option}&${AUTH_PART}`;
}

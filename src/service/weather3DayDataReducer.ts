import { exception } from "../libs/responseConstructors";
import { parseWeather3Day } from "../libs/weatherDataConverters";
import { 
  loadingStatus, initStatus, failedStatus
} from '../libs/statusConstructors';

import {default as MSG_MAP} from '../datastore/app_msg_map.json';

export const weather3DayDataReducer: Weather3DayReducer = {
  init: initData,
  loading: loadingData,
  fetched: getDataFromFetchResult
}

function getDataFromFetchResult(fetch_result: SuccessWeatherAPIRes | FailedRes, cur_week: Array<Date>): SuccessWeather3DayState | FailedWeather3DayState {
  try{
    if (fetch_result.is_success){
      return successData(fetch_result, cur_week);
    }
    return failedData(fetch_result, cur_week);
  }
  catch (error){
    return failedData(exception(error), cur_week);
  }
}

function successData(fetch_result: SuccessWeatherAPIRes, cur_week: Array<Date>): SuccessWeather3DayState | FailedWeather3DayState {
  try{
    return parseWeather3Day(fetch_result);
  }
  catch (error){
    return failedData(exception(error), cur_week);
  }
}

function failedData(failed_result: FailedRes, cur_week: Array<Date>): FailedWeather3DayState {
  return failedStatus(fakeData(failed_result.reason));
}

function initData(): InitWeather3DayState {
  return initStatus(fakeData(MSG_MAP.init_weather));
}

function loadingData(): LoadingWeather3DayState {
  return loadingStatus(fakeData(MSG_MAP.loading));
}

function fakeData(msg: string): Array<Weather3DayItemInfo>{
  return [{
    duration: '',
    is_night: true,
    weather: msg,
    code: '-',
    temperature: '-',
    feel: '-',
    RH: '-',
    POP: '-'
  }];
}

import { exception } from "../libs/responseConstructors";
import { parseWeatherWeek } from "../libs/weatherDataConverters";
import { 
  loadingStatus, initStatus, failedStatus
} from '../libs/statusConstructors';

import {default as MSG_MAP} from '../datastore/app_msg_map.json';

export const weatherWeekDataReducer: WeatherWeekReducer = {
  init: initData,
  loading: loadingData,
  fetched: getDataFromFetchResult
}

function getDataFromFetchResult(fetch_result: SuccessWeatherAPIRes | FailedRes, cur_week: Array<Date>): SuccessWeatherWeekState | FailedWeatherWeekState {
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

function successData(fetch_result: SuccessWeatherAPIRes, cur_week: Array<Date>): SuccessWeatherWeekState {
  return parseWeatherWeek(fetch_result, cur_week);
}

function failedData(failed_result: FailedRes, cur_week: Array<Date>): FailedWeatherWeekState {
  return failedStatus(fakeData(failed_result.reason));
}

function initData(): InitWeatherWeekState {
  return initStatus(fakeData(MSG_MAP.init_weather));
}

function loadingData(): LoadingWeatherWeekState {
  return loadingStatus(fakeData(MSG_MAP.loading));
}

function fakeData(msg: string): WeatherWeekData{
  const weather_list: Array<WeatherWeekItemInfo> = Array(7);
  weather_list.fill({
    day: {
      code: '-',
      POP: msg
    },
    night: {
      code: '-',
      POP: msg
    }
  });
  return {
    weather_list,
    temperature: {
      maxT: [],
      minT: []
    }
  };
}

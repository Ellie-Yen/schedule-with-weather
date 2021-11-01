import { default as MSG_MAP } from '../datastore/app_msg_map.json';

/**
 * handle no result success
 */
export function success(): SuccessRes {
  return {
    is_success: true
  };
}

/**
 * handle exception errors in [try - catch]
 * @param error any unknown type
 */
export function exception(error: unknown): FailedRes{
  if (error instanceof Error){
    return failed(`${error.message} ${error.name}`);
  }
  if (error instanceof Response){
    return failed(`${error.status} ${error.statusText}`);
  }

  // handle fetching error for gapi
  try {
    const tmp = (error as gapi.client.HttpRequestRejected).result.error;
    return failed(`${tmp.code}, ${tmp.message}`);
  }
  catch (error2){
  }
  return failed(MSG_MAP.unknown_failed);
}

/**
 * @param error_msg string represents the reason why error happened
 * @returns FailedRes
 */
export function failed(error_msg: string): FailedRes {
  return {
    is_success: false,
    reason: `${MSG_MAP.failed}: ${error_msg}`
  }
}

/**
 * used in get response from gapi
 * @param response request result, CalendarAPIRes
 */
export function successFetchCalendarAPI(response: CalendarAPIRes): SuccessCalendarAPIRes{
  return {
    is_success: true,
    result: response
  }
}

/**
 * this also used in calendar api, as the final out put. (after several fetchings)
 * @param event_list Array<EventResource>, unproccessed events of this week
 */
export function successFetchEventList(event_list: Array<EventResource>): SuccessFetchEventListRes{
  return {
    is_success: true,
    result: {
      is_example: false,
      event_list
    }
  };
}

/**
 * this used when we choose to show example calendar data 
 */
 export function successExampleData(): SuccessFetchEventListRes {
  return {
    is_success: true,
    result: {
      is_example: true,
      event_list: []
    }
  };
}

export function successFetchWeatherAPI(data: SuccessWeatherAPI_3day | SuccessWeatherAPI_week): SuccessWeatherAPIRes {
  return {
    is_success: true,
    result: data
  };
}


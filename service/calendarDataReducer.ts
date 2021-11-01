import {exception} from '../libs/responseConstructors';
import { 
  parseCalendar, parseExample, getCalendarLinkByDate
} from '../libs/calendarDataConverters';
import { 
  loadingStatus, initStatus, failedStatus
} from '../libs/statusConstructors';

import {default as MSG_MAP} from '../datastore/app_msg_map.json';

/**
 * get data used in rendering WeekCalendarComponents by state
 */
export const calendarDataReducer: CalendarReducer = {
  init: initData,
  loading: loadingData,
  fetched: getDataFromFetchResult
}

function getDataFromFetchResult(fetch_result: SuccessFetchEventListRes | FailedRes, cur_week: Array<Date>): SuccessCalendarState | FailedCalendarState {
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

function successData(fetch_result: SuccessFetchEventListRes, cur_week: Array<Date>): SuccessCalendarState | FailedState {
  try{
    if (fetch_result.result.is_example){
      return parseExample(cur_week);
    }

    const res = parseCalendar(fetch_result, cur_week);

    for (let day = 0; day < 7; day ++){

      // if no event, add a link to add event
      if (res.data.event_list[day].length === 0){
        res.data.event_list[day] = [noEvent(cur_week[day])];
      }
    }
    return res;
  }
  catch (error){
    return failedData(exception(error), cur_week);
  }
}

function failedData(failed_result: FailedRes, cur_week: Array<Date>): FailedCalendarState {
  return failedStatus({
    is_example: false,
    event_list: fakeEventList(failed_result.reason)
  });
}

function initData(): InitCalendarState {
  return initStatus({
    is_example: false,
    event_list: fakeEventList(MSG_MAP.init_schedule)
  });
}

function loadingData(): LoadingCalendarState {
  return loadingStatus({
    is_example: false,
    event_list: fakeEventList(MSG_MAP.loading)
  });
}

/**
 * used in loading, failed, init state as spaceholder
 * @param msg string to show as summary
 */
function fakeEventList(msg: string): Array<Array<EventInfo>>{
  const event_list: Array<Array<EventInfo>> = new Array(7);
  event_list.fill([fakeEvent(msg)]);
  return event_list;
}

function fakeEvent(summary_text: string, url: string = ''): EventInfo{
  return {
    summary: summary_text,
    location: '-',
    link: url,
    duration: '-'
  }
}

/**
 * @param no_event_date Date that has 0 event
 * @returns a EventInfo that has a hint and link to add event
 */
function noEvent(no_event_date: Date): EventInfo{
  return fakeEvent(
    MSG_MAP.empty_schedule, 
    getCalendarLinkByDate(no_event_date)
  );
}
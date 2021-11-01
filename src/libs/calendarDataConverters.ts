import {
  getWeekListIdx, getDuration, getExampleDuration, getDateInCalenderAPI
} from './dateHelpers';
import { successStatus } from './statusConstructors';
import {default as API} from '../datastore/google_calendar_api_info.json';
import {default as EXAMPLE} from '../datastore/calendar_example.json';

export function parseCalendar(fetch_result: SuccessFetchEventListRes, cur_week: Array<Date>): SuccessCalendarState {
  const content = fetch_result.result;

  // sort by start time
  content.event_list.sort(((a: EventResource, b: EventResource) => 
    a.start - b.start
  ));

  let event_list: Array<Array<EventInfo>> = new Array(7);
  for (let day = 0; day < 7; day ++){
    event_list[day] = [];
  }

  content.event_list.forEach(eventItem => {
    const start_date = getDateInCalenderAPI(eventItem.start);
    const end_date = getDateInCalenderAPI(eventItem.end);

    const start_idx = getWeekListIdx(start_date, cur_week);
    const end_idx = getWeekListIdx(end_date, cur_week);

    // fill the week by events 
    for (let i = start_idx; i <= end_idx; i++){
      const event_info: EventInfo = {
        summary: eventItem.summary,
        location: eventItem.location || 'not set yet',
        link: eventItem.htmlLink,
        duration: getDuration(start_date, end_date)
      }
      event_list[i].push(event_info)
    }
  });

  return successStatus({
    is_example: false,
    event_list
  })
}

export function parseExample(cur_week: Array<Date>): SuccessCalendarState {
  const event_list = EXAMPLE.event_list;
  for (let day = 0; day < 7; day++){
    for (let i = 0; i < event_list[day].length; i++){
      event_list[day][i].duration = 
      getExampleDuration(event_list[day][i].duration, cur_week[day])
    }
  }
  return successStatus({
    is_example: true,
    event_list
  });
}

/**
* @param t Date that has 0 event
* @returns a link to add event
*/
export function getCalendarLinkByDate(t: Date){
 const [year, month, date] = [t.getFullYear(), t.getMonth() + 1, t.getDate()];
 return `${API.user_calendar_base_url}${year}/${month}/${date}`;
}
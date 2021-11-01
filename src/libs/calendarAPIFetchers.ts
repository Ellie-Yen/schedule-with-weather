import {default as API} from '../datastore/google_calendar_api_info.json';
import { 
  exception, success, 
  successFetchCalendarAPI, successFetchEventList, successExampleData
} from './responseConstructors';

const gapi = window.gapi; // don't forget to include gapi script in index.html

/**
 * Fetch user's events in his calendar,
 * for this app, we fetch the events of the current week.
 * ref: https://developers.google.com/calendar/api/guides/overview
 * @param kwargs : CalendarParam, contains following:
 * - use_exmaple_data: boolean, indicates the source to use.
 * - api_key: str to use google api
 * - calendar_id: str, id of fetching calendar
 * - time_min, time_max: str, range of time that we want to fetch event list
 * @returns a Promise conatins success fetched eventlists or a failed resaon.
 */
async function asyncFetchCalendar(kwargs: CalendarParam): Promise<FailedRes | SuccessFetchEventListRes>{
  // always return a resolved promise
  return new Promise((resolve)=>{
    try {
      if (kwargs.use_example_data){
        resolve(successExampleData());
        return;
      }
      async function asyncFetchHelper() {
        const res = await asyncExecute(kwargs);
        resolve(res);
      }
      gapi.load('client', asyncFetchHelper);
    }
    catch (error){
      resolve(exception(error));
    }
  });
}

/**
 * the main function of whole process, includes init and fetch.
 * @param kwargs CalendarParam contains following:
 * - use_exmaple_data: boolean, indicates the source to use.
 * - api_key: str to use google api
 * - calendar_id: str, id of fetching calendar
 * - time_min, time_max: str, range of time that we want to fetch event list
 */
async function asyncExecute(kwargs: CalendarParam): Promise<FailedRes | SuccessFetchEventListRes>{
  try {
    const init = initGAPI(kwargs.api_key);
    if (! init.is_success){
      return init;
    }
    // for each event_list, fetch all holding periods of each event on the list
    // the result of even_list and event periods are paginated. 
    let result: Array<EventResource> = [];
    let eventListPage = "";
    while (eventListPage !== undefined){
      const eventListRes = await asyncFetchEventList(kwargs, eventListPage);
      if (! eventListRes.is_success){
        return eventListRes;
      }
      const eventList: CalendarAPIContent = eventListRes.result.result;
      for (let eventItem of eventList.items){
        let eventPage = "";
        while (eventPage !== undefined){
          const eventRes = await asyncFetchEvent(kwargs, eventItem.id, eventPage);
          if (! eventRes.is_success){
            return eventRes;
          }
          const eventDetail: CalendarAPIContent = eventRes.result.result;
          result = result.concat(eventDetail.items);
          eventPage = eventDetail.nextPageToken;
        }
      }
      eventListPage = eventList.nextPageToken;
    }
    return successFetchEventList(result);
  }
  catch (error: unknown){
    return exception(error);
  }
}
/**
 * the function to init google api
 * @param api_key : string
 */
function initGAPI(api_key: string): SuccessRes | FailedRes {
  try {
    gapi.client.setApiKey(api_key);
    return success();
  }
  catch (error) {
    return exception(error);
  }
}

/**
 * helps make a client-side request to google api. 
 * @param url the url address to make a request.
 */
async function asyncGAPIRequest(url: string): Promise<SuccessCalendarAPIRes | FailedRes>{
  try {
    const res = await gapi.client.request({
      'path': url,
    });
    return successFetchCalendarAPI(res);
  }
  catch (error) {
    return exception(error);
  } 
}

/**
 * helps to fetch event_list on page x.
 * @param kwargs CalendarParam
 * @param nextPageToken string, a gapi provided token to get next page result.
 */
async function asyncFetchEventList(kwargs: CalendarParam, nextPageToken: string = ""){
  return await asyncGAPIRequest(getEventListRequestURL(kwargs, nextPageToken));
}

/**
 * helps to fetch all periods of event whose id is event_id on page x.
 * @param kwargs CalendarParam
 * @param event_id string, an id represents the event of fetching.
 * @param nextPageToken string, a gapi provided token to get next page result.
 */
async function asyncFetchEvent(kwargs: CalendarParam, event_id: string, nextPageToken: string = ""){
  return await asyncGAPIRequest(getEventRequestURL(kwargs, event_id, nextPageToken));
}

/**
 * return an url that can fetch event_list on page x.
 * @param kwargs CalendarParam
 * @param nextPageToken string, a gapi provided token to get next page result.
 */
function getEventListRequestURL(kwargs: CalendarParam, nextPageToken: string = ""): string {
  const {calendar_id, time_max, time_min} = kwargs;
  const page_params = nextPageToken === ''?
    `pageToken=${nextPageToken}&`: '';
  const query_params = `timeMax=${time_max}&timeMin=${time_min}`
  const res = `${API.base_url}${calendar_id}/events?${page_params}${query_params}`;
  return res;
}

/**
 * return an url that can fetch periods of an event whose id is event_id on page x.
 * @param kwargs CalendarParam
 * @param event_id string, an id represents the event of fetching.
 * @param nextPageToken string, a gapi provided token to get next page result.
 */
function getEventRequestURL(kwargs: CalendarParam, event_id: string, nextPageToken: string = ""): string{
  const {calendar_id, time_max, time_min} = kwargs;
  const page_params = nextPageToken === ''?
    `pageToken=${nextPageToken}&`: '';
  const query_params = `timeMax=${time_max}&timeMin=${time_min}`
  const res = `${API.base_url}${calendar_id}/events/${event_id}/instances?${page_params}${query_params}`;
  return res;
}

export default asyncFetchCalendar;
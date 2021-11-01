/**
 * model for response in fetching api 
 */
interface SuccessRes {
  is_success: true
}

interface FailedRes {
  is_success: false,
  reason: string
}

interface SuccessCalendarAPIRes extends SuccessRes {
  result: CalendarAPIRes
}

interface SuccessFetchEventListRes extends SuccessRes {
  result: {
    is_example: boolean,
    event_list: Array<EventResource>
  } 
}

interface SuccessWeatherAPIRes extends SuccessRes {
  result: SuccessWeatherAPI_3day | SuccessWeatherAPI_week
}
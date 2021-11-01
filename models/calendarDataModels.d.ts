/**
 * data models used for WeekCalendar components
 */

interface WeekEventData {
  is_example: boolean, 
  event_list: Array<Array<EventInfo>>
}

interface EventInfo {
  summary: string,
  location: string,
  link: string,
  duration: string
}


/**
 * models used for fetching api and state controll
 */

interface CalendarParam {
  api_key: string,
  calendar_id: string,
  time_min: string,
  time_max: string,
  use_example_data: boolean   
}

interface WeatherParam {
  city: string,
  town: string
}
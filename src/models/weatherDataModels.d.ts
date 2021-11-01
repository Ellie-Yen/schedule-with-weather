/**
 * data models used for rendering weather components
 */

interface Weather3DayItemInfo {
  duration: string,
  is_night: boolean,
  weather: string,
  code: string,
  temperature: string,
  feel: string,
  RH: string // relative humidity percentage
  POP: string // probability of precipitation percentage
}

interface WeatherWeekData {
  weather_list: Array<WeatherWeekItemInfo>,
  temperature: {
    minT: Array<number>,
    maxT: Array<number>
  }
}

interface WeatherWeekItemInfo {
  day: Weather12HItemInfo,
  night: Weather12HItemInfo
}

interface Weather12HItemInfo {
  code: string,
  POP: string
}
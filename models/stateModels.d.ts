/**
 * used in rendering components
 * as indicator of state
 */

interface TimeState {
  cur_week: Array<Date>,
  display_week: Arrat<string>
}

type Status = 'init' | 'loading' | 'failed' | 'success';

interface InitState {
  status: 'init',
  data: any
}
interface LoadingState extends InitState {
  status: 'loading'
}
interface FailedState extends InitState {
  status: 'failed'
}
interface SuccessState extends InitState {
  status: 'success'
}

type State = InitState | LoadingState | FailedState | SuccessState;

interface SuccessCalendarState extends SuccessState {
  data: WeekEventData
}

interface InitCalendarState extends InitState {
  data: WeekEventData
}

interface LoadingCalendarState extends LoadingState {
  data: WeekEventData
}

interface FailedCalendarState extends FailedState {
  data: WeekEventData
}

type CalendarState = InitCalendarState | LoadingCalendarState | FailedCalendarState | SuccessCalendarState;

interface SuccessWeather3DayState extends SuccessState {
  data: Array<Weather3DayItemInfo>
}

interface InitWeather3DayState extends InitState {
  data: Array<Weather3DayItemInfo>
}

interface LoadingWeather3DayState extends LoadingState {
  data: Array<Weather3DayItemInfo>
}

interface FailedWeather3DayState extends FailedState {
  data: Array<Weather3DayItemInfo>
}

type Weather3DayState = InitWeather3DayState | LoadingWeather3DayState | FailedWeather3DayState | SuccessWeather3DayState;

interface SuccessWeatherWeekState extends SuccessState {
  data: WeatherWeekData
}

interface InitWeatherWeekState extends InitState {
  data: WeatherWeekData
}

interface LoadingWeatherWeekState extends LoadingState {
  data: WeatherWeekData
}

interface FailedWeatherWeekState extends FailedState {
  data: WeatherWeekData
}

type WeatherWeekState = InitWeatherWeekState | LoadingWeatherWeekState | FailedWeatherWeekState | SuccessWeatherWeekState;

interface StateReducer {
  init: (...args: any) => State,
  loading: (...args: any) => State,
  fetched: (...args: any) => State
}

type CalendarReducer = {
  [Property in keyof StateReducer]: (...args: any) => CalendarState
}

type Weather3DayReducer = {
  [Property in keyof StateReducer]: (...args: any) => Weather3DayState
}

type WeatherWeekReducer = {
  [Property in keyof StateReducer]: (...args: any) => WeatherWeekState
}
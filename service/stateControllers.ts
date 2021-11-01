import React from 'react';
import {calendarDataReducer} from './calendarDataReducer';
import asyncFetchCalendar from '../libs/calendarAPIFetchers';

import { getCurrentWeekDateList, toDisplayDateList } from '../libs/dateHelpers';
import { asyncFetchWeather_3day, asyncFetchWeather_week } from '../libs/weatherAPIFetchers';
import {weather3DayDataReducer} from './weather3DayDataReducer';
import {weatherWeekDataReducer} from './weatherWeekDataReducer';

/**
 * @returns [timeState, refresh]
 * - timeState a mutable constant, contains following keys:
 *    - cur_week: Array<Date> for sorting data in fetching api.
 *    - display_week: Array<string> for rendering in components
 * - refresh: a static function for refreshing timeState
 */
export function useTimeState(): [TimeState, () => void]{
  const cur_week = getCurrentWeekDateList();
  const [timeState, setTimeState] = React.useState<TimeState>({
    cur_week,
    display_week: toDisplayDateList(cur_week) 
  });
  const refresh = () => {
    const new_cur_week = getCurrentWeekDateList();
    setTimeState({
      cur_week: new_cur_week,
      display_week: toDisplayDateList(new_cur_week)
    })
  }
  return [timeState, refresh];
}

interface RenderDataStateProps {
  kwargs: any,
  fetchFunc: Function,
  reducer: StateReducer,
  cur_week: Array<Date>
}
/**
 * used in rendering components.
 * @param kwargs  parameter to pass to fetchFunc
 * @param fetchFunc function that return a fetching state
 * @param reducer a map contains data processing functions 
 * to generate data for rendering
 * @param cur_week as a param for reducer
 * @returns a mutable constant represents the fetching state of api
 */
function RenderDataState(props: RenderDataStateProps): State {
  // init state
  const [state, setStatus] = React.useState(props.reducer.init());
  React.useEffect(()=>{
    async function update(){
      // set loading
      setStatus(props.reducer.loading());

      // set final result
      const result = await props.fetchFunc(props.kwargs);
      setStatus(props.reducer.fetched(result, props.cur_week));
    }
    if (props.kwargs !== null){
      update();
    }
    // eslint-disable-next-line
  }, [props.kwargs, props.cur_week]);
  return state;
}

export function getCalendarState(kwargs: CalendarParam | null, cur_week: Array<Date>): CalendarState {
  return RenderDataState({
    kwargs,
    fetchFunc: asyncFetchCalendar,
    reducer: calendarDataReducer,
    cur_week
  });
}

export function getWeather3DayState(kwargs: WeatherParam | null, cur_week: Array<Date>): Weather3DayState {
  return RenderDataState({
    kwargs,
    fetchFunc: asyncFetchWeather_3day,
    reducer: weather3DayDataReducer,
    cur_week
  });
}

export function getWeatherWeekState(kwargs: WeatherParam | null, cur_week: Array<Date>): WeatherWeekState {
  return RenderDataState({
    kwargs,
    fetchFunc: asyncFetchWeather_week,
    reducer: weatherWeekDataReducer,
    cur_week
  });
}
import { useState, useMemo } from 'react';
import {
  getWeather3DayState, getWeatherWeekState, getCalendarState,
  useTimeState
} from './service/stateControllers';

import Weather3DaySection from './sections/Weather3DaySection';
import WeatherWeekSection from './sections/WeatherWeekSection';
import ScheduleSection from './sections/ScheduleSection';
import SettingSection from './sections/SettingSection';

import './App.css';
import './datastore/WeatherIcon/css/weather-icons.min.css';

export default function App(){
  const [timeState, refresh] = useTimeState();
  const [weatherParam, setWeatherParam] = useState<WeatherParam | null>(null);

  const weather3DayState = getWeather3DayState(weatherParam, timeState.cur_week);
  const weatherWeekState = getWeatherWeekState(weatherParam, timeState.cur_week);
  
  const [calendarParam, setCalendarParam] = useState<CalendarParam | null>(null);
  const calendarState = getCalendarState(calendarParam, timeState.cur_week);

  const Forecast3Day = useMemo(()=> (
    <Weather3DaySection
      state={weather3DayState}
    />
  ), [weather3DayState]);
  
  const ForecastWeek = useMemo(()=> (
    <WeatherWeekSection
      display_week={timeState.display_week}
      state={weatherWeekState}
    />
  ), [weatherWeekState, timeState.display_week]);

  const Schedule = useMemo(()=> (
    <ScheduleSection
      display_week={timeState.display_week}
      weatherState={weatherWeekState}
      calendarState={calendarState}
    />
  ), [weatherWeekState, calendarState, timeState.display_week]);

  const Setting = useMemo(()=> (
    <SettingSection
      weatherParam={weatherParam}
      setWeatherParam={setWeatherParam}
      calendarParam={calendarParam}
      setCalendarParam={setCalendarParam}
      cur_week={timeState.cur_week}
    />
  ), [weatherParam, calendarParam, timeState.cur_week]);
  
  // auto refresh per 3 hrs
  setInterval(()=> {
    refresh();
  }, 60 * 60 * 3 * 1000);

  return (
    <div className="App">
      <header id='app-setting'>
        {Setting}
      </header>
      <main id="app-main">
        <section id="app-weather" className="section">
          {Forecast3Day}
          {ForecastWeek}
        </section>
        <section id="app-schedule" className="section">
          {Schedule}
        </section>
      </main>
    </div>
  );
}


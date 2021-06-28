import React from 'react';
import {FetchCalendarState, FetchingWeatherState} from './data_process_functions/FetchingState';

import SettingSection from './app_sections/SettingSection';
import WeatherSectionWeek from './app_sections/WeatherSectionWeek';
import WeatherSection3Day from './app_sections/WeatherSection3Day';
import ScheduleSection from './app_sections/ScheduleSection';

import './App.css';
import './datastore/WeatherIcon/css/weather-icons.min.css';

function App(){

  // fetching schedule
  const [start, setStart] = React.useState(Date.now());
  const [api_key, setAPIKey] = React.useState("");
  const [calendar_id, setCalendarID] = React.useState("");
  const [use_example_data, setUseExample] = React.useState(true);

  const [schedule_data, schedule_loading] = FetchCalendarState(api_key, calendar_id, start, use_example_data);

  // fetching weather
  const [city, setCity] = React.useState("");
  const [town, setTown] = React.useState("");
  const [weather_data, weather_loading] = FetchingWeatherState(city, town, start);

  const [Forecast3Day, ForecastWeek] = React.useMemo(()=> [
    <WeatherSection3Day
      loading={weather_loading}
      data={weather_data["3day"]}
      is_success={weather_data.is_success}
    />,
    <WeatherSectionWeek
      loading={weather_loading}
      data={weather_data["week"]}
      is_success={weather_data.is_success}
    />
  ], [weather_data, weather_loading]);

  const Schedule = React.useMemo(()=>
    <ScheduleSection
      schedule={{
        loading: schedule_loading,
        is_success: schedule_data.is_success,
        data: schedule_data
      }}
      weather={{
        loading: weather_loading,
        is_success: weather_data.is_success,
        data: weather_data
      }}
    />
  , [weather_data, weather_loading, schedule_data, schedule_loading]);

  const RefreshAll = () => {
    setStart(Date.now());
  }
  return (
    <div className="App">
      <header>
        <SettingSection
          setCity={setCity}
          setTown={setTown}
          setAPIKey={setAPIKey}
          setCalendarID={setCalendarID}
          setUseExample={setUseExample}
          RefreshAll={RefreshAll}
        />
      </header>
      <main id="app-main">
        <section id="app-weather" className="section">
          {Forecast3Day}
          {ForecastWeek}
        </section>
        {Schedule}
      </main>
    </div>
  );
}

export default App;

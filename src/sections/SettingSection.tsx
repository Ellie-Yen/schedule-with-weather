import { useState } from "react";
import { MenuWrapper } from '../components/MenuWrapper';
import { 
  MyForm, 
  SelectInputComponent, 
  PasswordInputComponent, 
  ToggleCheckComponent
} from "../components/MyFormElements";

import {default as CITY_MAP} from '../datastore/weather_city_map.json';
import {default as ICON_MAP} from '../datastore/app_icon_map.json';
import {default as CONTENT_MAP} from '../datastore/app_content_map.json';

interface SettingSectionProps {
  weatherParam: WeatherParam | null,
  setWeatherParam: React.Dispatch<React.SetStateAction<WeatherParam | null>>,
  calendarParam: CalendarParam | null,
  setCalendarParam: React.Dispatch<React.SetStateAction<CalendarParam | null>>,
  cur_week: Array<Date>
}
/**
 * @param props SettingSectionProps 
 * - cur_week: Array<Date>
 * for weather, calendar state, each contains following properties:
 * - param: param | null, null for init only, required info for fetching api.
 * - setParam: React.Dispatch<React.SetStateAction> to update param above.
 */
export default function SettingSection(props: SettingSectionProps){
  return (
    <MenuWrapper
      icon_cls_name={ICON_MAP.setting}
    >
      <WeatherParamSetSection
        weatherParam={props.weatherParam}
        setWeatherParam={props.setWeatherParam}
      />
      <CalendarParamSetSection
        calendarParam={props.calendarParam}
        setCalendarParam={props.setCalendarParam}
        cur_week={props.cur_week}
      />
    </MenuWrapper>
  );
}

interface WeatherParamSetSectionProps {
  weatherParam: WeatherParam | null
  setWeatherParam: React.Dispatch<React.SetStateAction<WeatherParam | null>>
}
function WeatherParamSetSection(props: WeatherParamSetSectionProps){
  const [city, setCity] = useState<string>(props.weatherParam?.city || '');
  const [town, setTown] = useState<string>(props.weatherParam?.town || '');

  const handleSetCity = (newCity: string) => {
    // remove town if reselect
    setCity(newCity);
    setTown('');
  }
  const handleSubmit = () => {
    props.setWeatherParam({
      city,
      town
    });
  }
  const handelCancel = () => {
    setCity(props.weatherParam?.city || '');
    setTown(props.weatherParam?.town || '');
  }

  type city_data_key = keyof typeof CITY_MAP.city_data;

  return ( 
    <MyForm
      submit_func={handleSubmit}
      cancel_func={handelCancel}
      question={CONTENT_MAP.setting_weather}
    >
      <SelectInputComponent
        label={CONTENT_MAP.select_city_label}
        value={city}
        setValue={handleSetCity}
        option_list={CITY_MAP.cities}
      />
      <SelectInputComponent
        label={CONTENT_MAP.select_town_label}
        value={town}
        setValue={setTown}
        option_list={
          city !== '' ?
          CITY_MAP.city_data[city as city_data_key].town_list:
          []
        }
      />
    </MyForm>
  );
}

interface CalendarParamSetSectionProps {
  calendarParam: CalendarParam | null
  setCalendarParam: React.Dispatch<React.SetStateAction<CalendarParam | null>>,
  cur_week: Array<Date>
}
function CalendarParamSetSection(props: CalendarParamSetSectionProps){
  const [api_key, setAPIKey] = useState<string>(props.calendarParam?.api_key || '');
  const [calendar_id, setCalendarID] = useState<string>(props.calendarParam?.calendar_id || '');
  const [use_example_data, setUseEx] = useState<boolean>(props.calendarParam?.use_example_data || true);
  const handleSubmit = () => {
    props.setCalendarParam({
      api_key,
      calendar_id,
      use_example_data,
      time_min: props.cur_week[0].toISOString(),
      time_max: props.cur_week[6].toISOString()
    });
  }
  const handelCancel = () => {
    setAPIKey(props.calendarParam?.api_key || '');
    setCalendarID(props.calendarParam?.calendar_id || '');
    setUseEx(props.calendarParam?.use_example_data || true);
  }
  return ( 
    <MyForm
      submit_func={handleSubmit}
      cancel_func={handelCancel}
      question={CONTENT_MAP.setting_calendar}
    >
      <ToggleCheckComponent
        label={CONTENT_MAP.calendar_source_label}
        value={use_example_data}
        setValue={setUseEx}
        msg_checked={CONTENT_MAP.calendar_source_msg_checked}
      />
      {(!use_example_data) && (
        <>
        <PasswordInputComponent
          icon_cls_name={ICON_MAP.calendar_api_key}
          label={CONTENT_MAP.calendar_api_key_label}
          value={api_key}
          setValue={setAPIKey}
        />
        <PasswordInputComponent
          icon_cls_name={ICON_MAP.calendar_id}
          label={CONTENT_MAP.calendar_id_label}
          value={calendar_id}
          setValue={setCalendarID}
        />
        </>
      )}
    </MyForm>
  );
}

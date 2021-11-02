import { ColDiv, CenterTitle } from '../components/appStyleWrappers';
import { LeftBorderCard, BigGridRoundCard } from '../components/Card';
import { IconLabeledElement } from '../components/IconElements';
import { WeatherDisplayReducer } from '../components/StateComponents';

import {default as ICON_MAP} from '../datastore/app_icon_map.json'

interface ScheduleSectionProps {
  weatherState: WeatherWeekState,
  calendarState: CalendarState,
  display_week: Array<string>
}

export default function ScheduleSection(props: ScheduleSectionProps){
  return (
    <>
      {props.display_week.map((day, i)=>
        <BigGridRoundCard
          col='20% 1fr'
          alignItems='stretch'
          key={`schedule_of_day-${i}`}
        >
          <ColDiv>
            <CenterTitle>{day}</CenterTitle>
            <WeatherOfDay
              status={props.weatherState.status}
              item_info={props.weatherState.data.weather_list[i]}
            />
          </ColDiv>
          <EventOfDay
            event_list={props.calendarState.data.event_list[i]}
          />
        </BigGridRoundCard>
      )}
    </>
  );
}
interface WeatherOfDayProps {
  status: Status,
  item_info: WeatherWeekItemInfo
}
function WeatherOfDay(props: WeatherOfDayProps){
  return (
    <ColDiv>
      {['day', 'night'].map((k, i)=>
        <ColDiv key={`weather_of_day-${i}`}>
          {WeatherDisplayReducer[props.status]({
            code: props.item_info[k as keyof WeatherWeekItemInfo].code,
            is_night: k === 'night'
          })}
          {props.item_info[k as keyof WeatherWeekItemInfo].POP}
        </ColDiv>
      )}
    </ColDiv>
  );
}

interface EventOfDayProps {
  event_list: Array<EventInfo>
}
function EventOfDay(props: EventOfDayProps){
  return (
    <ColDiv
      alignItems='stretch'
    >
      {props.event_list.map((event_info, i)=>
        <SingleEvent
          event_info={event_info}
          key={`day_event-${i}`}
        />
      )}
    </ColDiv>
  );
}

interface SingleEventProps {
  event_info: EventInfo
}
function SingleEvent(props: SingleEventProps){
  const ViewOnCalendar = () => {
    if (props.event_info.link === ''){
      return;
    }
    window.open(props.event_info.link, "_blank");
  }
  return (
    <LeftBorderCard
      onClick={ViewOnCalendar}
    >
      <ColDiv
        alignItems="stretch"
      >
        <h1>{props.event_info.summary}</h1>
        {['duration', 'location'].map((title, i)=>
          <IconLabeledElement
            icon_cls_name={ICON_MAP[title as keyof typeof ICON_MAP]}
            content={props.event_info[title as keyof EventInfo]}
            key={`single_event-${i}`}
          />
        )}
      </ColDiv>
    </LeftBorderCard>
  );
}

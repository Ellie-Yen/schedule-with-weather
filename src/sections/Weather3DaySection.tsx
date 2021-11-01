import { useState, useEffect } from 'react';

import { RowDiv } from '../components/appStyleWrappers';
import {IconLabeledElement} from '../components/IconElements';
import { 
  SpecialWeatherDisplayReducer, 
  WeatherPicReducer
} from '../components/StateComponents';
import {VerticalFlexRoundCard} from '../components/Card';
import SlideShowWrapper from '../components/SlideShowWrapper';
import {default as ICON_MAP} from '../datastore/app_icon_map.json'
import {default as CONTENT_MAP} from '../datastore/app_content_map.json';

interface Weather3DaySectionProps {
  state: Weather3DayState
}

export default function Weather3DaySection(props: Weather3DaySectionProps){
  const [page, setPage] = useState<number>(0);

  // be very careful, the page would stay the same in re-rendering
  // and will cause an error if not changing manually.
  useEffect(()=> {
    if (page >= props.state.data.length){
      setPage(0);
    }
  }, [props.state.data, page]);

  // the update above might be slower than rendering
  // thus we need a constant to ensure.
  const p = Math.min(page, props.state.data.length - 1);

  return (
    <section id="weather_3day">
      <div id="weather_3day_pic">
        <Weather3DayPic
          status={props.state.status}
          item_info={props.state.data[p]}
        />
      </div>
      <SlideShowWrapper
        max_page={props.state.data.length - 1}
        page={p}
        setPage={setPage}
      >
        <Weather3DayCard
          status={props.state.status}
          item_info={props.state.data[p]}
        />
      </SlideShowWrapper>
    </section>
  );
}

interface Weather3DayItemProps {
  status: Status,
  item_info: Weather3DayItemInfo
}
function Weather3DayCard(props: Weather3DayItemProps){
  return (
    <VerticalFlexRoundCard>
      <RowDiv>{props.item_info.duration || CONTENT_MAP.weather_3day}</RowDiv>
      <RowDiv>
        {SpecialWeatherDisplayReducer[props.status]({
          code: props.item_info.code,
          is_night: props.item_info.is_night
        })}
      </RowDiv>
      <RowDiv>{props.item_info.weather}</RowDiv>
      <RowDiv>
        <h1>{`${props.item_info.temperature} ${CONTENT_MAP.temperature_unit}`}</h1>
        {props.item_info.feel}
      </RowDiv>
      <RowDiv>
        {['RH', 'POP'].map((title, i)=>(
          <IconLabeledElement
            icon_cls_name={ICON_MAP[title as keyof typeof ICON_MAP]}
            content={`${props.item_info[title as keyof Weather3DayItemInfo]}`}
            key={`labeled-${i}`}
          />
        ))}
      </RowDiv>
    </VerticalFlexRoundCard>
  );
}

function Weather3DayPic(props: Weather3DayItemProps){
  return (
    WeatherPicReducer[props.status]({
      code: props.item_info.code,
      is_night: props.item_info.is_night
    })
  );
}
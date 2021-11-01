import { VerticalFlexRoundCard } from '../components/Card';
import ChartComponent from '../components/ChartComponent';
import {default as CONTENT_MAP} from '../datastore/app_content_map.json';

interface WeatherWeekSectionProps {
  display_week: Array<string>,
  state: WeatherWeekState
}
export default function WeatherWeekSection(props: WeatherWeekSectionProps){
  return (
    <VerticalFlexRoundCard
      id="weather_week"
    >
      {CONTENT_MAP.weather_week}
      <ChartComponent
        x_labels={props.display_week}
        data={{
          vals_lists: [
            props.state.data.temperature.maxT,
            props.state.data.temperature.minT
          ],
          unit_list: [
            CONTENT_MAP.temperature_unit,
            CONTENT_MAP.temperature_unit
          ]
        }}
      />
    </VerticalFlexRoundCard>
  );
}
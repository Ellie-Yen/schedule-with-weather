import {default as ICON_MAP} from '../datastore/app_icon_map.json';
import {default as WEATHER_ICON_MAP} from '../datastore/weather_icon_map.json';
import {default as WEATHER_PIC_MAP} from '../datastore/weather_pic_map.json';
import { Loader } from './Loader';
import { BigIcon, Big3DIcon } from './IconElements';
import { DecoBackground } from './DecoBackground';

type ConstructorMap = {
  [Property in Status]: (...args: any) => JSX.Element
}

interface WeatherDisplayElementProps {
  code: string,
  is_night: boolean
}
/**
 * used in week weather for each status.
 * @param args WeatherDisplayElementProps, contains following keys:
 * - code: string, a code represents current weather.
 * - is_night: boolean: there are day and night version icon.
 */
export const WeatherDisplayReducer: ConstructorMap = {
  init: ((args: WeatherDisplayElementProps) => 
    <BigIcon className={ICON_MAP.empty}/>
  ),
  loading: ((args: WeatherDisplayElementProps) => 
    <Loader/>
  ),
  failed: ((args: WeatherDisplayElementProps) => 
    <BigIcon className={ICON_MAP.failed}/>
  ),
  success: ((args: WeatherDisplayElementProps) => 
    <BigIcon className={getWeatherIconClsName(args)}/>
  )
}

/**
 * used in 3day weather for each status.
 * @param args WeatherDisplayElementProps, contains following keys:
 * - code: string, a code represents current weather.
 * - is_night: boolean: there are day and night version icon.
 */
export const SpecialWeatherDisplayReducer: ConstructorMap = {
  init: ((args: WeatherDisplayElementProps) => 
    <Big3DIcon className={ICON_MAP.empty}/>
  ),
  loading: ((args: WeatherDisplayElementProps) => 
    <Loader radius={2}/>
  ),
  failed: ((args: WeatherDisplayElementProps) => 
    <Big3DIcon className={ICON_MAP.failed}/>
  ),
  success: ((args: WeatherDisplayElementProps) => 
    <Big3DIcon className={getWeatherIconClsName(args)}/>
  )
}


/**
 * used in 3day weather for each status.
 * @param args WeatherDisplayElementProps, contains following keys:
 * - code: string, a code represents current weather.
 * - is_night: boolean: there are day and night version icon.
 */
 export const WeatherPicReducer: ConstructorMap = {
  init: ((args: WeatherDisplayElementProps) => 
    <DecoBackground
      img_url={getWeatherPicUrl()}
    />
  ),
  loading: ((args: WeatherDisplayElementProps) => 
    <DecoBackground
      img_url={getWeatherPicUrl()}
    />
  ),
  failed: ((args: WeatherDisplayElementProps) => 
    <DecoBackground
      img_url={getWeatherPicUrl()}
    />
  ),
  success: ((args: WeatherDisplayElementProps) => 
    <DecoBackground
      img_url={getWeatherPicUrl(args)}
    />
  )
}

const defaultWeatherArgs: WeatherDisplayElementProps = {
  code: '00',
  is_night: false
};

/**
 * @param args, contains following keys
 * - code : string represents weather
 * - is_night: bool, there are day and night version
 */
function getWeatherIconClsName(args: WeatherDisplayElementProps = defaultWeatherArgs): string {
  let icons = WEATHER_ICON_MAP[args.code as keyof typeof WEATHER_ICON_MAP];
  
  // not find weather
  if (! icons){
    icons = WEATHER_ICON_MAP["00"];
  }
  return args.is_night ? icons.night: icons.day;
}

/**
 * put images in public url so that it can imports.
 * otherwise it might failed.
 * @param args, contains following keys
 * - code : string represents weather
 * - is_night: bool, there are day and night version
 */
function getWeatherPicUrl(args: WeatherDisplayElementProps = defaultWeatherArgs): string {
  // weather: string of relevant weather description
  // is_night: bool
  let pics = WEATHER_PIC_MAP[args.code as keyof typeof WEATHER_PIC_MAP];
  
  // not find weather
  if (! pics){
    pics = WEATHER_PIC_MAP["00"];
  }
  return `WeatherPics/${args.is_night ? pics.night: pics.day}.jpg`;
}
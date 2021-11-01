import { 
  getDuration, getDateInWeatherAPI, 
  checkIsNight, getWeekListIdx 
} from "./dateHelpers";
import { successStatus } from './statusConstructors';

export function parseWeather3Day(fetch_result: SuccessWeatherAPIRes): SuccessWeather3DayState{
  const weatherLists = getWeatherElementLists(fetch_result);
  const wx = weatherLists.Wx;
  const rh = weatherLists.RH;
  const ci = weatherLists.CI;
  const pop6h = weatherLists.PoP6h;
  const data = new Array<Weather3DayItemInfo>(wx.length);
  let pop_idx = 0; // other item is listed per 3 hr, but pop is per 6 hr

  for (let i = 0; i < wx.length; i++){
    if (pop_idx + 1 < wx.length &&
      wx[i].start === pop6h[pop_idx + 1].start){
      pop_idx += 1;
    }
    data[i] = {
      duration: wx[i].duration,
      is_night: wx[i].is_night,
      weather: wx[i].weather,
      code: wx[i].code,
      temperature: ci[i].temperature,
      feel: ci[i].feeling,
      RH: rh[i],
      POP: pop6h[pop_idx].val
    }
  } 
  return successStatus(data);
}

export function parseWeatherWeek(fetch_result: SuccessWeatherAPIRes, cur_week: Array<Date>): SuccessWeatherWeekState{
  const weatherLists = getWeatherElementLists(fetch_result);
  const wx = weatherLists.Wx;
  const minT = weatherLists.MinT;
  const maxT = weatherLists.MaxT;
  const pop = weatherLists.PoP12h;

  const weather_list = new Array<WeatherWeekItemInfo>(7);
  const minTList = new Array<number>(7);
  const maxTList = new Array<number>(7);

  let day = getWeekListIdx(wx[0].start, cur_week);

  for (let i = 0; i < wx.length; i++){
    
    // handle temperature (minT/ maxT/ range) and add new item 
    if (minTList[day] === undefined){
      minTList[day] = minT[i];
      maxTList[day] = maxT[i];

      weather_list[day] = {
        day: emptyWeather12HItemInfo,
        night: emptyWeather12HItemInfo
      };
    }
    else {
      minTList[day] = Math.min(minT[i], minTList[day]);
      maxTList[day] = Math.max(maxT[i], maxTList[day]);
    }

    // ensure time span and add weather
    if (wx[i].is_night){
      weather_list[day].night = {
        code: wx[i].code,
        POP: pop[i]
      };
      day ++;
      continue;
    }
    
    weather_list[day].day = {
      code: wx[i].code,
      POP: pop[i]
    };
  }  
  return successStatus({
    weather_list,
    temperature: {
      minT: minTList,
      maxT: maxTList
    }
  });
}

const emptyWeather12HItemInfo: Weather12HItemInfo = {
  code: '00',
  POP: '-'
}

type WeatherElementLists = {
  Wx: Array<WxData>,
  CI: Array<CIData>,
  RH: Array<string>,
  PoP12h: Array<string>,
  PoP6h: Array<TimeValData>,
  MinT: Array<number>,
  MaxT: Array<number>
}

type WeatherElementFuncMap = {
  [Property in keyof WeatherElementLists]: Function
}

const parse_func_map: WeatherElementFuncMap = {
  Wx: parseWx,
  CI: parseCI,
  RH: getStrWE,
  PoP12h: getStrWE,
  PoP6h: parsePoP6h,
  MinT: parseNumWE,
  MaxT: parseNumWE
}

/**
 * we fetch only a town in a city, with several weatherElements
 * @param fetch_result SuccessWeatherAPIRes
 * @returns an object contains mutiple weather elements that we asked in api
 */
function getWeatherElementLists(fetch_result: SuccessWeatherAPIRes): WeatherElementLists{
  const weatherList = fetch_result.result.records.locations[0].location[0].weatherElement;
  let res: WeatherElementLists = {
    Wx: [],
    CI: [],
    RH: [],
    PoP12h: [],
    PoP6h: [],
    MinT: [],
    MaxT: []
  };
  for (let weatherElement of weatherList){
    const t = weatherElement.elementName;
    res[t] = parse_func_map[t](weatherElement);
  }
  return res;
}

interface WxData {
  start: Date,
  duration: string,
  is_night: boolean,
  weather: string,
  code: string
}

/**
 * @returns an array of objects contains following key:
 * - start: Date, the startTime of the periods for aligning with other items.
 * - duration: string, duration of the periods for rendering.
 * - is_night: bool, for rendering day/night components
 * - weather: string, weather description.
 * - code: string, the code to represents the weather above.
 */
function parseWx(elementList: Wx): Array<WxData>{
  return elementList.time.map(item => {
    const start = getDateInWeatherAPI(item.startTime);
    return {
      start: start,
      duration: getDuration(start, getDateInWeatherAPI(item.endTime)),
      is_night: checkIsNight(start),
      weather: item.elementValue[0].value,
      code: item.elementValue[1].value
    }
  });
}

interface CIData {
  temperature: string,
  feeling: string
}
/**
 * @returns an array of objects contains following key:
 * - temperature: string
 * - feeling: string, ci description
 */
function parseCI(elementList: CI): Array<CIData>{
  return elementList.time.map(item => ({
    temperature: item.elementValue[0].value,
    feeling: item.elementValue[1].value
  }));
}

interface TimeValData {
  val: string,
  start: Date
}

/**
 * Return startTime that used in alignment,
 * since Pop6h (used in weather3Day) has update frequency of (1/ 6hr)
 * that is different to others (1/ 3hr).
 * @returns an array of objects contains following key:
 * - start: Date, the startTime of the periods for aligning with other items.
 * - val: string typed PoP6h
 */
function parsePoP6h(elementList: PoP6h): Array<TimeValData>{
  return elementList.time.map(item => ({
    start: getDateInWeatherAPI(item.startTime),
    val: `${item.elementValue[0].value} %`
  }));
}

/**
 * @returns an array of MinT | MaxT value in number type
 */
function parseNumWE(elementList: MinT | MaxT): Array<number> {
  return elementList.time.map(item => (
    parseFloat(item.elementValue[0].value)
  ));
}

/**
 * @returns an array of RH | PoP12h value in string type
 */
function getStrWE(elementList: RH | PoP12h): Array<string> {
  return elementList.time.map(item => (
    `${item.elementValue[0].value} %`
  ));
}
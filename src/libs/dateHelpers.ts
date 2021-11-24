const DAY_SEC = 86400000;

/**
 * return true if time is night (18: 00 ~ 6: 00) else false.
 * @param t : Date
 */
function checkIsNight(t: Date): boolean {
  const hr = t.getHours();
  return hr >= 18 || hr < 6;
}

/**
 * the time format is a datetime string represents in taiwan local time
 * , this function helps converting them to date.
 * @param api_time_obj: string.
 * @return Date
 */
function getDateInWeatherAPI(api_time_obj: string): Date {
  return new Date(api_time_obj + ' +08:00'); // timezone Asia/Taipei
}

/**
 * the time format is different between whole-day/ not-whole-day events
 * , this function helps converting them to date.
 * @param api_time_obj: an object contains strings represents time
 * ,see APITime.
 * @return Date
 */
 function getDateInCalenderAPI(api_time_obj: APITime): Date{
  const time_str: string = 
    api_time_obj.date ||
    api_time_obj.dateTime
  ;
  return new Date(time_str);
}

/**
 * @param date_obj Date to get the index
 * @param current_week_date_list Array<Date>, as a reference to get index.
 * @returns a int as index, represent date_obj is on nth day later from now.
 * range n is from 0 ~ 6 (relative position in the week). 
 */
function getWeekListIdx(date_obj: Date, current_week_date_list: Array<Date>): number{
  let day_diff = date_obj.getDate() - current_week_date_list[0].getDate();
  if (day_diff < 0){
    day_diff += 7; 
  }
  else if (day_diff > 6){
    day_diff = 6;
  }
  return day_diff;
}

function getCurrentWeekDateList(): Array<Date>{
  let time_stamp = Date.now();
  const res: Array<Date> = [new Date(time_stamp)];
  for (let day = 1; day < 7; day ++){
    time_stamp += DAY_SEC;
    res.push(new Date(time_stamp));
  }
  return res;
}

/**
 * helps turn cur_week into display format for rendering.
 * @param cur_week Array<Date> of currrent week.
 * @returns Array<string> of current week.
 */
export function toDisplayDateList(cur_week: Array<Date>){
  return cur_week.map(daytime => SimpFormat.format(daytime));
}

const DetailFormat = new Intl.DateTimeFormat([], {
  day: "2-digit",
  month: "2-digit",
  minute: "2-digit",
  hour: "2-digit",
  hourCycle: 'h24',
  weekday: "narrow"
});

const SimpFormat = new Intl.DateTimeFormat([], {
  day: "2-digit",
  month: "2-digit",
  weekday: "narrow"
});

const TimeFormat = new Intl.DateTimeFormat([], {
  minute: "2-digit",
  hour: "2-digit",
  hourCycle: 'h24'
});


function getDuration(start_date: Date, end_date: Date): string {
  const start = DetailFormat.format(start_date);
  const end = (start_date.getDate() === end_date.getDate() &&
    end_date.valueOf() - start_date.valueOf() < DAY_SEC) ?
    TimeFormat.format(end_date):
    DetailFormat.format(end_date);

  return `${start} ~ ${end}`;
}

function getExampleDuration(example_duration: string, date_to_fit: Date): string{
  return example_duration.replaceAll('t', SimpFormat.format(date_to_fit));
}

export {getCurrentWeekDateList, getWeekListIdx, checkIsNight, getDateInWeatherAPI
  ,getDuration, getExampleDuration, getDateInCalenderAPI
}

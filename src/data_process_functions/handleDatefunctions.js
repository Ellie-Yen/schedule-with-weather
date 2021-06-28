/*------ get time infos of the current week ------*/
const day_msecs = 86400000;
const now_date = new Date(Date.now());
const week_time_list = [
  {
    display_time: getFormatDateString(now_date, true, true, false),
    date_obj: now_date,
    month: now_date.getMonth(),
    date: now_date.getDate(),
    day: now_date.getDay()
  }
];
for (let i = 1; i < 7; i++){
  const t = new Date(week_time_list[i - 1].date_obj.valueOf() + day_msecs);
  week_time_list.push({
    display_time: getFormatDateString(t, true, true, false),
    date_obj: t,
    month: t.getMonth(),
    date: t.getDate(),
    day: t.getDay()
  });
}

function getWeekListIdxByDate(date_obj){
  // date_obj: date object
  // return: int 0-6 represent where's the date obj in week_time_list
  // -1 if not found
  const [month, date] = [date_obj.getMonth(), date_obj.getDate()];
  for(let idx = 0; idx < 7; idx++) {
    const wt = week_time_list[idx];
    if (wt.date === date && wt.month === month){
      return date_obj - wt.date_obj < day_msecs ? idx : -1;
    }
  }
  return -1;
}

function getFormatDateString(date_obj, show_date, show_day, show_time){
  // show_date/day/time: bool indicate if needs date/day/time

  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let res = "";
  if (show_date){
    // month is from 0 - 11 
    const m = date_obj.getMonth() + 1;
    const d = date_obj.getDate();
    res += `${m < 10 ? '0' + m: m}.${d < 10 ? '0' + d: d} `;
  }
  if (show_day){
    res += `${weekday[date_obj.getDay()]} `;
  }
  if (show_time){
    const h = date_obj.getHours();
    const m = date_obj.getMinutes();
    res += `${h < 10 ? '0' + h: h} : ${m < 10 ? '0' + m: m} `;
  }
  return res;
}

export {day_msecs, week_time_list, getWeekListIdxByDate, getFormatDateString};
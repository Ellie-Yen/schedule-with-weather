function CalendarFetchErrorMsg(error){
  // error: received object from google api
  return {
    error_msg:
    `${error.result.error.code}: ${error.result.error.message}`
  };
}
function WeatherFetchErrorMsg(error){
  // error: received object from google api
  return {
    "3day": {error_msg: error},
    "week": {error_msg: error}
  };
}

export {CalendarFetchErrorMsg, WeatherFetchErrorMsg};
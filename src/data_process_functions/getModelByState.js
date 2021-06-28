function getModelByState(loading, is_success, data, executes){
  // loading: bool, indicating whether fetching data is success
  // is_success: bool, indicating whether parsing data is success
  // data: data object/array to use when aboves are both success
  // executes: {default, success, failed, loading}
  // default, failed, loading: function to execute to get data model
  let res;
  if (loading){
      if (is_success === undefined){
        /* use loading */
        res = executes.loading();
      }
      else if (is_success){
        /* use success */
        res = executes.success(data);
      }
      else {
        /* use something failed */
        res = executes.failed(`資料錯誤:${data ? data.error_msg: ""}`);
      }
    }
    else if (loading === undefined){
      /* use something failed */
      res = executes.failed(`連線失敗:${data ? data.error_msg: ""}`);
    }
    else {
      /* use default */
      res = executes.default();
    }
  return res;
}

export default getModelByState;
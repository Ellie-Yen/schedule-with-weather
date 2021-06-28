import React from 'react';
import {SideBarComponent, DropComponent} from '../app_components/DropComponent';
import {MyFormComponent, SelectQuestionComponent} from '../app_components/MyFormComponent';
import {IconTitleButtonComponent} from '../app_components/ButtonComponent';
import {LabelItem} from '../app_components/ListComponent';
import {default as WeatherAPI} from '../datastore/WeatherAPI.json';


function SettingSection(props){
  // props: setTown, setCity, setAPIKey, setCalendarID, setUseExample
  // set functions inherit from app
  // use_example_data: bool for disable other settings
  return (
    <SideBarComponent
      cls_name="setting"
      title={<i className="bi bi-gear"/>}
      content={
        <>
          <ChooseLocationSection
            setCity={props.setCity}
            setTown={props.setTown}
          />
          <EditCalendarArgSection
            setAPIKey={props.setAPIKey}
            setCalendarID={props.setCalendarID}
            setUseExample={props.setUseExample}
            use_example_data={props.use_example_data}
          />
          <IconTitleButtonComponent
            cls_name="refresh"
            icon_cls_name="bi bi-arrow-repeat"
            content="重新整理氣象與日曆資料"
            func={props.RefreshAll}
          />
        </>
      }
    />
  );
}

function ChooseLocationSection(props){
  // props: setCity, setTown
  // setCity, setTown: functions that inherit from app
  
  // inner control state
  const [city, setCity] = React.useState("選擇城市");
  const [town, setTown] = React.useState("選擇鄉鎮");
  
  const handleSetCity = (name) => {
    // remove town if reselect city
    props.setTown("");
    props.setCity(name);
    setTown("選擇鄉鎮");
    setCity(name);
  }
  const handleSetTown = (name) => {
    props.setTown(name);
    setTown(name);
  }
  // update only if city is changed
  // instead to produce town list by city,
  // and show the current location
  // it must be decided without submit button
  const CityList = React.useMemo(() => (
    <SelectQuestionComponent
      val={city}
      option_list={WeatherAPI.cities}
      setVal={handleSetCity}
    />
  // eslint-disable-next-line
  ), [city]);
  
  // update if location is changed
  const TownList = React.useMemo(() => (
    <SelectQuestionComponent
      val={town}
      option_list={
        city === "選擇城市" ? [] :
        WeatherAPI.city_data[city].town_list
      }
      setVal={handleSetTown}
    />
  // eslint-disable-next-line
  ), [city, town]);
  const content = (
    <>
      {CityList}
      {TownList}
    </>
  );
  const title = (
    <LabelItem
      title={<i className="bi bi-geo-alt"/>}
      content="設定天氣地點"
    />
  );
  return (
    <DropComponent
      cls_name="location_setting"
      title={title}
      content={content}
    />
  );
}

function EditCalendarArgSection(props){
   // props: setStart, setAPIKey, setCalendarID, setUseExample
   const content = (
     <MyFormComponent
      question_list={[
        {
          question: "Google API key",
          type: "input",
          default_val: "",
          icon_cls_name: "bi bi-key-fill",
          setFunc: props.setAPIKey
        },
        {
          question: "Google 日曆ID",
          type: "input",
          default_val: "",
          icon_cls_name: "bi bi-calendar-plus",
          setFunc: props.setCalendarID
        },
        {
          question: "使用展示資料(不使用API key)",
          type: "toggle",
          default_val: true,
          setFunc: props.setUseExample
        }
      ]}
     />
   );
   const title = (
    <LabelItem
      title={<i className="bi bi-calendar4"/>}
      content="設定Google日曆連線"
    />
  );
   return (
    <DropComponent
      cls_name="calendar_setting"
      title={title}
      content={content}
    />
   );
}

export default SettingSection;
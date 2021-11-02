interface FailedWeatherAPI {
  message: string
}

interface SuccessWeatherAPI {
  success: boolean,
  result: {
    resource_id: string,
    fields: [
      {
        id: contentDescription,
        type: String
      },
      {
        id: datasetDescription,
        type: String
      },
      {
        id: locationsName,
        type: String
      },
      {
        id: dataid,
        type: String
      },
      {
        id:locationName,
        type:String
      },
      {
        id: geocode,
        type: Double
      },
      {
        id:lat,
        type:Double
      },
      {
        id:lon,
        type:Double
      },
      {
        id:elementName,
        type:String
      },
      {
        id:description,
        type:String
      },
      {
        id:startTime,
        type:Timestamp
      },
      {
        id:endTime,
        type:Timestamp
      },
      {
        id:dataTime,
        type:Timestamp
      },
      {
        id:value,
        type:String
      },
      {
        id:measures,
        type:String
      }
    ]
  }
  records: {
    locations:[
      {
        datasetDescription: datasetDescription,
        locationsName: locationsName,
        dataid: dataid,
        location:[
          {
            locationName: locationName,
            geocode: geocode,
            lat: lat,
            lon: lon,
            weatherElement: Array<WeatherElement>
          }
        ]
      }
    ]
  }
}

/**
 * weather elements in week and 3 day are different,
 * which is decided in weather_city_map.json
 */
interface SuccessWeatherAPI_3day extends SuccessWeatherAPI {
  records:{
    locations:[
      {
        datasetDescription: "臺灣各縣市鄉鎮未來3天(72小時)逐3小時天氣預報",
        locationsName: locationsName,
        dataid: dataid,
        location:[
          {
            locationName: locationName,
            geocode: geocode,
            lat: lat,
            lon: lon,
            weatherElement:[
              Wx,
              RH,
              CI,
              PoP6h
            ]
          }
        ]
      }
    ]
  }
}

interface SuccessWeatherAPI_week extends SuccessWeatherAPI {
  records:{
    locations:[
      {
        datasetDescription: "臺灣各縣市鄉鎮未來1週逐12小時天氣預報",
        locationsName: locationsName,
        dataid: dataid,
        location:[
          {
            locationName: locationName,
            geocode: geocode,
            lat: lat,
            lon: lon,
            weatherElement:[
              Wx,
              PoP12h,
              MinT,
              MaxT
            ]
          }
        ]
      }
    ]
  }
}

interface WeatherElement {
  elementName: string,
  description: string,
  time: Array<WeatherElementAtTime>
}

interface WeatherElementAtTime {
  startTime: string,
  endTime: string,
  elementValue: Array<{
    value: string,
    measures: string
  }>
}


// 天氣現象 weather
interface Wx extends WeatherElement {
  elementName: "Wx",
  time: Array<WxAtTime>
}

type Weather = string;
type WeatherCode = string; // code for weather

interface WxAtTime extends WeatherElementAtTime {
  elementValue:[
    {
      value: Weather,
      measures: string
    },
    {
      value: WeatherCode, 
      measures: string
    }
  ]
}

// 舒適度 comfort index *including temperature
interface CI extends WeatherElement {
  elementName: "CI",
  time: Array<CIAtTime>
}

type Temperature = string;
type Feeling = string;

interface CIAtTime extends WeatherElementAtTime {
  elementValue:[
    {
      value: Temperature,
      measures: string
    },
    {
      value: Feeling,
      measures: string
    }
  ]
}

// 12 小時降雨機率 probability of precipitation(%) per 12 hr
interface PoP12h extends WeatherElement {
  elementName: "PoP12h",
  time: Array<PoPAtTime>
}

type PercentageNum = string;
interface PoPAtTime extends WeatherElementAtTime {
  elementValue:[
    {
      value: PercentageNum
      measures: string
    }
  ]
}

// per 6 hr
interface PoP6h extends PoP12h {
  elementName: "PoP6h",
}

// min temperature °C
interface MinT extends WeatherElement {
  elementName: "MinT",
  time: Array<TAtTime>
}

interface TAtTime extends WeatherElementAtTime {
  elementValue:[
    {
      value: Temperature, 
      measures: string
    }
  ]
}

interface MaxT extends MinT {
  elementName: "MaxT",
}

interface RH extends WeatherElement {
  elementName: "RH",
  time: Array<RHAtTime>
}

interface RHAtTime extends WeatherElementAtTime {
  elementValue:[
    {
      value: PercentageNum,
      measures: string
    }
  ]
}
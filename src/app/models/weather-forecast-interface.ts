export interface WeatherForecastInterface {
  cityCountry: string,
  cityName: string,
  cityCoordLat: number,
  cityCoordLon: number,
  weatherForecasts: SingleWeatherForecastInterface[]
}

export interface SingleWeatherForecastInterface {
    dt_txt: string,
    sysPod: string,
    main: string,
    description: string,
    icon: string,
    windSpeed: number,
    windDeg: number,
    windGust: number,
    temp: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    sea_level: number,
    humidity: number
}
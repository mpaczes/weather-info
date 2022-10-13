export interface CurrentWeatherInterface {
    weatherMain: string;
    weatherDescription: string;
    weatherIcon: string;
    mainTemp: number;
    mainFeelsLike: number;
    mainTempMin: number;
    mainTempMax: number;
    mainPressure: number;
    mainHumidity: number;
    windSpeed: number;
    windDeg: number;
    windGust: number;
    dt: number;
}
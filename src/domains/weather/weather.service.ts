import {
    T_WeatherGeo,
    T_WeatherDto
} from "@app/src/domains/weather/weather.type"
import axios, { AxiosPromise } from "axios"

export const WeatherSvc = {
    getWeather: (args: { q: string }): AxiosPromise<T_WeatherDto> =>
        axios({
            url: `https://api.openweathermap.org/data/2.5/weather?q=${args.q}&APPID=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API}`
        }),
    getGeo: (args: {
        lat: number
        lon: number
    }): AxiosPromise<T_WeatherGeo[]> =>
        axios({
            url: `http://api.openweathermap.org/geo/1.0/reverse?lat=${args.lat}&lon=${args.lon}&limit=1&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API}`
        })
}

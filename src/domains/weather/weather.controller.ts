import {
    T_WeatherDto,
    T_WeatherDisplayableData
} from "@app/src/domains/weather/weather.type"
import { getTitleCaseText, kelvinToCelsius } from "@app/src/utils/helpers"
import { format } from "date-fns"

export const createDisplayableWeatherData = (
    item: T_WeatherDto
): T_WeatherDisplayableData => {
    const humidity = item.main.humidity
    const tempMin = kelvinToCelsius(item.main.temp_min).toFixed(2)
    const tempMax = kelvinToCelsius(item.main.temp_max).toFixed(2)
    const description = item.weather[0].description

    const _time: number = item.dt * 1000
    const time = format(new Date(_time), "yyyy-LL-dd hh:mm a")

    const city = getTitleCaseText(item.name)
    const country = item.sys.country.toLocaleUpperCase()
    const cityWithCountry = `${city}, ${country}`

    let weather = item.weather[0].main
    weather = getTitleCaseText(weather)
    return {
        description,
        humidityWithPercent: `${humidity}%`,
        location: cityWithCountry,
        temperatureInRange:
            tempMin === tempMax
                ? `${tempMax}°C`
                : `${tempMin}°C ~ ${tempMax}°C`,
        time,
        weather
    }
}

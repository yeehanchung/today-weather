import {
    T_WeatherDto,
    T_WeatherGeo
} from "@app/src/domains/weather/weather.type"

export const WeatherSvc = {
    getWeather: (args: { q: string }): Promise<T_WeatherDto> => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${args.q}&APPID=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API}`
        return ajaxXHR(url)
    },
    getGeo: (args: { lat: number; lon: number }): Promise<T_WeatherGeo[]> => {
        const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${args.lat}&lon=${args.lon}&limit=1&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API}`
        return ajaxXHR(url)
    }
}

function ajaxXHR<T>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("GET", url, true)

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response: T = JSON.parse(xhr.responseText)
                        resolve(response)
                    } catch (e) {
                        reject(`Error parsing response: ${e.message}`)
                    }
                } else {
                    reject(`Error: ${xhr.statusText}`)
                }
            }
        }

        xhr.onerror = function () {
            reject("Network Error")
        }

        xhr.send()
    })
}

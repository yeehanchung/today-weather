export interface T_WeatherDto {
    coord: Coord
    weather: Weather[]
    base: string
    main: Main
    visibility: number
    wind: Wind
    clouds: Clouds
    dt: number
    sys: Sys
    timezone: number
    id: number
    name: string
    cod: number
}

interface Clouds {
    all: number
}

interface Coord {
    lon: number
    lat: number
}

interface Main {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level: number
    grnd_level: number
}

interface Sys {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
}

interface Weather {
    id: number
    main: string
    description: string
    icon: string
}

interface Wind {
    speed: number
    deg: number
}

export type T_WeatherDisplayableData = {
    temperatureInRange: string
    description: string
    humidityWithPercent: string
    time: string
    location: string
    weather: string
}

export type T_WeatherDatabaseRecords = Array<{
    time: Date
    id: string
    searchBy: "city" | "country"
    data: { weather: T_WeatherDto } & { geo: T_WeatherGeo | null }
}>

export type T_WeatherXhrTransformed =
    | {
          fetchState: "post"
          data: T_WeatherDisplayableData
      }
    | {
          fetchState: "pre"
          data: null
      }

export type T_WeatherGeo = {
    name: string
    local_names: LocalNames
    lat: number
    lon: number
    country: string
    state: string
}

interface LocalNames {
    ms: string
    zh: string
    en: string
    ja: string
    ru: string
}

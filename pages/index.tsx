import { SearchDetails } from "@app/src/components/search/search-details"
import { SearchHistory } from "@app/src/components/search/search-history"
import { SearchToolbar } from "@app/src/components/search/search-toolbar"
import { Header } from "@app/src/designs/header"
import { createDisplayableWeatherData } from "@app/src/domains/weather/weather.controller"
import { WeatherSvc } from "@app/src/domains/weather/weather.service"
import {
    T_WeatherDatabaseRecords,
    T_WeatherDto,
    T_WeatherGeo,
    T_WeatherXhrTransformed
} from "@app/src/domains/weather/weather.type"
import { generateUniqueId, sleep } from "@app/src/utils/helpers"
import { useLocalStorageForUrlQueries } from "@app/src/utils/local-storage"
import { useRouter } from "next/router"
import { HtmlHTMLAttributes, PropsWithChildren, useRef, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

export const FORM_ERROR: {
    all_empty_query: "all: empty-query"
    city_not_found: "city: not-found"
    country_not_found: "country: not-found"
    city_invalid_city: "city: invalid-city"
} = {
    all_empty_query: "all: empty-query",
    city_not_found: "city: not-found",
    country_not_found: "country: not-found",
    city_invalid_city: "city: invalid-city"
}

export default function YourComponentName(): JSX.Element {
    const router = useRouter()
    const previousValue = useRef<string>("")
    const formMethods = useForm<{
        city: string
        country: string
    }>({
        defaultValues: {
            city: router.query.city as string,
            country: router.query.country as string
        }
    })

    const [weatherData, setWeatherData] = useState<T_WeatherXhrTransformed>({
        fetchState: "pre",
        data: null
    })

    const { localStorageItem, setLocalStorageItem: setSessionStorageItem } =
        useLocalStorageForUrlQueries<{
            record: T_WeatherDatabaseRecords
        }>({
            localStorageId: "weather-data",
            keyValues: {
                record: []
            },
            onLoad(data) {
                console.log("onload", data)
            }
        })

    function handleLocalStorage(
        args:
            | {
                  isSuccess: true
                  data: { weather: T_WeatherDto; geo: T_WeatherGeo | null }
              }
            | { isSuccess: false; data: null }
    ) {
        if (!args.isSuccess) return

        try {
            const clonedData: T_WeatherDatabaseRecords = JSON.parse(
                JSON.stringify(localStorageItem.data.record)
            )

            clonedData.push({
                data: {
                    weather: args.data.weather,
                    geo: args.data.geo
                },
                id: generateUniqueId(),
                time: new Date()
            })

            setSessionStorageItem({
                record: clonedData
            })
        } catch (error) {
            console.error("Error: storing data into database")
        }
    }

    const onSearchCityOrCountry = formMethods.handleSubmit(async (formData) => {
        try {
            let query

            if (formData.city && !formData.country) {
                query = formData.city
            } else if (formData.city && formData.country) {
                query = `${formData.country},${formData.city}`
            } else if (!formData.city && formData.country) {
                query = formData.country
            }

            if (!query) {
                throw new Error(FORM_ERROR["all_empty_query"])
            }

            previousValue.current = query

            const [xhrWeather, _] = await Promise.all([
                WeatherSvc.getWeather({
                    q: query
                }),
                sleep(500)
            ])

            const geo = await WeatherSvc.getGeo({
                lat: xhrWeather.data.coord.lat,
                lon: xhrWeather.data.coord.lon
            })

            const geoData = Array.isArray(geo.data) ? geo.data[0] : null

            // Handle when city entered is not a city
            if (
                formData.city &&
                geoData?.name.toLocaleLowerCase() !==
                    formData.city.toLocaleLowerCase()
            ) {
                throw new Error(FORM_ERROR["city_invalid_city"])
            }

            handleLocalStorage({
                isSuccess: true,
                data: {
                    weather: xhrWeather.data,
                    geo: geoData
                }
            })
            setWeatherData({
                fetchState: "post",
                data: createDisplayableWeatherData(xhrWeather.data)
            })
        } catch (error) {
            const errorMessage = (error as Error).message

            if (errorMessage === FORM_ERROR["all_empty_query"]) {
                return
            }

            // Handle when city entered is not a city
            if (errorMessage === FORM_ERROR["city_invalid_city"]) {
                formMethods.setError("city", {
                    type: "validate",
                    message: FORM_ERROR["city_invalid_city"]
                })
                setTimeout(() => {
                    formMethods.setFocus("city")
                }, 20)
                return
            }

            if (formData.city && !formData.country) {
                formMethods.setError("city", {
                    type: "validate",
                    message: FORM_ERROR["city_not_found"]
                })
                setTimeout(() => {
                    formMethods.setFocus("city")
                }, 20)
            } else if (!formData.city && formData.country) {
                formMethods.setError("country", {
                    type: "validate",
                    message: FORM_ERROR["country_not_found"]
                })
                setTimeout(() => {
                    formMethods.setFocus("country")
                }, 20)
            }

            handleLocalStorage({
                isSuccess: false,
                data: null
            })
        }
    })

    return (
        <>
            <style jsx>{``}</style>

            <MaxWidhtcontainer>
                <div className="w-full px-4 sm:px-4">
                    <Header>{`Today's Weather`}</Header>
                </div>

                <FormProvider {...formMethods}>
                    <div style={{ minHeight: "20rem" }}>
                        <SearchToolbar onSubmit={onSearchCityOrCountry} />
                        <SearchDetails weatherData={weatherData} />
                    </div>

                    {localStorageItem.renderingState === "POST" && (
                        <div className="w-full px-4 sm:px-4 pt-10">
                            <SearchHistory
                                historySources={localStorageItem.data.record}
                                onClickHistory={(history) => {
                                    setWeatherData({
                                        fetchState: "post",
                                        data: createDisplayableWeatherData(
                                            history.data.weather
                                        )
                                    })
                                    router.push({
                                        query: {
                                            city: history.data.weather.name,
                                            country:
                                                history.data.weather.sys.country
                                        }
                                    })
                                }}
                                onDelete={(id) => {
                                    const clonedData: T_WeatherDatabaseRecords =
                                        JSON.parse(
                                            JSON.stringify(
                                                localStorageItem.data.record
                                            )
                                        )

                                    setSessionStorageItem({
                                        record: clonedData.filter(
                                            (v) => v.id !== id
                                        )
                                    })
                                }}
                            />
                        </div>
                    )}
                </FormProvider>
            </MaxWidhtcontainer>
        </>
    )
}

export function Col(props: HtmlHTMLAttributes<HTMLDivElement>) {
    return (
        <>
            <style jsx>{``}</style>
            <div {...props} className={`relative ${props.className}`}>
                {props.children}
            </div>
        </>
    )
}

export function Row(props: HtmlHTMLAttributes<HTMLDivElement>) {
    return (
        <>
            <style jsx>{``}</style>
            <div
                {...props}
                className={`flex flex-row flex-wrap ${props.className}`}>
                {props.children}
            </div>
        </>
    )
}

export function MaxWidhtcontainer(props: PropsWithChildren<any>) {
    return (
        <>
            <style jsx>
                {`
                    div {
                        margin-right: auto;
                        margin-left: auto;
                    }
                `}
            </style>

            <div style={{ maxWidth: "1200px" }}>{props.children}</div>
        </>
    )
}

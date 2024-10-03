import { FORM_ERROR } from "@app/pages"
import { T_WeatherXhrTransformed } from "@app/src/domains/weather/weather.type"
import { useFormContext } from "react-hook-form"

type T_Props = {
    weatherData: T_WeatherXhrTransformed
}

export function SearchDetails(props: T_Props): JSX.Element {
    const { formState, watch } = useFormContext()
    return (
        <>
            <div className="pl-4 pt-8 sm:pl-10">
                {(() => {
                    if (
                        formState.errors["city"]?.message ===
                        FORM_ERROR["city_invalid_city"]
                    ) {
                        return <div>{`${watch("city")} is not a city`}</div>
                    }

                    if (
                        formState.errors["city"]?.message ===
                            FORM_ERROR["city_not_found"] ||
                        formState.errors["country"]?.message ===
                            FORM_ERROR["country_not_found"]
                    ) {
                        return <div>Not found</div>
                    }

                    if (formState.isSubmitting) {
                        return <div>Loading...</div>
                    }

                    if (
                        props.weatherData.data &&
                        props.weatherData.fetchState === "post"
                    ) {
                        return (
                            <>
                                <div className="text-gray-500">
                                    {props.weatherData.data.location}
                                </div>
                                <div className="text-4xl font-bold pt-2">
                                    {props.weatherData.data.weather}
                                </div>

                                <div className="relative overflow-x-auto pt-3">
                                    <table>
                                        <tbody>
                                            {[
                                                {
                                                    title: "description",
                                                    value: props.weatherData
                                                        .data.description
                                                },
                                                {
                                                    title: "temperature",
                                                    value: props.weatherData
                                                        .data.temperatureInRange
                                                },
                                                {
                                                    title: "humidity",
                                                    value: props.weatherData
                                                        .data
                                                        .humidityWithPercent
                                                },
                                                {
                                                    title: "time",
                                                    value: props.weatherData
                                                        .data.time
                                                }
                                            ].map((item, idx) => {
                                                return (
                                                    <tr key={idx}>
                                                        <td className="px-2 py-1 text-neutral-500">
                                                            {item.title}
                                                        </td>
                                                        <td className="px-2 py-1">
                                                            {item.value}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )
                    }

                    return (
                        <div className="p-4 text-slate-500 text-sm">
                            Try to search by city or country...
                        </div>
                    )
                })()}
            </div>
        </>
    )
}

import { Col, Row } from "@app/pages"
import { Button } from "@app/src/designs/button"
import { Input } from "@app/src/designs/input"
import { KeyboardListener } from "@app/src/utils/keyboard"
import { useRouter } from "next/router"
import { FormEventHandler, useEffect } from "react"
import { useFormContext } from "react-hook-form"

type T_Props = {
    onSubmit: FormEventHandler<HTMLFormElement>
}

export function SearchToolbar(props: T_Props): JSX.Element {
    const router = useRouter()

    const {
        watch,
        register,
        reset,
        setFocus,
        setValue,
        formState: { isSubmitting }
    } = useFormContext()

    useEffect(function initKeyboardEvents() {
        const keyboardListener = new KeyboardListener()
        keyboardListener.on("/", (e) => {
            e.preventDefault()
            setFocus("city", { shouldSelect: true })
        })

        keyboardListener.on("\\", (e) => {
            e.preventDefault()
            setFocus("country", { shouldSelect: true })
        })

        return () => {
            keyboardListener.destroy()
        }
    }, [])

    useEffect(
        function initSearches() {
            const city = router.query.city as string
            const country = router.query.country as string
            if (city && !country) {
                setValue("city", city)
            }
            if (!city && country) {
                setValue("country", country)
                return
            }
            setValue("city", city)
        },
        [router.query.city, router.query.country]
    )

    return (
        <>
            <form onSubmit={props.onSubmit}>
                <div className="flex flex-col sm:flex-row mt-4">
                    <div className="flex sm:flex-row flex-col sm:gap-0 gap-4">
                        <Row className="flex-col gap-2 px-4 sm:pr-2 w-full">
                            <Col>
                                <label htmlFor="city">City:</label>
                            </Col>
                            <Col className="w-full">
                                <label className="flex items-center gap-2 disabled:bg-gray-200 md:min-w-[250px] relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <Input
                                        {...register("city", {
                                            onChange(e) {
                                                router.push(
                                                    {
                                                        query: {
                                                            city: e.target.value
                                                        }
                                                    },
                                                    undefined,
                                                    { shallow: true }
                                                )
                                            }
                                        })}
                                        disabled={
                                            isSubmitting ||
                                            watch("country")?.length
                                                ? true
                                                : false
                                        }
                                        type="text"
                                        id="city"
                                        placeholder="Search city..."
                                        required={
                                            watch("country")?.length
                                                ? false
                                                : true
                                        }
                                    />
                                    <kbd className="p-1.5 mr-2 rounded-md bg-slate-200">
                                        /
                                    </kbd>
                                </label>
                            </Col>
                        </Row>
                        <Row className="flex-col gap-2 px-4 sm:pl-2 w-full">
                            <Col>
                                <label htmlFor="country">Country:</label>
                            </Col>
                            <Col>
                                <label className="flex items-center gap-2 disabled:bg-gray-200 md:min-w-[250px] relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <Input
                                        {...register("country", {
                                            onChange(e) {
                                                router.push(
                                                    {
                                                        query: {
                                                            country:
                                                                e.target.value
                                                        }
                                                    },
                                                    undefined,
                                                    { shallow: true }
                                                )
                                            }
                                        })}
                                        placeholder="Search country..."
                                        required={
                                            watch("city")?.length ? false : true
                                        }
                                        disabled={
                                            isSubmitting ||
                                            watch("city")?.length
                                                ? true
                                                : false
                                        }
                                        type="text"
                                        id="country"
                                    />
                                    <kbd className="p-1.5 mr-2 rounded-md bg-slate-200">
                                        {"\\"}
                                    </kbd>
                                </label>
                            </Col>
                        </Row>

                        <div className="w-full content-end sm:w-auto h-full px-4 sm:pl-2 sm:pr-1.5 -mb-1 sm:mb-auto">
                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full sm:w-auto">
                                <span className="">Search</span>
                            </Button>
                        </div>
                        <div className="w-full content-end sm:w-auto h-full px-4 sm:pr-2 sm:pl-1.5 -mt-1 sm:mt-auto">
                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full sm:w-auto"
                                onClick={() => {
                                    router.push({
                                        query: {}
                                    })
                                    reset()
                                }}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

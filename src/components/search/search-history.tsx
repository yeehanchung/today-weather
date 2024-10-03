import { Col, Row } from "@app/pages"
import { Button } from "@app/src/designs/button"
import { Header } from "@app/src/designs/header"
import { T_WeatherDatabaseRecords } from "@app/src/domains/weather/weather.type"
import { getTitleCaseText } from "@app/src/utils/helpers"
import { format } from "date-fns"

type T_Props = {
    historySources: T_WeatherDatabaseRecords
    onDelete: (id: string) => void
    onClickHistory: (history: T_WeatherDatabaseRecords[number]) => void
}

export function SearchHistory(props: T_Props): JSX.Element {
    return (
        <>
            <style jsx>{`
                .row--search-history::after {
                    position: relative;
                    position: absolute;
                    background-color: rgb(214, 214, 214);
                    content: "";
                    width: 100%;
                    height: 1px;
                }
            `}</style>

            <div>
                <Header>{`Search History (${props.historySources.length})`}</Header>

                <div className="sm:overflow-y-auto h-auto sm:h-96 relative">
                    {!props.historySources.length && (
                        <div className="py-3">No history yet</div>
                    )}
                    {props.historySources
                        .sort((a, b) => {
                            if (
                                new Date(a.time).toISOString() <
                                new Date(b.time).toISOString()
                            )
                                return 1
                            if (
                                new Date(a.time).toISOString() >
                                new Date(b.time).toISOString()
                            )
                                return -1
                            return 0
                        })
                        .map((source, idx) => {
                            const cityWithCountry = `${getTitleCaseText(
                                source.data.weather.name
                            )}, ${source.data.weather.sys.country.toLocaleUpperCase()}`

                            return (
                                <div
                                    key={idx}
                                    className="row--search-history hover:bg-gray-100 cursor-pointer relative"
                                    onClick={() => {
                                        props.onClickHistory(source)
                                    }}>
                                    <Row className="pt-3 pb-2 px-4 sm:px-4 flex flex-auto align-middle items-center md:flex-nowrap gap-2">
                                        <Col className=" w-full">
                                            <Row className="flex-nowrap">
                                                <Col className="pr-2">{`${idx + 1}`}</Col>
                                                <Col>{cityWithCountry}</Col>
                                            </Row>
                                        </Col>

                                        <Col>
                                            <Row className="justify-end">
                                                {/* time */}
                                                <Col className="sm:px-4">
                                                    <span className="inline-block w-max">
                                                        {format(
                                                            new Date(
                                                                source.time
                                                            ),
                                                            "hh:mm:ss a"
                                                        )}
                                                    </span>
                                                </Col>
                                            </Row>
                                        </Col>

                                        <Col className="ml-auto md:ml-0">
                                            <Row className="flex-nowrap">
                                                {/* search */}
                                                <Col className="px-1">
                                                    <Button className="rounded-full">
                                                        <svg
                                                            className="w-4 h-4"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 20 20">
                                                            <path
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                                            />
                                                        </svg>
                                                        <span className="sr-only">
                                                            Search
                                                        </span>
                                                    </Button>
                                                </Col>
                                                {/* delete */}
                                                <Col className="px-1">
                                                    <Button
                                                        className="rounded-full"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            props.onDelete(
                                                                source.id
                                                            )
                                                        }}>
                                                        <svg
                                                            className="w-4 h-4"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            fill="none"
                                                            viewBox="0 0 24 24">
                                                            <path
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                                                            />
                                                        </svg>
                                                        <span className="sr-only">
                                                            Trash
                                                        </span>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        })}
                </div>
            </div>
        </>
    )
}

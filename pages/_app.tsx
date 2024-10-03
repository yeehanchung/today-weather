import { AppProps } from "next/dist/shared/lib/router/router"
import "../styles/global.css"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <style jsx>{``}</style>

            <div
                style={{ width: "100%" }}
                className="h-dvh sm:h-screen py-10 sm:py-4">
                <div className="h-4 sm:h-10" />

                <Component {...pageProps} />

                <div className="h-20 sm:h-30" />
            </div>
        </>
    )
}

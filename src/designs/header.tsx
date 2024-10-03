import { HtmlHTMLAttributes, PropsWithChildren } from "react"

export function Header(
    props: PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>
): JSX.Element {
    return (
        <>
            <div {...props}>
                <p className="text-gray-800 text-xl font-bold">
                    {props.children}
                </p>
                <div className="mt-1 w-full bg-slate-950 h-0.5"></div>
            </div>
        </>
    )
}

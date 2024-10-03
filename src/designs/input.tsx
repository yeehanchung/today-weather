import { forwardRef, InputHTMLAttributes } from "react"

export const Input = forwardRef<
    HTMLInputElement,
    InputHTMLAttributes<HTMLInputElement>
>(function Input(props, ref) {
    return (
        <>
            <input
                {...props}
                ref={ref}
                className={`disabled:bg-gray-200 w-full relative p-2.5 bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${props.className}`}
            />
        </>
    )
})

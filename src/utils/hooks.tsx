import { useEffect, useState } from "react"

function useDebounce<T extends string>(value: T, ms: number) {
    const [debouncedValue, setDebouncedValue] = useState<T | null>(null)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value)
        }, ms)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [value, ms])

    return { debouncedValue }
}

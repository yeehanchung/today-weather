export const generateUniqueId = () =>
    `id-${Math.random().toString(36).substring(2, 30)}`

export const kelvinToCelsius = (kelvin: number) => {
    return kelvin - 273.15
}

export function capitalize(str: string) {
    if (!str || typeof str !== "string") return str
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getTitleCaseText(arg: string): string {
    const text = arg.trim()
    if (!text.length) {
        return ""
    }

    const validTexts: string[] = []
    let isInvalid = false
    let tempText = ""

    const rawTexts = text.split(" ")
    for (let idx = 0; idx < rawTexts.length; idx++) {
        tempText = rawTexts[idx]
        isInvalid = !tempText && tempText !== "0"

        if (isInvalid) continue

        validTexts.push(tempText)
    }

    if (validTexts.length === 1) {
        return text[0].toLocaleUpperCase() + text.slice(1)
    }

    return validTexts
        .map((v) => v[0].toLocaleUpperCase() + v.slice(1))
        .join(" ")
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
): T {
    let inThrottle: boolean
    return function (...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    } as T
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
) {
    let timeout: ReturnType<typeof setTimeout>

    return function (...args: Parameters<T>): void {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }

        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

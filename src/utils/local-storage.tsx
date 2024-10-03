import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export const useLocalStorageForUrlQueries = <
    T extends {
        // eslint-disable-next-line @typescript-eslint/ban-types
        [K: string]: Object | null
    }
>(props: {
    localStorageId: string
    keyValues: T
    onLoad?: (keyValues: T) => void
}): {
    localStorageItem:
        | {
              renderingState: "PRE"
              data: Partial<T>
          }
        | {
              renderingState: "POST"
              data: T
          }
    setLocalStorageItem: (keyValues: Partial<T>) => void
} => {
    const router = useRouter()

    const [localStorageItem, setLocalStorageItem] = useState<
        | {
              renderingState: "PRE"
              data: Partial<T>
          }
        | {
              renderingState: "POST"
              data: T
          }
    >({
        renderingState: "PRE",
        data: props.keyValues
    })

    const methods = {
        setLocalStorageItem,
        setLocalStorageItemEnhanced: (args: Partial<T>) => {
            const copied =
                (JSON.parse(JSON.stringify(localStorageItem.data)) as T) || {}

            methods.setLocalStorageItem((prev) => {
                const prevData = prev.data

                for (const K in props.keyValues) {
                    if (!(K in props.keyValues && args != null)) {
                        copied[K] = (args as T)[K]
                        continue
                    }

                    if (K in args) {
                        copied[K] = (args as T)[K]
                    }
                    if (!args[K]) {
                        copied[K] = (prevData as T)[K]
                    }
                }

                localStorage.setItem(
                    `${props.localStorageId}`,
                    JSON.stringify(copied)
                )

                return {
                    ...prev,
                    data: copied
                }
            })
        },
        handleOnDataLoad: (values: T) => {
            if (props.onLoad) {
                props.onLoad(values)
            }
        }
    }

    useEffect(function reHydrateOn() {
        const data = JSON.parse(JSON.stringify(localStorageItem.data)) as T
        methods.setLocalStorageItem({
            data: data,
            renderingState: "POST"
        })
    }, [])

    useEffect(
        function initStorage() {
            const storageItem = localStorage.getItem(
                `${props.localStorageId}`
            ) as string | null

            if (storageItem) {
                const keyValues = JSON.parse(storageItem) as T
                methods.handleOnDataLoad(keyValues)
                methods.setLocalStorageItem({
                    data: JSON.parse(storageItem) as T,
                    renderingState: "POST"
                })
                return
            }

            const keyValues = props.keyValues
            methods.handleOnDataLoad(keyValues)
            methods.setLocalStorageItem({
                data: keyValues,
                renderingState: "POST"
            })
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.localStorageId, router.query.tabOption]
    )

    return {
        localStorageItem: localStorageItem,
        setLocalStorageItem: methods.setLocalStorageItemEnhanced
    }
}

type KeyHandler = (event: KeyboardEvent) => void

export class KeyboardListener {
    private handlers: Map<string, KeyHandler[]> = new Map()

    constructor() {
        document.addEventListener("keydown", this.handleKeyPress.bind(this))
    }

    private handleKeyPress(event: KeyboardEvent): void {
        const handlers = this.handlers.get(event.key)
        if (handlers) {
            handlers.forEach((handler) => handler(event))
        }
    }

    public on(key: string, handler: KeyHandler): void {
        if (!this.handlers.has(key)) {
            this.handlers.set(key, [])
        }
        this.handlers.get(key)!.push(handler)
    }

    public off(key: string, handler: KeyHandler): void {
        const handlers = this.handlers.get(key)
        if (handlers) {
            const index = handlers.indexOf(handler)
            if (index !== -1) {
                handlers.splice(index, 1)
            }
            if (handlers.length === 0) {
                this.handlers.delete(key)
            }
        }
    }

    public destroy(): void {
        document.removeEventListener("keydown", this.handleKeyPress)
        this.handlers.clear()
    }
}

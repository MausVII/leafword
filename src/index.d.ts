export {}

declare global {
    interface Window {
        api: any,
        example: string,
        db_api: any
    }
}

// declare const api: import('./preload');
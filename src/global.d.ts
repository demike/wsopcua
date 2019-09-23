export {}
declare global {
    interface Window {
        setImmediate(callback: (...args: any[]) => void, ...args: any[]): any;
    }
}
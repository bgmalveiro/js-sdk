export interface Handler {
    execute: (payload: any) => Promise<any>
}

export interface AddHost extends PackageHost {}

export interface PackageHost {
    id: string
    protocol: string
    host: string
    port: number
    api: {
        upload: string
        package: string
    }
}
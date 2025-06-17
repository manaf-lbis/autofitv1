/// <reference types="vite/client" />

interface ImportMetaEnv{
    readonly VITE_API_URL : string
    readonly GOOGLE_CLIENT_ID :string
    readonly GOOGLE_MAPS_API_KEY : string
    readonly GEOCODING_API_KEY : string
    readonly VITE_MAP_ID : string
    readonly VITE_RAZORPAY_KEY_ID:string

}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
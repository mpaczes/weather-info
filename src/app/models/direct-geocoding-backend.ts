export interface DirectGeocodingBackend {
    name: string,
    lat: number,
    lon: number,
    country: string,
    state: string,
    local_name: LocalNames
}

export interface LocalNames {
    eo: string,
    sk: string,
    uk: string,
    lt: string,
    ja: string,
    pl: string,
    he: string,
    la: string,
    be: string,
    ru: string,
    mk: string,
    de: string
}

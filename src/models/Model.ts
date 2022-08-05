

export interface Item {
    bike_id: string | null | any;
    lat: number | null;
    lon: number | null;
    is_reserved: boolean | null;
    is_disabled: boolean | null;
    vehicle_type: string | null;
    total_bookings: number | null;
    android: string | null;
    ios: string | null;
}

export interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface Bikes {
    items: Item[];
    pageInfo: PageInfo;
    totalCount: number;
}

export interface BikesData {
    bikes: Bikes;
}

export interface Kovanmodel {
    last_updated: number | null;
    ttl: number | null;
    data: BikesData;
    total_count: number;
}

export interface KovanModelData {
    kovanmodel: Kovanmodel;
}

export interface KovanModelRootObject {
    data: KovanModelData;
}




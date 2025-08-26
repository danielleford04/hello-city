export interface Tour {
    id: string;
    name: string;
    description: string;
    stops: Stop[],
}

export interface Stop {
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    visited?: boolean;
    img?: string;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

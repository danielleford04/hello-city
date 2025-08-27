export interface Walk {
    id: string;
    name: string;
    description: string;
    waypoints: Waypoint[],
}

export interface Waypoint {
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

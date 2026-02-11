
export interface BaseSpecs {
    weight: number; // kg
    dims: [number, number, number]; // [L, W, H] in meters
}

export interface ChassisSpecs extends BaseSpecs {
    max_payload: number; // kg
    max_speed: number;   // m/s
    climb_angle: number; // degrees
}

export interface BatterySpecs extends BaseSpecs {
    capacity: number; // Wh
    voltage: number;  // V
    max_output: number; // W
}

export interface SensorSpecs extends BaseSpecs {
    power: number; // W
    range?: number; // m
    fov_h?: number; // degrees
    fov_v?: number; // degrees
}

// Union of all possible spec types
export type ComponentSpecs = ChassisSpecs | BatterySpecs | SensorSpecs | BaseSpecs;



export interface Socket {
    id: string;
    position: [number, number, number]; // [x, y, z] relative to model center
    rotation?: [number, number, number]; // [x, y, z] euler angles
    type: 'mount' | 'connector';
}

export interface BaseSpecs {
    weight: number; // kg
    dims: [number, number, number]; // [L, W, H] in meters
    sockets?: Socket[];
    modelFormat?: 'glb' | 'stl' | 'obj' | 'fbx';
}

export interface ChassisSpecs extends BaseSpecs {
    type: 'chassis';
    max_payload: number; // kg, Critical for Logic Engine
    max_speed: number;   // m/s
    climb_angle: number; // degrees
}

export interface BatterySpecs extends BaseSpecs {
    type: 'battery';
    capacity: number;   // Wh
    voltage: number;    // V
    max_output: number; // W, Critical for Logic Engine
}

export interface SensorSpecs extends BaseSpecs {
    type: 'sensor';
    power: number;      // W, Critical for Logic Engine
    range?: number;     // m
    fov_h?: number;     // degrees
    fov_v?: number;     // degrees
}

export interface ActuatorSpecs extends BaseSpecs {
    type: 'actuator';
    max_force?: number; // N
    max_speed?: number; // m/s or deg/s
    power: number;      // W
}

export interface ComputeSpecs extends BaseSpecs {
    type: 'compute';
    tops?: number;      // AI Performance
    power: number;      // W
}


export interface AccessorySpecs extends BaseSpecs {
    type: 'accessory';
}

// Union of all possible spec types
export type ComponentSpecs =
    | ChassisSpecs
    | BatterySpecs
    | SensorSpecs
    | ActuatorSpecs
    | ComputeSpecs
    | AccessorySpecs;

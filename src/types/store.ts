export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface Euler {
    x: number;
    y: number;
    z: number;
}

// Generic specs for now, to be refined per component type
export interface Specs {
    [key: string]: any;
}

export interface Part {
    id: string;
    type: string; // 'chassis' | 'lidar' | ...
    position: Vector3;
    rotation: Euler;
    specs: Specs;
    parentId?: string; // For hierarchical attachment (future)
}

export interface DesignState {
    parts: Part[];
    selectedPartId: string | null;
    addPart: (part: Part) => void;
    updatePart: (id: string, updates: Partial<Part>) => void;
    removePart: (id: string) => void;
    selectPart: (id: string | null) => void;
}

import { ComponentSpecs } from "./specs";
import { LocalizedString } from "./i18n";

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

export interface Part {
    id: string; // Instance ID
    skuId: string; // Component SKU

    // Cached from Component (for display without refetching)
    name: LocalizedString;
    category: string;

    position: Vector3;
    rotation: Euler;

    specs: ComponentSpecs;

    // Model Reference
    modelRef?: string;

    price: number;

    parentId?: string; // For hierarchical attachment
    socketId?: string; // Which socket it is attached to
}

export interface DesignState {
    parts: Part[];
    selectedPartId: string | null;

    // Operational Design Domain (ODD)
    requirements: {
        slope: number; // degrees
        environment: "indoor" | "outdoor";
        ground: "smooth" | "rough";
    };

    addPart: (part: Part) => void;
    updatePart: (id: string, updates: Partial<Part>) => void;
    removePart: (id: string) => void;
    selectPart: (id: string | null) => void;
    reparentPart: (childId: string, newParentId: string | null) => void;

    transformMode: "translate" | "rotate" | "scale" | null;
    setTransformMode: (mode: "translate" | "rotate" | "scale" | null) => void;
}

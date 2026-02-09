"use client";

import { useDesignStore } from "@/store/useDesignStore";
import { Part } from "@/types/store";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// Mock component list
const COMPONENTS = [
    { type: "chassis", name: "Basic Chassis", color: "#3498db" },
    { type: "lidar", name: "LiDAR Sensor", color: "#e74c3c" },
    { type: "camera", name: "Depth Camera", color: "#f1c40f" },
    { type: "wheel", name: "Omni Wheel", color: "#95a5a6" },
];

function DraggableSidebarItem({ type, name, color }: { type: string, name: string, color: string }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `sidebar-${type}`,
        data: { type, name, color } // Pass data for drop handler
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="p-3 bg-slate-50 border rounded hover:bg-slate-100 cursor-move flex items-center gap-3 transition-colors"
        >
            <div className="w-8 h-8 rounded" style={{ backgroundColor: color }}></div>
            <span className="text-sm font-medium">{name}</span>
        </div>
    );
}

export default function ComponentLibrary() {
    const { addPart } = useDesignStore();

    const handleQuickAdd = (type: string) => {
        addPart({
            id: `part-${Date.now()}`,
            type,
            position: { x: 0, y: 0.5, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            specs: {}
        });
    };

    return (
        <div className="flex flex-col gap-2">
            {COMPONENTS.map((comp) => (
                <div key={comp.type} className="group relative">
                    {/* 
                For now we implement click-to-add for simplicity in Phase 3.
                Full drag-and-drop from DOM to Canvas (DndKit -> R3F) takes more setup 
                (usually involving a DndContext wrapper around the whole page).
             */}
                    <div
                        onClick={() => handleQuickAdd(comp.type)}
                        className="p-3 bg-slate-50 border rounded hover:border-blue-400 cursor-pointer flex items-center gap-3 transition-all active:scale-95"
                    >
                        <div className="w-8 h-8 rounded" style={{ backgroundColor: comp.color }}></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{comp.name}</span>
                            <span className="text-xs text-slate-400">Click to add</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

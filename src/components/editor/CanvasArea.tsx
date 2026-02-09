"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, ContactShadows, Environment } from "@react-three/drei";
import { useDesignStore } from "@/store/useDesignStore";
import DraggablePart from "./DraggablePart";
import * as THREE from "three"; // Fix missing THREE type
export default function CanvasArea() {
    const { parts, addPart, selectPart } = useDesignStore();

    const handleCanvasClick = (e: THREE.Event) => {
        // Only deselect if we clicked the background (e.point is on the grid/plane)
        // But R3F click events on Canvas might need mesh target check
        selectPart(null);
    };

    return (
        <div className="w-full h-full bg-slate-100 relative">
            <Canvas
                shadows
                camera={{ position: [5, 5, 5], fov: 50 }}
                gl={{ preserveDrawingBuffer: true }}
                onPointerMissed={() => selectPart(null)} // Click background to deselect
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} castShadow />

                <Grid
                    infiniteGrid
                    fadeDistance={50}
                    sectionColor="#2ecc71"
                    sectionThickness={1.5}
                    cellSize={1}
                />

                <OrbitControls makeDefault />
                <Environment preset="city" />
                <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={20} blur={2} />

                {/* Render Robot Parts */}
                {parts.map((part) => (
                    <DraggablePart key={part.id} part={part} />
                ))}
            </Canvas>
        </div>
    );
}

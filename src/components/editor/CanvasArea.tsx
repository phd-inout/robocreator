"use client";

import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Grid, ContactShadows, Environment } from "@react-three/drei";
import { useDesignStore } from "@/store/useDesignStore";
import DraggablePart from "./DraggablePart";
import ContextMenu from "./ContextMenu";
import CanvasToolbar from "./CanvasToolbar";
import { useState } from "react";

export default function CanvasArea() {
    const { parts, removePart, selectPart, addPart, updatePart } = useDesignStore();
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        partId: string;
    } | null>(null);

    const handleContextMenu = (e: ThreeEvent<MouseEvent>, partId: string) => {
        e.stopPropagation();
        selectPart(partId);

        setContextMenu({
            x: e.nativeEvent.clientX,
            y: e.nativeEvent.clientY,
            partId,
        });
    };

    const handleDelete = () => {
        if (contextMenu) {
            removePart(contextMenu.partId);
            selectPart(null);
        }
    };

    const handleDuplicate = () => {
        if (contextMenu) {
            const originalPart = parts.find(p => p.id === contextMenu.partId);
            if (originalPart) {
                addPart({
                    ...originalPart,
                    id: `part-${Date.now()}`,
                    position: {
                        x: originalPart.position.x + 1,
                        y: originalPart.position.y,
                        z: originalPart.position.z + 1,
                    },
                });
            }
        }
    };

    const handleRotate = () => {
        if (contextMenu) {
            const part = parts.find(p => p.id === contextMenu.partId);
            if (part) {
                updatePart(contextMenu.partId, {
                    rotation: {
                        x: part.rotation.x,
                        y: part.rotation.y + Math.PI / 2,
                        z: part.rotation.z,
                    },
                });
            }
        }
    };

    const handleProperties = () => {
        console.log("Properties for part:", contextMenu?.partId);
    };

    return (
        <div className="w-full h-full bg-slate-800 relative">
            {/* Top Toolbar */}
            <CanvasToolbar />

            {/* 3D Canvas */}
            <Canvas
                shadows
                camera={{ position: [8, 6, 8], fov: 50 }}
                gl={{ preserveDrawingBuffer: true }}
                onPointerMissed={() => selectPart(null)}
            >
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
                <pointLight position={[-10, 10, -5]} intensity={0.3} />

                {/* Grid */}
                <Grid
                    infiniteGrid
                    fadeDistance={100}
                    sectionColor="#475569"
                    sectionThickness={1}
                    cellSize={1}
                    cellColor="#334155"
                />

                {/* Controls */}
                <OrbitControls makeDefault />

                {/* Environment */}
                <Environment preset="night" />

                {/* Shadows */}
                <ContactShadows
                    position={[0, -0.01, 0]}
                    opacity={0.5}
                    scale={30}
                    blur={2}
                    color="#000000"
                />

                {/* Render Robot Parts */}
                {/* Render Robot Parts Recursively */}
                {parts
                    .filter((p) => !p.parentId) // Start with root parts
                    .map((rootPart) => {
                        const renderPart = (partId: string) => {
                            const part = parts.find((p) => p.id === partId);
                            if (!part) return null;

                            const children = parts.filter((p) => p.parentId === partId);

                            return (
                                <DraggablePart
                                    key={part.id}
                                    part={part}
                                    onContextMenu={handleContextMenu}
                                >
                                    {children.map((child) => renderPart(child.id))}
                                </DraggablePart>
                            );
                        };
                        return renderPart(rootPart.id);
                    })}
            </Canvas>

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onRotate={handleRotate}
                    onProperties={handleProperties}
                />
            )}

            {/* Coordinate Axes Indicator (Bottom Left) */}
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
                <div className="flex flex-col gap-1 text-xs font-mono">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-red-500"></div>
                        <span className="text-red-400">X</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-green-500"></div>
                        <span className="text-green-400">Y</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-blue-500"></div>
                        <span className="text-blue-400">Z</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useDesignStore } from "@/store/useDesignStore";
import { Part } from "@/types/store";
import { useCursor, TransformControls } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";
import PartModel from "./PartModel";

interface DraggablePartProps {
    part: Part;
    onContextMenu: (e: ThreeEvent<MouseEvent>, partId: string) => void;
}

export default function DraggablePart({ part, onContextMenu }: DraggablePartProps) {
    const { updatePart, selectPart, selectedPartId, transformMode } = useDesignStore();
    const [hovered, setHovered] = useState(false);
    const isSelected = selectedPartId === part.id;

    useCursor(hovered);

    return (
        <>
            {isSelected && transformMode && (
                <TransformControls
                    position={[part.position.x, part.position.y, part.position.z]}
                    rotation={[part.rotation.x, part.rotation.y, part.rotation.z]}
                    onObjectChange={(e: any) => {
                        if (e?.target?.object) {
                            updatePart(part.id, {
                                position: {
                                    x: e.target.object.position.x,
                                    y: Math.max(0, e.target.object.position.y),
                                    z: e.target.object.position.z
                                },
                                rotation: {
                                    x: e.target.object.rotation.x,
                                    y: e.target.object.rotation.y,
                                    z: e.target.object.rotation.z
                                }
                            });
                        }
                    }}
                    mode={transformMode}
                />
            )}
            <group
                position={[part.position.x, part.position.y, part.position.z]}
                rotation={[part.rotation.x, part.rotation.y, part.rotation.z]}
                onClick={(e) => {
                    e.stopPropagation();
                    selectPart(part.id);
                }}
                onContextMenu={(e) => {
                    e.stopPropagation();
                    onContextMenu(e, part.id);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                }}
                onPointerOut={() => setHovered(false)}
            >
                <PartModel
                    part={part}
                    color={isSelected ? "#e74c3c" : (hovered ? "#3498db" : "#2980b9")}
                />
            </group>
        </>
    );
}

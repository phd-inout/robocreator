"use client";

import { useDesignStore } from "@/store/useDesignStore";
import { Part } from "@/types/store";
import { useCursor } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";

interface DraggablePartProps {
    part: Part;
}

export default function DraggablePart({ part }: DraggablePartProps) {
    const { updatePart, selectPart, selectedPartId } = useDesignStore();
    const [hovered, setHovered] = useState(false);
    const isSelected = selectedPartId === part.id;

    useCursor(hovered);

    // Simplified drag logic placeholder - for now just visual selection
    // Real drag implementation will use @use-gesture/react or similar logic

    return (
        <group
            position={[part.position.x, part.position.y, part.position.z]}
            rotation={[part.rotation.x, part.rotation.y, part.rotation.z]}
            onClick={(e) => {
                e.stopPropagation();
                selectPart(part.id);
            }}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
            }}
            onPointerOut={() => setHovered(false)}
        >
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color={isSelected ? "#e74c3c" : (hovered ? "#3498db" : "#2980b9")}
                />
            </mesh>

            {/* Selection outline or helper could go here */}
            {isSelected && (
                <mesh>
                    <boxGeometry args={[1.05, 1.05, 1.05]} />
                    <meshBasicMaterial color="yellow" wireframe />
                </mesh>
            )}
        </group>
    );
}

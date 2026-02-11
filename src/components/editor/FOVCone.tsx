"use client";

import { Cone } from "@react-three/drei";
import { SensorSpecs } from "@/types/specs";

interface FOVConeProps {
    specs: SensorSpecs;
    color?: string;
}

export default function FOVCone({ specs, color = "#4299e1" }: FOVConeProps) {
    const range = specs.range || 10;
    const fov = specs.fov_h || 60; // degrees, use horizontal FOV

    // Convert FOV to cone radius at the far end
    const fovRadians = (fov * Math.PI) / 180;
    const radius = range * Math.tan(fovRadians / 2);

    return (
        <group rotation={[-Math.PI / 2, 0, 0]}> {/* Point cone forward (Z-axis) */}
            <Cone
                args={[radius, range, 16, 1, true]} // radiusBottom, height, radialSegments, heightSegments, openEnded
                position={[0, range / 2, 0]} // Offset so cone starts at origin
            >
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.15}
                    side={2} // DoubleSide
                    depthWrite={false}
                />
            </Cone>
            {/* Wireframe outline for better visibility */}
            <Cone
                args={[radius, range, 16, 1, true]}
                position={[0, range / 2, 0]}
            >
                <meshBasicMaterial
                    color={color}
                    wireframe
                    transparent
                    opacity={0.4}
                    depthWrite={false}
                />
            </Cone>
        </group>
    );
}

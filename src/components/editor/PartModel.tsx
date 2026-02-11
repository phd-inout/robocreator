
import { useGLTF } from "@react-three/drei";
import { Part } from "@/types/store";
import { useMemo } from "react";
import * as THREE from "three";

interface PartModelProps {
    part: Part;
    color: string;
}

export default function PartModel({ part, color }: PartModelProps) {
    // In a real app, we would have actual GLB files. 
    // For now, we'll try to load them, but have robust fallbacks.
    const modelPath = part.modelRef ? `/assets/models/${part.modelRef}.glb` : null;

    // We can use a try-catch block or error boundary for useGLTF, 
    // but useGLTF doesn't easily support "check if exists" without erroring.
    // For this prototype, we'll assume we use procedural shapes mostly
    // until the user actually puts files in public/assets/models.

    const { category, specs } = part;

    // Geometry based on category
    // CHASSIS -> Box
    // SENSOR -> Cylinder or small Box
    // WHEEL -> Cylinder

    // Parse dimensions if available (expecting [L, W, H] in meters)
    const dims = specs?.dims || [0.5, 0.5, 0.5];
    const [length, width, height] = Array.isArray(dims) ? dims : [0.5, 0.5, 0.5];

    if (category === "CHASSIS") {
        return (
            <mesh castShadow receiveShadow>
                <boxGeometry args={[length, height, width]} />
                <meshStandardMaterial color={color} />

                {/* Visual cue for "front" of chassis */}
                <mesh position={[length / 2, 0, 0]}>
                    <boxGeometry args={[0.1, height * 0.8, width * 0.8]} />
                    <meshStandardMaterial color="#2c3e50" />
                </mesh>
            </mesh>
        );
    }

    if (category === "SENSOR") {
        // Cylinder for LiDAR/Cameras (approximation)
        return (
            <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
                <cylinderGeometry args={[width / 2, width / 2, height, 16]} />
                <meshStandardMaterial color={color} />
                {/* Lens indicator */}
                <mesh position={[0, height / 4, width / 2]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[width / 4, width / 4, 0.05, 8]} />
                    <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
                </mesh>
            </mesh>
        );
    }

    if (category === "BATTERY") {
        return (
            <mesh castShadow receiveShadow>
                <boxGeometry args={[length, height, width]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
                <mesh position={[0, height / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[length * 0.8, width * 0.8]} />
                    <meshStandardMaterial color="#000" />
                </mesh>
            </mesh>
        );
    }

    // Default fallback
    return (
        <mesh castShadow receiveShadow>
            <boxGeometry args={[length, height, width]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}

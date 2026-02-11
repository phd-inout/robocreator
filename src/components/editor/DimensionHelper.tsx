"use client";

import { Line } from "@react-three/drei";
import { ComponentSpecs } from "@/types/specs";

interface DimensionHelperProps {
    specs: ComponentSpecs;
}

export default function DimensionHelper({ specs }: DimensionHelperProps) {
    const dims = specs.dims || [1, 1, 1];
    const [length, width, height] = dims;

    // Half dimensions for positioning
    const halfL = length / 2;
    const halfW = width / 2;
    const halfH = height / 2;

    return (
        <group>
            {/* X-axis (Length) - Red */}
            <Line
                points={[[-halfL, -halfH, -halfW], [halfL, -halfH, -halfW]]}
                color="red"
                lineWidth={2}
                dashed={false}
            />
            <Line
                points={[[-halfL, halfH, -halfW], [halfL, halfH, -halfW]]}
                color="red"
                lineWidth={2}
                dashed={false}
            />

            {/* Y-axis (Height) - Green */}
            <Line
                points={[[-halfL, -halfH, -halfW], [-halfL, halfH, -halfW]]}
                color="green"
                lineWidth={2}
                dashed={false}
            />
            <Line
                points={[[halfL, -halfH, -halfW], [halfL, halfH, -halfW]]}
                color="green"
                lineWidth={2}
                dashed={false}
            />

            {/* Z-axis (Width) - Blue */}
            <Line
                points={[[-halfL, -halfH, -halfW], [-halfL, -halfH, halfW]]}
                color="blue"
                lineWidth={2}
                dashed={false}
            />
            <Line
                points={[[halfL, -halfH, -halfW], [halfL, -halfH, halfW]]}
                color="blue"
                lineWidth={2}
                dashed={false}
            />

            {/* Corner markers for better visibility */}
            {[
                [-halfL, -halfH, -halfW],
                [halfL, -halfH, -halfW],
                [-halfL, halfH, -halfW],
                [halfL, halfH, -halfW],
                [-halfL, -halfH, halfW],
                [halfL, -halfH, halfW],
                [-halfL, halfH, halfW],
                [halfL, halfH, halfW],
            ].map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <meshBasicMaterial color="white" />
                </mesh>
            ))}
        </group>
    );
}


import { useGLTF } from "@react-three/drei";
import { Part } from "@/types/store";
import { useMemo } from "react";
import * as THREE from "three";

interface PartModelProps {
    part: Part;
    color: string;
}

// Sub-component for GLTF loading to adhere to Hook rules
function GltfModel({ url, color, dims }: { url: string; color: string; dims: [number, number, number] }) {
    const { scene } = useGLTF(url);
    const cloned = useMemo(() => {
        const c = scene.clone();

        // Traverse to apply color if needed? 
        // Usually custom models have textures. We might want to Tint them if selected?
        // keeping original materials for now.

        return c;
    }, [scene]);

    // Scaling Logic:
    // If dims are provided, we should scale the model to fit?
    // But we don't know the original size of the GLB.
    // We can assume GLB is normalized or we use a bounding box to normalize?

    // For P0 Custom Import: Just render as is (scale 1).
    // Parametric Scaling for Custom Models is P1.
    // (If user changes Dimensions inputs, we scale this group).

    return <primitive object={cloned} />;
}

export default function PartModel({ part, color }: PartModelProps) {
    const { category, specs, modelRef } = part;

    // Parse dimensions
    const dims = specs?.dims || [0.5, 0.5, 0.5];
    const [length, width, height] = Array.isArray(dims) ? dims : [0.5, 0.5, 0.5];

    // Determine Model URL
    const modelPath = useMemo(() => {
        if (!modelRef) return null;
        if (modelRef.startsWith('blob:') || modelRef.startsWith('http')) {
            return modelRef;
        }
        return `/assets/models/${modelRef}.glb`;
    }, [modelRef]);

    if (modelPath) {
        return (
            <mesh castShadow receiveShadow>
                {/* Apply scaling to the container mesh/group if dims change from default? */}
                {/* For custom models, we rely on the model's own scale usually. */}
                {/* But if Parametric Scaling is active, we should apply scale. */}
                {/* Let's apply a scale based on dims/0.5 (assuming 0.5 is base)? No that's risky. */}
                {/* For Custom Models, we just render them. Parametric scaling might be applied via TransformControls scaling? */}
                {/* But our store has 'dims', not 'scale'. */}
                {/* For now, just render GltfModel inside a Scaled Group? */}
                {/* Let's render 1:1 for now. */}
                <GltfModel url={modelPath} color={color} dims={[length, width, height]} />

                {/* Visual Bounding Box if Selected? */}
                {/* <boxHelper args={[undefined, 0xffff00]} /> */}
            </mesh>
        );
    }

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

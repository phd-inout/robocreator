"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useDesignStore } from "@/store/useDesignStore";
import * as THREE from "three";

const CAMERA_PRESETS = {
    top: { position: new THREE.Vector3(0, 15, 0), target: new THREE.Vector3(0, 0, 0) },
    front: { position: new THREE.Vector3(0, 3, 12), target: new THREE.Vector3(0, 0, 0) },
    right: { position: new THREE.Vector3(12, 3, 0), target: new THREE.Vector3(0, 0, 0) },
    back: { position: new THREE.Vector3(0, 3, -12), target: new THREE.Vector3(0, 0, 0) },
    perspective: { position: new THREE.Vector3(8, 6, 8), target: new THREE.Vector3(0, 0, 0) }
};

export default function CameraController() {
    const { camera, controls } = useThree();
    const { cameraView } = useDesignStore();
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        if (!controls) return;

        const preset = CAMERA_PRESETS[cameraView];
        if (!preset) return;

        // Cancel any ongoing animation
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current);
        }

        // Smooth transition using lerp
        const startPosition = camera.position.clone();
        const startTarget = (controls as any).target.clone();
        const duration = 500; // ms
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);

            // Interpolate position and target
            camera.position.lerpVectors(startPosition, preset.position, eased);
            (controls as any).target.lerpVectors(startTarget, preset.target, eased);
            (controls as any).update();

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                animationRef.current = null;
            }
        };

        animate();

        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [cameraView, camera, controls]);

    return null; // This component doesn't render anything
}

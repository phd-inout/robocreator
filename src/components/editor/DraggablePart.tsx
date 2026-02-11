"use client";

import { useDesignStore } from "@/store/useDesignStore";
import { Part } from "@/types/store";
import { useCursor, TransformControls } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useState } from "react";
import * as THREE from "three";
import PartModel from "./PartModel";
import { findNearestSocket } from "@/utils/snapping";
import SocketVisualizer from "./SocketVisualizer";
import { worldToLocal } from "@/utils/transforms";

interface DraggablePartProps {
    part: Part;
    onContextMenu: (e: ThreeEvent<MouseEvent>, partId: string) => void;
    children?: React.ReactNode;
}

export default function DraggablePart({ part, onContextMenu, children }: DraggablePartProps) {
    const { parts, updatePart, selectPart, selectedPartId, transformMode, reparentPart } = useDesignStore();
    const [hovered, setHovered] = useState(false);
    const isSelected = selectedPartId === part.id;
    const [snapTarget, setSnapTarget] = useState<THREE.Vector3 | null>(null);
    const [pendingParentId, setPendingParentId] = useState<string | null>(null);

    useCursor(hovered);

    return (
        <>
            {/* Snap Indicator */}
            {snapTarget && transformMode === 'translate' && isSelected && (
                <mesh position={snapTarget}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshBasicMaterial color="#4ade80" transparent opacity={0.6} depthTest={false} />
                </mesh>
            )}

            {isSelected && transformMode && (
                <TransformControls
                    // Initial position/prop is based on Store (Local)
                    position={[part.position.x, part.position.y, part.position.z]}
                    rotation={[part.rotation.x, part.rotation.y, part.rotation.z]}
                    onObjectChange={(e: any) => {
                        if (e?.target?.object) {
                            const obj = e.target.object;
                            // TransformControls operating effectively in Local Space of the Group
                            let newPos = { x: obj.position.x, y: obj.position.y, z: obj.position.z };
                            let newRot = { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z };

                            // Snapping Logic
                            if (transformMode === 'translate') {
                                // Pass All Parts for matrix calculations
                                const snap = findNearestSocket(
                                    part,
                                    newPos,
                                    newRot,
                                    parts
                                );

                                if (snap) {
                                    // snap.position is WORLD position
                                    setSnapTarget(new THREE.Vector3(snap.position.x, snap.position.y, snap.position.z));
                                    setPendingParentId(snap.targetPartId);
                                } else {
                                    setSnapTarget(null);
                                    setPendingParentId(null);
                                }
                            }

                            // Update Store with LOCAL position (as dragged)
                            // Ideally we snap visually during drag too?
                            // For complex hierarchy, maybe just show indicator first.
                            updatePart(part.id, {
                                position: newPos,
                                rotation: newRot
                            });
                        }
                    }}
                    onMouseUp={() => {
                        if (pendingParentId && snapTarget) {
                            console.log("Applying Snap Parent:", pendingParentId);

                            // 1. Calculate Local Transform relative to NEW parent
                            const { position: localPos, rotation: localRot } = worldToLocal(
                                pendingParentId,
                                snapTarget,
                                new THREE.Euler(part.rotation.x, part.rotation.y, part.rotation.z), // Keep rotation for now
                                parts
                            );

                            // 2. Update Part to be child of pendingParentId
                            updatePart(part.id, {
                                position: { x: localPos.x, y: localPos.y, z: localPos.z },
                                rotation: { x: localRot.x, y: localRot.y, z: localRot.z }
                            });

                            // 3. Set Parent
                            reparentPart(part.id, pendingParentId);

                            // Clear Snap State
                            setSnapTarget(null);
                            setPendingParentId(null);
                        } else {
                            // If released without snap, and was parented, should we Unparent?
                            // Maybe hold Shift to unparent?
                            // For now, assume if you drag away far enough, you might want to unparent?
                            // But usually users want to adjust position on parent.
                            // So explicit unparenting is safer (e.g. via Context Menu or "Drop on Background").
                            setSnapTarget(null);
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

                {/* Visual Sockets */}
                <SocketVisualizer part={part} visible={isSelected || hovered} />

                {/* Render Children Recursively */}
                {children}
            </group>
        </>
    );
}

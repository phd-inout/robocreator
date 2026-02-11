import { Part } from "@/types/store";
import { Html } from "@react-three/drei";
import React from "react";

interface SocketVisualizerProps {
    part: Part;
    visible: boolean;
}

export default function SocketVisualizer({ part, visible }: SocketVisualizerProps) {
    if (!visible || !part.specs.sockets) return null;

    return (
        <group>
            {part.specs.sockets.map((socket) => (
                <group key={socket.id} position={socket.position}>
                    {/* Visual Sphere */}
                    <mesh>
                        <sphereGeometry args={[0.03, 16, 16]} />
                        <meshBasicMaterial
                            color={socket.type === 'mount' ? "#3b82f6" : "#f97316"}
                            depthTest={false}
                            transparent
                            opacity={0.8}
                        />
                    </mesh>

                    {/* Label (Optional, maybe too cluttered) */}
                    {/* <Html position={[0, 0.05, 0]} center>
                        <div className="bg-black/80 text-white text-xs px-1 rounded pointer-events-none whitespace-nowrap">
                            {socket.id}
                        </div>
                    </Html> */}
                </group>
            ))}
        </group>
    );
}

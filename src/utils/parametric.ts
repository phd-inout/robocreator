import { Part } from "@/types/store";
import { ComponentSpecs, Socket } from "@/types/specs";

export function recalculateSockets(part: Part, newDims: [number, number, number]): Socket[] {
    const [len, width, height] = newDims;
    const oldSockets = part.specs.sockets || [];

    // Deep copy sockets
    const newSockets = oldSockets.map(s => ({ ...s, position: [...s.position] as [number, number, number] }));

    if (part.category === 'CHASSIS') {
        newSockets.forEach(s => {
            // Heuristic based on ID or approximate position
            // Center is 0,0,0

            // X-axis (Length)
            if (Math.abs(s.position[0]) > 0.01) {
                const sign = Math.sign(s.position[0]);
                // If it was roughly at the edge (oldLen/2), move to newLen/2
                // Or just scale linearly? 
                // Linear scale is safer if we don't know original dims.
                // But we don't know original dims here easily unless we store them.

                // Let's assume standard chassis sockets are at edges.
                // If id contains 'front' -> x = len/2
                // If id contains 'back' -> x = -len/2
                if (s.id.includes('front')) s.position[0] = len / 2;
                if (s.id.includes('back')) s.position[0] = -len / 2;

                // If linear scaling strategy:
                // s.pos[0] = s.pos[0] * (len / oldLen?) -> We don't have oldLen.
            }

            // Z-axis (Width)
            if (Math.abs(s.position[2]) > 0.01) {
                if (s.id.includes('left')) s.position[2] = width / 2;
                if (s.id.includes('right')) s.position[2] = -width / 2;
            }

            // Y-axis (Height/Top)
            if (s.id.includes('top') || Math.abs(s.position[1]) > 0.01) {
                // Top mount usually at height/2 (if origin is center) or height (if origin is bottom)
                // Box geometry origin is center. So top is height/2.
                if (s.position[1] > 0) s.position[1] = height / 2;
            }
        });
    } else if (part.category === 'PLATFORM') {
        // Similar to Chassis
        newSockets.forEach(s => {
            if (s.id.includes('front')) s.position[0] = len / 2;
            if (s.id.includes('back')) s.position[0] = -len / 2;
            if (s.id.includes('left')) s.position[2] = width / 2;
            if (s.id.includes('right')) s.position[2] = -width / 2;
            if (s.position[1] > 0) s.position[1] = height / 2;
        });
    }

    return newSockets;
}

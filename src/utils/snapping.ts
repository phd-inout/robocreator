import * as THREE from 'three';
import { Part, Vector3 as IVector3, Euler as IEuler } from '../types/store';
import { Socket } from '../types/specs';
import { getPartWorldMatrix } from './transforms';

export interface SnapResult {
    position: IVector3; // World Position of the snap
    rotation: IEuler;
    targetPartId: string;
    targetSocketId: string;
    sourceSocketId: string;
}

const SNAP_THRESHOLD = 0.3; // meters

const toVec3 = (v: IVector3) => new THREE.Vector3(v.x, v.y, v.z);
const toEuler = (e: IEuler) => new THREE.Euler(e.x, e.y, e.z);

function getSocketWorldPosition(part: Part, socket: Socket, allParts: Part[], overrideMatrix?: THREE.Matrix4): THREE.Vector3 {
    let partMatrix: THREE.Matrix4;

    if (overrideMatrix) {
        partMatrix = overrideMatrix;
    } else {
        partMatrix = getPartWorldMatrix(part.id, allParts);
    }

    const socketOffset = new THREE.Vector3(...socket.position);
    // Apply matrix (which handles rotation and position of part + ancestors)
    // Note: socket.position is local to part mesh. Matrix transforms part local -> world.
    return socketOffset.applyMatrix4(partMatrix);
}

export function findNearestSocket(
    activePart: Part,
    activeLocalPos: IVector3,
    activeLocalRot: IEuler,
    allParts: Part[]
): SnapResult | null {
    if (!activePart.specs.sockets || activePart.specs.sockets.length === 0) return null;

    // Calculate Active Part World Matrix based on current drag (Local)
    // WorldMatrix = ParentWorldMatrix * activeLocalMatrix
    let activeWorldMatrix: THREE.Matrix4;

    // Construct local matrix from drag props
    const localMatrix = new THREE.Matrix4().compose(
        new THREE.Vector3(activeLocalPos.x, activeLocalPos.y, activeLocalPos.z),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(activeLocalRot.x, activeLocalRot.y, activeLocalRot.z)),
        new THREE.Vector3(1, 1, 1)
    );

    if (activePart.parentId) {
        const parentMatrix = getPartWorldMatrix(activePart.parentId, allParts);
        activeWorldMatrix = parentMatrix.clone().multiply(localMatrix);
    } else {
        activeWorldMatrix = localMatrix;
    }

    let bestDist = SNAP_THRESHOLD;
    let bestSnap: SnapResult | null = null;

    for (const sourceSocket of activePart.specs.sockets) {
        if (sourceSocket.type !== 'connector') continue;

        const sourceWorldPos = getSocketWorldPosition(activePart, sourceSocket, allParts, activeWorldMatrix);

        for (const targetPart of allParts) {
            if (targetPart.id === activePart.id) continue;
            // Prevent snapping to own children (circular)
            let isChild = false;
            let current = targetPart;
            while (current.parentId) {
                if (current.parentId === activePart.id) { isChild = true; break; }
                const p = allParts.find(x => x.id === current.parentId);
                if (!p) break;
                current = p;
            }
            if (isChild) continue;

            if (!targetPart.specs.sockets) continue;

            for (const targetSocket of targetPart.specs.sockets) {
                if (targetSocket.type !== 'mount') continue;

                const targetWorldPos = getSocketWorldPosition(targetPart, targetSocket, allParts);
                const dist = sourceWorldPos.distanceTo(targetWorldPos);

                if (dist < bestDist) {
                    bestDist = dist;

                    console.log(`Snap detected: ${activePart.name.zh} to ${targetPart.name.zh} dist=${dist.toFixed(3)}`);

                    // Calculate where the part origin should be in WORLD space to align sockets
                    // TargetSocketWorld = PartOriginWorld + (SocketOffset * PartRot)
                    // We want SourceSocketWorld == TargetSocketWorld
                    // (PartOrigin * ... * SourceSocket) = TargetSocketWorld

                    // Actually easier:
                    // NewPartWorldPos = TargetSocketWorld - (SourceSocketOffset in World Rotation)

                    // 1. Get orientation of part in World
                    const activeWorldQuat = new THREE.Quaternion().setFromRotationMatrix(activeWorldMatrix);
                    const sourceOffsetWorld = new THREE.Vector3(...sourceSocket.position).applyQuaternion(activeWorldQuat);

                    const newPartWorldPos = targetWorldPos.clone().sub(sourceOffsetWorld);

                    bestSnap = {
                        position: { x: newPartWorldPos.x, y: newPartWorldPos.y, z: newPartWorldPos.z },
                        rotation: activeLocalRot, // Store rotation as-is for now (no alignment)
                        targetPartId: targetPart.id,
                        targetSocketId: targetSocket.id,
                        sourceSocketId: sourceSocket.id
                    };
                }
            }
        }
    }
    return bestSnap;
}

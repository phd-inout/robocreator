import * as THREE from 'three';
import { Part } from '@/types/store';

// Helper to construct Matrix form Position/Rotation
export function getLocalMatrix(part: Part): THREE.Matrix4 {
    const pos = new THREE.Vector3(part.position.x, part.position.y, part.position.z);
    const rot = new THREE.Euler(part.rotation.x, part.rotation.y, part.rotation.z);
    const quat = new THREE.Quaternion().setFromEuler(rot);
    const scale = new THREE.Vector3(1, 1, 1);

    return new THREE.Matrix4().compose(pos, quat, scale);
}

export function getPartWorldMatrix(partId: string, allParts: Part[]): THREE.Matrix4 {
    const part = allParts.find(p => p.id === partId);
    if (!part) return new THREE.Matrix4(); // Identity if not found

    const localMatrix = getLocalMatrix(part);

    if (part.parentId) {
        const parentMatrix = getPartWorldMatrix(part.parentId, allParts);
        return parentMatrix.clone().multiply(localMatrix); // Parent * Local
    }

    return localMatrix;
}

export function worldToLocal(
    parentId: string | null,
    worldPos: THREE.Vector3,
    worldRot: THREE.Euler,
    allParts: Part[]
): { position: THREE.Vector3, rotation: THREE.Euler } {
    if (!parentId) {
        return { position: worldPos, rotation: worldRot };
    }

    const parentMatrix = getPartWorldMatrix(parentId, allParts);
    const parentInverse = parentMatrix.clone().invert();

    // Transform Position
    const localPos = worldPos.clone().applyMatrix4(parentInverse);

    // Transform Rotation
    // WorldQuat = ParentQuat * LocalQuat => LocalQuat = Inv(ParentQuat) * WorldQuat
    const parentQuat = new THREE.Quaternion().setFromRotationMatrix(parentMatrix);
    const worldQuat = new THREE.Quaternion().setFromEuler(worldRot);
    const localQuat = parentQuat.clone().invert().multiply(worldQuat);

    const localEuler = new THREE.Euler().setFromQuaternion(localQuat);

    return { position: localPos, rotation: localEuler };
}

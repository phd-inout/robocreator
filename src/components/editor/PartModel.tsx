
import { useGLTF } from "@react-three/drei";
import { Part } from "@/types/store";
import { useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { OBJLoader } from "three-stdlib";
import { STLLoader } from "three-stdlib";
import { FBXLoader } from "three-stdlib";
import { GLTFLoader } from "three-stdlib";

interface PartModelProps {
    part: Part;
    color: string;
}

// Generic Model Loader
// Separate components for each format to ensure hooks are called unconditionally
function StlModel({ url, color }: { url: string; color: string }) {
    const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        console.log('[StlModel] Loading STL from:', url);
        const loader = new STLLoader();

        // 手动 fetch 以确保 arraybuffer 响应类型
        fetch(url)
            .then(res => {
                console.log('[StlModel] Fetch response:', res.status, res.headers.get('content-type'));
                return res.arrayBuffer();
            })
            .then(buffer => {
                console.log('[StlModel] ArrayBuffer size:', buffer.byteLength);
                const geom = loader.parse(buffer);

                // 计算边界框并自动缩放
                geom.computeBoundingBox();
                const bbox = geom.boundingBox;
                if (bbox) {
                    const size = new THREE.Vector3();
                    bbox.getSize(size);
                    const maxDim = Math.max(size.x, size.y, size.z);

                    // 如果模型太大(>10单位),自动缩放到 1 单位左右
                    // STL 通常是毫米单位,所以除以 1000
                    let autoScale = 1;
                    if (maxDim > 10) {
                        autoScale = 1 / maxDim; // 归一化到 1 单位
                    }

                    console.log('[StlModel] Bounding box size:', size, 'Auto scale:', autoScale);
                    setScale(autoScale);
                }

                console.log('[StlModel] Geometry loaded:', geom);
                setGeometry(geom);
            })
            .catch(err => console.error('STL Load Error:', err));

        return () => {
            geometry?.dispose();
        };
    }, [url]);

    if (!geometry) return null;

    return (
        <mesh geometry={geometry} castShadow receiveShadow scale={scale}>
            <meshStandardMaterial color={color} />
        </mesh>
    );
}

function ObjModel({ url, color }: { url: string; color: string }) {
    const [object, setObject] = useState<THREE.Group | null>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const loader = new OBJLoader();

        fetch(url)
            .then(res => res.arrayBuffer())
            .then(buffer => {
                const text = new TextDecoder().decode(buffer);
                const obj = loader.parse(text);
                obj.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({ color });
                    }
                });

                // 计算边界框并自动缩放
                const bbox = new THREE.Box3().setFromObject(obj);
                const size = new THREE.Vector3();
                bbox.getSize(size);
                const maxDim = Math.max(size.x, size.y, size.z);
                if (maxDim > 10) {
                    setScale(1 / maxDim);
                }

                setObject(obj);
            })
            .catch(err => console.error('OBJ Load Error:', err));
    }, [url, color]);

    if (!object) return null;
    return <primitive object={object} scale={scale} />;
}

function FbxModel({ url, color }: { url: string; color: string }) {
    const [object, setObject] = useState<THREE.Group | null>(null);
    const [scale, setScale] = useState(0.01);

    useEffect(() => {
        const loader = new FBXLoader();

        fetch(url)
            .then(res => res.arrayBuffer())
            .then(buffer => {
                const fbx = loader.parse(buffer, '');
                fbx.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                        if (!mat?.map) {
                            (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({ color });
                        }
                    }
                });

                // FBX 通常需要更小的缩放
                const bbox = new THREE.Box3().setFromObject(fbx);
                const size = new THREE.Vector3();
                bbox.getSize(size);
                const maxDim = Math.max(size.x, size.y, size.z);
                if (maxDim > 10) {
                    setScale(1 / maxDim);
                } else {
                    setScale(0.01); // FBX 默认缩放
                }

                setObject(fbx);
            })
            .catch(err => console.error('FBX Load Error:', err));
    }, [url, color]);

    if (!object) return null;
    return <primitive object={object} scale={scale} />;
}

function GltfModel({ url, color }: { url: string; color: string }) {
    const [object, setObject] = useState<THREE.Group | null>(null);

    useEffect(() => {
        // 对于 Blob URL,手动加载避免 useGLTF 的问题
        if (url.startsWith('blob:')) {
            fetch(url)
                .then(res => res.arrayBuffer())
                .then(buffer => {
                    const loader = new GLTFLoader();
                    loader.parse(buffer, '', (gltf: any) => {
                        setObject(gltf.scene);
                    }, (error: any) => {
                        console.error('GLTF Load Error:', error);
                    });
                })
                .catch(err => console.error('GLTF Fetch Error:', err));
        } else {
            // 对于普通 URL,直接使用 GLTFLoader.load
            const loader = new GLTFLoader();
            loader.load(url, (gltf: any) => {
                setObject(gltf.scene);
            }, undefined, (error: any) => {
                console.error('GLTF Load Error:', error);
            });
        }
    }, [url]);

    if (!object) return null;
    return <primitive object={object} />;
}

// Generic Model Dispatcher
function GenericModel({ url, format, color }: { url: string; format: string; color: string }) {
    console.log('[GenericModel] Loading:', { url, format, isBlobUrl: url.startsWith('blob:') });

    if (format === 'stl') return <StlModel url={url} color={color} />;
    if (format === 'obj') return <ObjModel url={url} color={color} />;
    if (format === 'fbx') return <FbxModel url={url} color={color} />;
    return <GltfModel url={url} color={color} />;
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
                <GenericModel url={modelPath} format={specs?.modelFormat || 'glb'} color={color} />

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

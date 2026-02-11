import { ComponentData } from "@/actions/catalog";

export const FALLBACK_COMPONENTS: ComponentData[] = [
    {
        id: 'fallback-chassis-01',
        sku: 'CHASSIS-GENERIC-01',
        category: 'CHASSIS',
        name: {
            zh: '通用中型差速底盘 (离线)',
            en: 'Generic Medium Diff-Drive Chassis (Offline)'
        },
        description: {
            zh: '适用于室内外平滑路面的基础底盘，载重80kg。',
            en: 'Basic chassis for indoor/outdoor smooth surfaces, 80kg payload.'
        },
        specs: {
            type: 'chassis',
            weight: 30,
            dims: [0.6, 0.5, 0.3],
            max_payload: 80,
            max_speed: 1.2,
            climb_angle: 15,
            sockets: [
                { id: 'mount-top-center', position: [0, 0.15, 0], type: 'mount' },
                { id: 'mount-front', position: [0, 0.1, 0.25], type: 'mount' },
                { id: 'mount-rear', position: [0, 0.1, -0.25], type: 'mount' }
            ]
        } as any,
        modelRef: 'chassis',
        thumbnail: '/assets/thumbnails/chassis.png',
        priceList: 4500
    },
    {
        id: 'fallback-battery-01',
        sku: 'BATTERY-24V-20AH',
        category: 'BATTERY',
        name: {
            zh: '24V 高性能锂电池包 (离线)',
            en: '24V High-Perf Lithium Battery (Offline)'
        },
        description: {
            zh: '长续航磷酸铁锂电池，适合长时间作业。',
            en: 'Long-range LiFePO4 battery for extended operation.'
        },
        specs: {
            type: 'battery',
            weight: 3.5,
            dims: [0.2, 0.1, 0.1],
            voltage: 24,
            capacity: 480,
            max_output: 500,
            sockets: [{ id: 'connector-bottom', position: [0, -0.05, 0], type: 'connector' }]
        } as any,
        modelRef: 'battery',
        thumbnail: null,
        priceList: 1200
    },
    {
        id: 'fallback-lidar-01',
        sku: 'LIDAR-VLP16',
        category: 'SENSOR',
        name: {
            zh: '16线激光雷达 (离线)',
            en: '16-Channel LiDAR (Offline)'
        },
        description: null,
        specs: {
            type: 'sensor',
            weight: 0.8,
            dims: [0.1, 0.1, 0.08],
            power: 8,
            range: 100,
            fov_v: 30,
            sockets: [{ id: 'connector-bottom', position: [0, -0.04, 0], type: 'connector' }]
        } as any,
        modelRef: 'lidar',
        thumbnail: null,
        priceList: 8000
    },
    // Adding Depth Camera
    {
        id: 'fallback-camera-01',
        sku: 'CAM-RGBD-PRO',
        category: 'SENSOR',
        name: {
            zh: '专业RGBD深度相机 (离线)',
            en: 'Pro RGBD Depth Camera (Offline)'
        },
        description: null,
        specs: {
            type: 'sensor',
            weight: 0.3,
            dims: [0.12, 0.03, 0.03],
            power: 3,
            range: 10,
            fov_h: 87,
            sockets: [{ id: 'connector-bottom', position: [0, -0.015, 0], type: 'connector' }] // Guess position
        } as any,
        modelRef: 'camera',
        thumbnail: null,
        priceList: 1500
    }
];

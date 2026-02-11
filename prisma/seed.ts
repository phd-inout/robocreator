
import { PrismaClient, Category } from '@prisma/client'
import {
    ComponentSpecs,
    ChassisSpecs,
    BatterySpecs,
    SensorSpecs
} from '../src/types/specs'
import { LocalizedString } from '../src/types/i18n'

const prisma = new PrismaClient()

// Helper function to enforce types on Component creation
async function createComponent(data: {
    sku: string,
    category: Category,
    name: LocalizedString,
    description?: LocalizedString,
    specs: ComponentSpecs,
    modelRef: string,
    priceList: number,
    thumbnail?: string,
    isActive?: boolean
}) {
    await prisma.component.create({
        data: {
            ...data,
            specs: data.specs as any, // Prisma expects Json, cast just for the ORM call
            name: data.name as any,
            description: data.description as any
        }
    })
}

async function main() {
    console.log('🌱 Starting seed...')

    // Clear existing components
    await prisma.component.deleteMany({})

    // 1. Generic Chassis
    const chassisSpecs: ChassisSpecs = {
        type: 'chassis',
        weight: 30, // kg
        dims: [0.6, 0.5, 0.3], // [L, W, H] meters
        max_payload: 80, // kg
        max_speed: 1.2, // m/s
        climb_angle: 15, // degrees
        sockets: [
            { id: 'mount-top-center', position: [0, 0.15, 0], type: 'mount' },
            { id: 'mount-front', position: [0, 0.1, 0.25], type: 'mount' },
            { id: 'mount-rear', position: [0, 0.1, -0.25], type: 'mount' }
        ]
    }

    await createComponent({
        sku: 'CHASSIS-GENERIC-01',
        category: 'CHASSIS',
        name: {
            zh: '通用中型差速底盘',
            en: 'Generic Medium Diff-Drive Chassis'
        },
        description: {
            zh: '适用于室内外平滑路面的基础底盘，载重80kg。',
            en: 'Basic chassis for indoor/outdoor smooth surfaces, 80kg payload.'
        },
        specs: chassisSpecs,
        modelRef: 'chassis',
        priceList: 4500.00,
        thumbnail: '/assets/thumbnails/chassis.png',
        isActive: true
    })

    // 2. High Perf Battery
    const batterySpecs: BatterySpecs = {
        type: 'battery',
        weight: 3.5, // kg
        dims: [0.2, 0.1, 0.1],
        voltage: 24, // V
        capacity: 480, // Wh (24V * 20Ah)
        max_output: 500, // W
        sockets: [{ id: 'connector-bottom', position: [0, -0.05, 0], type: 'connector' }]
    }

    await createComponent({
        sku: 'BATTERY-24V-20AH',
        category: 'BATTERY',
        name: {
            zh: '24V 高性能锂电池包',
            en: '24V High-Perf Lithium Battery'
        },
        description: {
            zh: '长续航磷酸铁锂电池，适合长时间作业。',
            en: 'Long-range LiFePO4 battery for extended operation.'
        },
        specs: batterySpecs,
        modelRef: 'battery',
        priceList: 1200.00,
        isActive: true
    })

    // 3. LiDAR Sensor
    const lidarSpecs: SensorSpecs = {
        type: 'sensor',
        weight: 0.8,
        dims: [0.1, 0.1, 0.08],
        power: 8, // W consumption
        range: 100, // m
        fov_v: 30, // degrees
        sockets: [{ id: 'connector-bottom', position: [0, -0.04, 0], type: 'connector' }]
    }

    await createComponent({
        sku: 'LIDAR-VLP16',
        category: 'SENSOR',
        name: {
            zh: '16线激光雷达',
            en: '16-Channel LiDAR'
        },
        specs: lidarSpecs,
        modelRef: 'lidar',
        priceList: 8000.00,
        isActive: true
    })

    // 4. Depth Camera
    const cameraSpecs: SensorSpecs = {
        type: 'sensor',
        weight: 0.3,
        dims: [0.12, 0.03, 0.03],
        power: 3, // W
        range: 10, // m
        fov_h: 87 // degrees
    }

    await createComponent({
        sku: 'CAM-RGBD-PRO',
        category: 'SENSOR',
        name: {
            zh: '专业RGBD深度相机',
            en: 'Pro RGBD Depth Camera'
        },
        specs: cameraSpecs,
        modelRef: 'camera',
        priceList: 1500.00,
        isActive: true
    })

    console.log('✅ Seed data injected successfully')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

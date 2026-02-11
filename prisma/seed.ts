
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Clear existing components
    await prisma.component.deleteMany({})

    // 1. Generic Chassis
    await prisma.component.create({
        data: {
            sku: 'CHASSIS-GENERIC-01',
            category: 'CHASSIS',
            name: {
                zh: '通用中型差速底盘',
                en: 'Generic Medium Diff-Drive Chassis'
            } as any,
            description: {
                zh: '适用于室内外平滑路面的基础底盘，载重80kg。',
                en: 'Basic chassis for indoor/outdoor smooth surfaces, 80kg payload.'
            } as any,
            // Physical parameters for Logic Engine
            specs: {
                weight: 30, // kg
                dims: [0.6, 0.5, 0.3], // [L, W, H] meters
                max_payload: 80, // kg
                max_speed: 1.2, // m/s
                climb_angle: 15 // degrees
            } as any,
            modelRef: 'chassis', // Placeholder for GLB model ID
            priceList: 4500.00,
            thumbnail: '/assets/thumbnails/chassis.png',
            isActive: true
        }
    })

    // 2. High Perf Battery
    await prisma.component.create({
        data: {
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
            specs: {
                weight: 3.5, // kg
                dims: [0.2, 0.1, 0.1],
                voltage: 24, // V
                capacity: 480, // Wh (24V * 20Ah)
                max_output: 500 // W
            },
            modelRef: 'battery',
            priceList: 1200.00,
            isActive: true
        }
    })

    // 3. LiDAR Sensor
    await prisma.component.create({
        data: {
            sku: 'LIDAR-VLP16',
            category: 'SENSOR',
            name: {
                zh: '16线激光雷达',
                en: '16-Channel LiDAR'
            },
            specs: {
                weight: 0.8,
                dims: [0.1, 0.1, 0.08],
                power: 8, // W consumption
                range: 100, // m
                fov_v: 30 // degrees
            },
            modelRef: 'lidar',
            priceList: 8000.00,
            isActive: true
        }
    })

    // 4. Depth Camera
    await prisma.component.create({
        data: {
            sku: 'CAM-RGBD-PRO',
            category: 'SENSOR',
            name: {
                zh: '专业RGBD深度相机',
                en: 'Pro RGBD Depth Camera'
            },
            specs: {
                weight: 0.3,
                dims: [0.12, 0.03, 0.03],
                power: 3, // W
                range: 10, // m
                fov_h: 87 // degrees
            },
            modelRef: 'camera',
            priceList: 1500.00,
            isActive: true
        }
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

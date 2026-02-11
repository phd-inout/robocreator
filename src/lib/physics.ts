
import { Part } from "@/types/store";
import {
    ComponentSpecs,
    ChassisSpecs,
    BatterySpecs,
    SensorSpecs,
    BaseSpecs
} from "@/types/specs";

interface PhysicsResult {
    totalWeight: number; // kg
    totalPowerDraw: number; // W

    // Status
    isValid: boolean;
    errors: string[]; // Error codes: ERR_OVERWEIGHT, ERR_POWER_LOW, etc.

    // Detailed analysis
    payloadUtilization: number; // %
    powerUtilization: number; // %
}

// Type Guards - Now using discriminators
function isChassis(specs: ComponentSpecs): specs is ChassisSpecs {
    return (specs as ChassisSpecs).type === 'chassis';
}

function isBattery(specs: ComponentSpecs): specs is BatterySpecs {
    return (specs as BatterySpecs).type === 'battery';
}

function isPowerConsumer(specs: ComponentSpecs): boolean {
    // Check if it has a 'power' property that contributes to draw
    return (
        (specs as any).type === 'sensor' ||
        (specs as any).type === 'actuator' ||
        (specs as any).type === 'compute'
    );
}

export function calculatePhysics(
    parts: Part[],
    requirements: { slope: number; environment: string }
): PhysicsResult {
    let totalWeight = 0;
    let totalPowerDraw = 0;

    let maxPayload = 0;
    let maxPowerOutput = 0;
    let maxClimbAngle = 0;

    let hasChassis = false;
    let hasBattery = false;

    // 1. Aggregation
    for (const part of parts) {
        // Safe access to specs
        const specs = part.specs;

        // Weight
        if (specs.weight) totalWeight += specs.weight;

        // Chassis Capabilities
        if (isChassis(specs)) {
            hasChassis = true;
            maxPayload += specs.max_payload || 0;
            maxClimbAngle = Math.max(maxClimbAngle, specs.climb_angle || 0);
        }

        // Battery Capabilities
        if (isBattery(specs)) {
            hasBattery = true;
            maxPowerOutput += specs.max_output || 0;
        }

        // Power Consumption (Sensors, Computers, Actuators)
        if (isPowerConsumer(specs)) {
            // We can safely cast to a type that has 'power' or check it
            // Since we know the types from the boolean check, let's access safely.
            // But typescript might need help.
            if ('power' in specs) {
                totalPowerDraw += (specs as any).power || 0;
            }
        }
    }

    // 2. Validation Logic
    const errors: string[] = [];

    // Payload Check
    // Distinct payload = Total Weight - (Weight of Chassis parts).
    const chassisWeight = parts
        .filter(p => isChassis(p.specs))
        .reduce((sum, p) => sum + p.specs.weight, 0);

    const currentPayload = totalWeight - chassisWeight;

    if (hasChassis && currentPayload > maxPayload) {
        errors.push("ERR_OVERWEIGHT");
    }

    // Power Check
    if (hasBattery && totalPowerDraw > maxPowerOutput) {
        errors.push("ERR_POWER_LOW");
    }

    // Slope Check (ODD)
    if (hasChassis && requirements.slope > maxClimbAngle) {
        errors.push("ERR_CLIMB_FAIL");
    }

    // Missing Core Components
    if (!hasChassis) errors.push("ERR_NO_CHASSIS");
    // (Optional: !hasBattery)

    return {
        totalWeight,
        totalPowerDraw,
        isValid: errors.length === 0,
        errors,
        payloadUtilization: maxPayload > 0 ? (currentPayload / maxPayload) * 100 : 0,
        powerUtilization: maxPowerOutput > 0 ? (totalPowerDraw / maxPowerOutput) * 100 : 0
    };
}

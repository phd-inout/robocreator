'use server';

import prisma from "@/lib/prisma";
import { ComponentSpecs } from "@/types/specs";
import { LocalizedString } from "@/types/i18n";
import { FALLBACK_COMPONENTS } from "@/data/fallback";

export interface ComponentData {
    id: string;
    sku: string;
    category: string;
    name: LocalizedString;
    description: LocalizedString | null;
    specs: ComponentSpecs;
    modelRef: string;
    thumbnail: string | null;
    priceList: number;
}

export async function getComponents(): Promise<ComponentData[]> {
    console.log("Using Offline Mode for Components");
    return FALLBACK_COMPONENTS;

    /* 
    // Temporary Disable DB for Offline Dev
    try {
        const components = await prisma.component.findMany({
            where: {
                isActive: true,
            },
        });

        return components.map((c) => ({
            id: c.id,
            sku: c.sku,
            category: c.category,
            name: c.name as LocalizedString,
            description: c.description as LocalizedString | null,
            specs: c.specs as unknown as ComponentSpecs,
            modelRef: c.modelRef,
            thumbnail: c.thumbnail,
            priceList: Number(c.priceList), // Convert Decimal to number for frontend
        }));

    } catch (error) {
        console.error("Failed to fetch components, using offline fallback:", error);
        return FALLBACK_COMPONENTS;
    }
    */
}

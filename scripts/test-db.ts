
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Connecting to database...");
    try {
        const componentCount = await prisma.component.count();
        console.log(`Successfully connected! Found ${componentCount} components.`);

        const firstComponent = await prisma.component.findFirst();
        if (firstComponent) {
            console.log("First component:", firstComponent.name);
        }
    } catch (e) {
        console.error("Connection failed:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();

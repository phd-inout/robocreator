"use client";

import { useDesignStore } from "@/store/useDesignStore";
import { ComponentData } from "@/actions/catalog";
import { getLocalizedText } from "@/types/i18n";
import { useLocale, useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ComponentLibraryProps {
    components: ComponentData[];
}

export default function ComponentLibrary({ components }: ComponentLibraryProps) {
    const { addPart, parts } = useDesignStore();
    const locale = useLocale();
    const t = useTranslations("EditorPage");

    const [searchQuery, setSearchQuery] = useState("");

    const handleQuickAdd = (comp: ComponentData) => {
        const offset = (Math.random() - 0.5) * 2;
        addPart({
            id: `part-${Date.now()}`,
            skuId: comp.sku,
            name: comp.name,
            category: comp.category,
            position: { x: offset, y: 0.5, z: offset },
            rotation: { x: 0, y: 0, z: 0 },
            specs: comp.specs,
            modelRef: comp.modelRef,
            price: comp.priceList,
        });
    };

    // Group components by category
    const groupedComponents = useMemo(() => {
        const groups: Record<string, ComponentData[]> = {};
        components.forEach(comp => {
            if (!groups[comp.category]) {
                groups[comp.category] = [];
            }
            if (!searchQuery ||
                getLocalizedText(comp.name, locale).toLowerCase().includes(searchQuery.toLowerCase()) ||
                comp.sku.toLowerCase().includes(searchQuery.toLowerCase())) {
                groups[comp.category].push(comp);
            }
        });
        return groups;
    }, [components, searchQuery, locale]);

    // Calculate total budget
    const totalBudget = useMemo(() => {
        return parts.reduce((sum, part) => {
            const comp = components.find(c => c.sku === part.skuId);
            return sum + (comp?.priceList || 0);
        }, 0);
    }, [parts, components]);

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            CHASSIS: "#3b82f6",
            SENSOR: "#ef4444",
            BATTERY: "#eab308",
            ACTUATOR: "#a855f7",
            COMPUTE: "#10b981",
            ACCESSORY: "#6b7280",
        };
        return colors[category] || "#6b7280";
    };

    const categories = ["CHASSIS", "SENSOR", "BATTERY", "ACTUATOR", "COMPUTE", "ACCESSORY"];

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 space-y-3">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {t("component_library")}
                </h2>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <Input
                        type="text"
                        placeholder={t("search_parts")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
                    />
                </div>
            </div>

            {/* Component Categories */}
            <ScrollArea className="flex-1">
                <Accordion type="multiple" defaultValue={["CHASSIS", "SENSOR", "BATTERY"]} className="w-full">
                    {categories.map((category) => (
                        groupedComponents[category] && groupedComponents[category].length > 0 && (
                            <AccordionItem key={category} value={category} className="border-slate-700">
                                <AccordionTrigger className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hover:bg-slate-800 hover:no-underline hover:text-white transition-colors">
                                    {t(`category_${category.toLowerCase()}`)}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="pb-2">
                                        {groupedComponents[category].map((comp) => (
                                            <button
                                                key={comp.id}
                                                onClick={() => handleQuickAdd(comp)}
                                                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-800 transition-colors group"
                                            >
                                                {/* Thumbnail */}
                                                <div
                                                    className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center"
                                                    style={{ backgroundColor: getCategoryColor(comp.category) + "20" }}
                                                >
                                                    <div
                                                        className="w-6 h-6 rounded"
                                                        style={{ backgroundColor: getCategoryColor(comp.category) }}
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 text-left min-w-0">
                                                    <p className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                                                        {getLocalizedText(comp.name, locale)}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs text-gray-500">{comp.specs.weight}kg</span>
                                                        <span className="text-xs text-gray-600">•</span>
                                                        <span className="text-xs text-gray-500">
                                                            {comp.specs.dims ? `${comp.specs.dims[0]}m` : "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    ))}
                </Accordion>
            </ScrollArea>

            {/* Budget Footer */}
            <div className="p-4 border-t border-slate-700 bg-slate-800">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">{t("part_budget")}</span>
                    <span className="text-sm font-semibold text-white">
                        ¥{totalBudget.toLocaleString()} / 50k
                    </span>
                </div>
                <Progress value={(totalBudget / 50000) * 100} className="h-1.5 bg-slate-700" indicatorClassName="bg-blue-500" />
            </div>
        </div>
    );
}

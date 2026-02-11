"use client";

import { useTranslations, useLocale } from "next-intl";
import { ComponentData } from "@/actions/catalog";
import { useDesignStore } from "@/store/useDesignStore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, Box, Layers } from "lucide-react";
import { getLocalizedText } from "@/types/i18n";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface SidebarProps {
    components: ComponentData[];
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LayersPanel from "./LayersPanel";

// ... imports

export default function Sidebar({ components }: SidebarProps) {
    const t = useTranslations("EditorPage");
    const locale = useLocale();
    const { addPart, parts } = useDesignStore();

    // Group components by category
    const groupedComponents = components.reduce((acc, comp) => {
        const cat = comp.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(comp);
        return acc;
    }, {} as Record<string, ComponentData[]>);

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
            price: Number(comp.priceList)
        });
    };

    const budget = Math.min((parts.length / 50) * 100, 100);

    return (
        <aside className="w-80 bg-[#0f172a] text-slate-50 flex flex-col h-full border-r border-slate-800 z-20 shadow-xl">
            {/* Header with Search (Only for components tab? Or global?) -> Let's keep search for components only or logic */}
            {/* Redesign Header */}

            <Tabs defaultValue="components" className="flex-1 flex flex-col overflow-hidden">
                <div className="p-2 border-b border-slate-800">
                    <TabsList className="w-full bg-slate-900 border border-slate-800">
                        <TabsTrigger value="components" className="flex-1 text-xs">{t('tab_components')}</TabsTrigger>
                        <TabsTrigger value="layers" className="flex-1 text-xs">{t('tab_layers')}</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="components" className="flex-1 flex flex-col min-h-0 mt-0">
                    <div className="p-3 border-b border-slate-800 space-y-2">
                        {/* Import Button */}
                        <div className="flex justify-end">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept=".glb,.gltf,.stl,.obj,.fbx"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        console.log('[Sidebar] File upload:', file.name);

                                        // 检测文件格式
                                        const fileName = file.name.toLowerCase();
                                        let format: 'glb' | 'stl' | 'obj' | 'fbx' = 'glb';
                                        if (fileName.endsWith('.stl')) format = 'stl';
                                        else if (fileName.endsWith('.obj')) format = 'obj';
                                        else if (fileName.endsWith('.fbx')) format = 'fbx';

                                        console.log('[Sidebar] Format:', format);

                                        const url = URL.createObjectURL(file);
                                        addPart({
                                            id: `custom-${Date.now()}`,
                                            skuId: "CUSTOM_UPLOAD",
                                            name: { zh: file.name, en: file.name },
                                            category: "ACCESSORY",
                                            position: { x: 0, y: 0.5, z: 0 },
                                            rotation: { x: 0, y: 0, z: 0 },
                                            specs: {
                                                dims: [1, 1, 1],
                                                weight: 1,
                                                sockets: [],
                                                type: 'accessory',
                                                modelFormat: format
                                            },
                                            modelRef: url,
                                            price: 0,
                                        });
                                    }}
                                />
                                <span className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition-colors flex items-center gap-1">
                                    + Model
                                </span>
                            </label>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder={t("search_parts")}
                                className="pl-9 bg-slate-900 border-slate-700 text-slate-50 placeholder:text-slate-500 focus-visible:ring-blue-500 h-9"
                            />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        <Accordion type="multiple" defaultValue={["CHASSIS", "SENSOR", "BATTERY"]} className="w-full">
                            {Object.entries(groupedComponents).map(([category, items]) => (
                                <AccordionItem value={category} key={category} className="border-slate-800 px-4">
                                    <AccordionTrigger className="text-xs font-bold text-slate-400 uppercase py-3 hover:text-white">
                                        {category}
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-4">
                                        <div className="grid gap-2">
                                            {items.map((comp) => (
                                                <div
                                                    key={comp.id}
                                                    onClick={() => handleQuickAdd(comp)}
                                                    className="group flex gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-blue-500/50 cursor-pointer transition-all active:scale-[0.98]"
                                                >
                                                    <div className="w-12 h-12 rounded bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0 overflow-hidden relative">
                                                        <div className="w-8 h-8 bg-slate-700 rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
                                                        <Box className="w-5 h-5 text-slate-500 absolute" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0 justify-center">
                                                        <span className="text-sm font-medium text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                                                            {getLocalizedText(comp.name, locale)}
                                                        </span>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
                                                                {comp.specs.weight || 0}kg
                                                            </span>
                                                            <span className="text-[10px] text-slate-500">
                                                                ¥{comp.priceList.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="layers" className="flex-1 min-h-0 mt-0">
                    <ScrollArea className="h-full">
                        <LayersPanel />
                    </ScrollArea>
                </TabsContent>
            </Tabs>

            {/* Footer: Budget */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-slate-400">{t("part_budget")}</span>
                    <span className="text-xs font-mono text-slate-300">{parts.length}/50</span>
                </div>
                <Progress value={budget} className="h-1.5 bg-slate-800" indicatorClassName="bg-blue-500" />
            </div>
        </aside>
    );
}

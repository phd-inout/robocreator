"use client";

import { useDesignStore } from "@/store/useDesignStore";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedText } from "@/types/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Battery, AlertTriangle } from "lucide-react";
import { recalculateSockets } from "@/utils/parametric";

// Mock Validation Radar Component
const ValidationRadar = () => {
    return (
        <div className="relative w-full aspect-square max-w-[200px] mx-auto my-4">
            {/* Background Grid */}
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" />
                <polygon points="50,10 90,40 75,90 25,90 10,40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>

            {/* Data Polygon (Mocked: High Durability, Medium Cost/Range) */}
            <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full drop-shadow-lg">
                <polygon
                    points="50,20 80,45 65,80 35,80 20,45"
                    fill="rgba(59, 130, 246, 0.2)"
                    stroke="#3b82f6"
                    strokeWidth="2"
                />
            </svg>

            {/* Labels */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground">Payload</div>
            <div className="absolute top-[35%] right-0 translate-x-1/4 text-[10px] font-medium text-muted-foreground">Range</div>
            <div className="absolute bottom-0 right-[15%] text-[10px] font-medium text-muted-foreground">Cost</div>
            <div className="absolute bottom-0 left-[15%] text-[10px] font-medium text-muted-foreground">AI</div>
            <div className="absolute top-[35%] left-0 -translate-x-1/4 text-[10px] font-medium text-muted-foreground">Durability</div>
        </div>
    );
};

export default function PropertiesPanel() {
    const t = useTranslations("EditorPage");
    const locale = useLocale();
    const { parts, selectedPartId, updatePart } = useDesignStore();

    const selectedPart = parts.find((p) => p.id === selectedPartId);

    // Mock functions for UI interactions
    const handleSpecChange = (key: string, value: any) => {
        if (!selectedPart) return;
        // In real app, this would update specific specs
        console.log("Update spec:", key, value);
    };

    return (
        <aside className="w-80 border-l bg-background h-full flex flex-col z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.1)]">

            {/* Top Section: Validation Status */}
            <div className="p-6 border-b flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("validation_status")}
                    </h3>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 hover:text-blue-700 p-0">
                        Re-run
                    </Button>
                </div>

                <Card className="bg-green-50 border-green-200 shadow-sm mb-4">
                    <CardContent className="p-3 flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                            <div className="text-sm font-semibold text-green-800">Physics Check Passed</div>
                            <div className="text-xs text-green-600 mt-0.5">Model is stable and manufacturable.</div>
                        </div>
                    </CardContent>
                </Card>

                <ValidationRadar />
            </div>

            {/* Bottom Section: Specs (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6">
                {selectedPart ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            {/* Icon based on category */}
                            <Battery className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-sm font-bold text-foreground">
                                {selectedPart.category} Specs
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {/* Dimensions Control */}
                            {selectedPart.specs.dims && (
                                <div className="space-y-3">
                                    <Label className="text-xs uppercase text-muted-foreground font-semibold">Dimensions (m)</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] text-muted-foreground">Length</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={selectedPart.specs.dims[0]}
                                                onChange={(e) => {
                                                    const newDims = [...selectedPart.specs.dims!] as [number, number, number];
                                                    newDims[0] = parseFloat(e.target.value);
                                                    const newSockets = recalculateSockets(selectedPart, newDims);
                                                    updatePart(selectedPart.id, {
                                                        specs: { ...selectedPart.specs, dims: newDims, sockets: newSockets }
                                                    });
                                                }}
                                                className="h-7 text-xs font-mono px-2"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] text-muted-foreground">Width</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={selectedPart.specs.dims[1]}
                                                onChange={(e) => {
                                                    const newDims = [...selectedPart.specs.dims!] as [number, number, number];
                                                    newDims[1] = parseFloat(e.target.value);
                                                    const newSockets = recalculateSockets(selectedPart, newDims);
                                                    updatePart(selectedPart.id, {
                                                        specs: { ...selectedPart.specs, dims: newDims, sockets: newSockets }
                                                    });
                                                }}
                                                className="h-7 text-xs font-mono px-2"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] text-muted-foreground">Height</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={selectedPart.specs.dims[2]}
                                                onChange={(e) => {
                                                    const newDims = [...selectedPart.specs.dims!] as [number, number, number];
                                                    newDims[2] = parseFloat(e.target.value);
                                                    const newSockets = recalculateSockets(selectedPart, newDims);
                                                    updatePart(selectedPart.id, {
                                                        specs: { ...selectedPart.specs, dims: newDims, sockets: newSockets }
                                                    });
                                                }}
                                                className="h-7 text-xs font-mono px-2"
                                            />
                                        </div>
                                    </div>
                                    <Separator />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-xs uppercase text-muted-foreground font-semibold">Model</Label>
                                <select
                                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    defaultValue="default"
                                >
                                    <option value="default">{getLocalizedText(selectedPart.name, locale)}</option>
                                    <option value="pro">Pro Version (Disabled)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Voltage (V)</Label>
                                    <Input defaultValue="48.0" className="h-8 font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Capacity (mAh)</Label>
                                    <Input defaultValue="12000" className="h-8 font-mono" />
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between">
                                    <Label className="text-xs">Weight</Label>
                                    <span className="text-xs font-mono text-muted-foreground">
                                        {selectedPart.specs.weight || 0}kg
                                    </span>
                                </div>
                                <slider
                                    defaultValue={[Number(selectedPart.specs.weight) || 5]}
                                    max={50}
                                    step={0.1}
                                />
                            </div>

                            <Separator className="my-4" />

                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Display Charge</Label>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Thermal Protection</Label>
                                <Switch />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                        <AlertTriangle className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-sm">Select a component to view detailed specs.</p>
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t bg-background">
                <Button variant="outline" className="w-full">
                    View Datasheet
                </Button>
            </div>
        </aside>
    );
}

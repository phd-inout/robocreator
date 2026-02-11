"use client";

import { MousePointer2, Move, RotateCw, Grid3x3, Maximize2, Eye, Ruler } from "lucide-react";
import { useState } from "react";
import { useDesignStore } from "@/store/useDesignStore";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CanvasToolbar() {
    const {
        selectedPartId,
        parts,
        transformMode,
        setTransformMode,
        selectPart,
        showFOV,
        showDimensions
    } = useDesignStore();

    const selectedPart = parts.find(p => p.id === selectedPartId);

    const tools = [
        { id: "select", icon: MousePointer2, label: "Select (V)", mode: null }, // distinct from transform
        { id: "translate", icon: Move, label: "Move (M)", mode: "translate" },
        { id: "rotate", icon: RotateCw, label: "Rotate (R)", mode: "rotate" },
    ];

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {/* Tool Buttons */}
            <div className="flex items-center bg-background/80 backdrop-blur-md rounded-lg border shadow-sm p-1">
                <ToggleGroup
                    type="single"
                    value={transformMode || "select"}
                    onValueChange={(val: string) => {
                        if (val === "select") setTransformMode(null);
                        else if (val) setTransformMode(val as any);
                    }}
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ToggleGroupItem value="select" aria-label="Select">
                                    <MousePointer2 size={18} />
                                </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent><p>Select (V)</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ToggleGroupItem value="translate" aria-label="Move">
                                    <Move size={18} />
                                </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent><p>Move (M)</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ToggleGroupItem value="rotate" aria-label="Rotate">
                                    <RotateCw size={18} />
                                </ToggleGroupItem>
                            </TooltipTrigger>
                            <TooltipContent><p>Rotate (R)</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </ToggleGroup>


                <Separator orientation="vertical" className="h-6 mx-1" />

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle aria-label="Toggle Grid">
                                <Grid3x3 size={18} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Toggle Grid</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                aria-label="Toggle FOV"
                                pressed={showFOV}
                                onPressedChange={(pressed) => {
                                    useDesignStore.setState({ showFOV: pressed });
                                }}
                            >
                                <Eye size={18} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Show FOV Cones</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                aria-label="Toggle Dimensions"
                                pressed={showDimensions}
                                onPressedChange={(pressed) => {
                                    useDesignStore.setState({ showDimensions: pressed });
                                }}
                            >
                                <Ruler size={18} />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Show Dimensions</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Coordinate Display */}
            {selectedPart && (
                <div className="bg-background/80 backdrop-blur-md rounded-lg border px-3 py-2 shadow-sm">
                    <span className="text-xs font-mono text-muted-foreground">
                        XYZ: <span className="text-foreground">
                            {selectedPart.position.x.toFixed(2)},
                            {selectedPart.position.y.toFixed(2)},
                            {selectedPart.position.z.toFixed(2)}
                        </span>
                    </span>
                </div>
            )}
        </div>
    );
}

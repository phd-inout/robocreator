"use client";

import { useDesignStore } from "@/store/useDesignStore";
import { Part } from "@/types/store";
import { ChevronRight, ChevronDown, Cuboid, Box, Component } from "lucide-react";
import { useState } from "react";
import { useLocale } from "next-intl";
import { getLocalizedText } from "@/types/i18n";
import { cn } from "@/lib/utils";

interface TreeNodeProps {
    part: Part;
    level: number;
    allParts: Part[];
    onSelect: (id: string) => void;
    selectedId: string | null;
}

function TreeNode({ part, level, allParts, onSelect, selectedId }: TreeNodeProps) {
    const [expanded, setExpanded] = useState(true);
    const locale = useLocale();

    const children = allParts.filter(p => p.parentId === part.id);
    const hasChildren = children.length > 0;
    const isSelected = selectedId === part.id;

    return (
        <div>
            <div
                className={cn(
                    "flex items-center py-1 px-2 cursor-pointer hover:bg-slate-800/50 text-sm group",
                    isSelected ? "bg-blue-900/30 text-blue-400" : "text-slate-300"
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(part.id);
                }}
            >
                {/* Expand Toggle */}
                <div
                    className="w-4 h-4 mr-1 flex items-center justify-center cursor-pointer hover:text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                >
                    {hasChildren && (
                        expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                    )}
                </div>

                {/* Icon */}
                <Component className="w-3 h-3 mr-2 opacity-70" />

                {/* Name */}
                <span className="truncate select-none flex-1">
                    {getLocalizedText(part.name, locale)}
                </span>
            </div>

            {/* Children */}
            {expanded && children.map(child => (
                <TreeNode
                    key={child.id}
                    part={child}
                    level={level + 1}
                    allParts={allParts}
                    onSelect={onSelect}
                    selectedId={selectedId}
                />
            ))}
        </div>
    );
}

export default function LayersPanel() {
    const { parts, selectedPartId, selectPart } = useDesignStore();

    // Find root nodes (no parent)
    const rootParts = parts.filter(p => !p.parentId);

    return (
        <div className="flex flex-col h-full bg-[#0f172a]">
            {parts.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-xs mt-10">
                    No components
                </div>
            ) : (
                <div className="py-2">
                    {rootParts.map(part => (
                        <TreeNode
                            key={part.id}
                            part={part}
                            level={0}
                            allParts={parts}
                            onSelect={selectPart}
                            selectedId={selectedPartId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

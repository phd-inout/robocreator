"use client";

import CanvasArea from "@/components/editor/CanvasArea";
import Sidebar from "@/components/editor/Sidebar";
import PropertiesPanel from "@/components/editor/PropertiesPanel";
import TopNavBar from "@/components/editor/TopNavBar";
import { useTranslations } from "next-intl";
import { ComponentData } from "@/actions/catalog";
import { MousePointer2, Move, Rotate3D, Scaling, Grid3X3, Settings2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDesignStore } from "@/store/useDesignStore";

interface EditorClientProps {
    components: ComponentData[];
}

export default function EditorClient({ components }: EditorClientProps) {
    const t = useTranslations("EditorPage");
    const { transformMode, setTransformMode } = useDesignStore();

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
            {/* Top Navigation */}
            <TopNavBar />

            {/* Main Workspace */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar (Dark) */}
                <Sidebar components={components} />

                {/* Center Canvas (Dark) */}
                <main className="relative flex-1 h-full min-w-0 bg-[#020617]">
                    <CanvasArea />

                    {/* Floating Toolbar */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1e293b]/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-700/50 shadow-xl flex items-center gap-1">
                        <ToggleGroup type="single" value={transformMode || "select"} onValueChange={(v) => {
                            if (v === "select") setTransformMode(null);
                            else if (v) setTransformMode(v as any);
                        }}>
                            <ToggleGroupItem value="select" aria-label="Select" className="h-8 w-8 text-slate-400 data-[state=on]:bg-blue-600 data-[state=on]:text-white hover:bg-slate-700 hover:text-white">
                                <MousePointer2 className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="translate" aria-label="Translate" className="h-8 w-8 text-slate-400 data-[state=on]:bg-blue-600 data-[state=on]:text-white hover:bg-slate-700 hover:text-white">
                                <Move className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="rotate" aria-label="Rotate" className="h-8 w-8 text-slate-400 data-[state=on]:bg-blue-600 data-[state=on]:text-white hover:bg-slate-700 hover:text-white">
                                <Rotate3D className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="scale" aria-label="Scale" className="h-8 w-8 text-slate-400 data-[state=on]:bg-blue-600 data-[state=on]:text-white hover:bg-slate-700 hover:text-white">
                                <Scaling className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>

                        <div className="w-px h-5 bg-slate-700 mx-1" />

                        <button className="h-8 w-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                            <Grid3X3 className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Transform Info Overlay */}
                    <div className="absolute top-4 right-4 bg-[#1e293b]/80 backdrop-blur text-xs font-mono text-slate-400 px-3 py-1.5 rounded border border-slate-700">
                        XYZ: 12.4, 0.0, 5.2
                    </div>

                    {/* Gizmo Placeholder (Bottom Left) */}
                    <div className="absolute bottom-4 left-4 w-20 h-20 pointer-events-none">
                        {/* This would be a real 3D gizmo ViewCube in R3F, visualized here as placeholder */}
                        <div className="w-12 h-1 px-1 relative">
                            <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-red-500 origin-left" />
                            <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-green-500 origin-left -rotate-90" />
                            <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-blue-500 origin-left -rotate-45" />
                            <span className="absolute bottom-[-10px] right-[-10px] text-[8px] text-red-500">X</span>
                            <span className="absolute top-[-35px] left-[-5px] text-[8px] text-green-500">Y</span>
                        </div>
                    </div>
                </main>

                {/* Right Properties Panel (Light) */}
                <PropertiesPanel />
            </div>
        </div>
    );
}

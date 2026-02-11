"use client";

import CanvasArea from "@/components/editor/CanvasArea";
import ComponentLibrary from "@/components/editor/ComponentLibrary";
import ValidationPanel from "@/components/editor/ValidationPanel";
import TopNavBar from "@/components/editor/TopNavBar";
import KeyboardShortcuts from "@/components/editor/KeyboardShortcuts";
import { ComponentData } from "@/actions/catalog";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorClientProps {
    components: ComponentData[];
}

export default function EditorClient({ components }: EditorClientProps) {
    const [rightPanelOpen, setRightPanelOpen] = useState(true);

    return (
        <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
            {/* Top Navigation Bar */}
            <TopNavBar />

            <KeyboardShortcuts />

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Component Library (Dark Theme) */}
                <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
                    <ComponentLibrary components={components} />
                </aside>

                {/* Center - 3D Canvas */}
                <main className="flex-1 relative bg-slate-800">
                    <CanvasArea />

                    {/* Toggle Button for Right Panel */}
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20">
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => setRightPanelOpen(!rightPanelOpen)}
                            className="bg-background/80 backdrop-blur-sm shadow-lg border hover:bg-background"
                            title={rightPanelOpen ? "隐藏面板" : "显示面板"}
                        >
                            <ChevronRight
                                size={20}
                                className={`transition-transform duration-300 ${rightPanelOpen ? "rotate-0" : "rotate-180"}`}
                            />
                        </Button>
                    </div>
                </main>

                {/* Right Sidebar - Validation & Properties (Light Theme) */}
                <aside className={`bg-background flex flex-col shadow-xl border-l transition-all duration-300 ${rightPanelOpen ? "w-80 overflow-y-auto" : "w-0 overflow-hidden"
                    }`}>
                    <ValidationPanel />
                </aside>
            </div>
        </div>
    );
}

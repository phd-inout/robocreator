"use client";

import { useDesignStore } from "@/store/useDesignStore";
import { Box } from "lucide-react";

export default function ViewCube() {
    const { cameraView, setCameraView } = useDesignStore();

    const views = [
        { id: 'top', label: 'T', position: 'top-0 left-1/2 -translate-x-1/2', angle: 0 },
        { id: 'right', label: 'R', position: 'right-0 top-1/2 -translate-y-1/2', angle: 90 },
        { id: 'back', label: 'B', position: 'bottom-0 left-1/2 -translate-x-1/2', angle: 180 },
        { id: 'front', label: 'F', position: 'left-0 top-1/2 -translate-y-1/2', angle: 270 },
    ];

    return (
        <div className="absolute bottom-6 right-6 z-10">
            {/* Circular Container */}
            <div className="relative w-24 h-24 bg-background/80 backdrop-blur-md rounded-full border shadow-lg">
                {/* Center Button (Perspective) */}
                <button
                    onClick={() => setCameraView('perspective')}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${cameraView === 'perspective'
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                    title="Perspective View"
                >
                    <Box size={16} />
                </button>

                {/* Directional Segments */}
                {views.map((view) => (
                    <button
                        key={view.id}
                        onClick={() => setCameraView(view.id as any)}
                        className={`absolute ${view.position} w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${cameraView === view.id
                                ? 'bg-blue-500 text-white shadow-md scale-110'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-105'
                            }`}
                        title={`${view.label === 'T' ? 'Top' : view.label === 'F' ? 'Front' : view.label === 'R' ? 'Right' : 'Back'} View`}
                    >
                        {view.label}
                    </button>
                ))}

                {/* Connecting Lines (Visual Guide) */}
                <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-600" opacity="0.3" />
                    <line x1="48" y1="8" x2="48" y2="28" stroke="currentColor" strokeWidth="1" className="text-slate-600" opacity="0.3" />
                    <line x1="88" y1="48" x2="68" y2="48" stroke="currentColor" strokeWidth="1" className="text-slate-600" opacity="0.3" />
                    <line x1="48" y1="88" x2="48" y2="68" stroke="currentColor" strokeWidth="1" className="text-slate-600" opacity="0.3" />
                    <line x1="8" y1="48" x2="28" y2="48" stroke="currentColor" strokeWidth="1" className="text-slate-600" opacity="0.3" />
                </svg>
            </div>
        </div>
    );
}

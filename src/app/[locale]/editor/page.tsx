"use client";

import CanvasArea from "@/components/editor/CanvasArea";
import ComponentLibrary from "@/components/editor/ComponentLibrary";
import { useTranslations } from "next-intl";

export default function EditorPage() {
    const t = useTranslations("EditorPage");

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Sidebar - Placeholder for components library */}
            <aside className="w-80 border-r bg-white p-4 flex flex-col gap-4 shadow-sm z-10">
                <h2 className="text-xl font-bold">{t("tools")}</h2>
                <div className="flex-1 overflow-y-auto">
                    <p className="text-sm text-gray-500 mb-4">{t("sidebar_desc")}</p>
                    <ComponentLibrary />
                </div>
            </aside>

            {/* Main Design Area */}
            <main className="relative flex-1">
                <CanvasArea />

                {/* Overlay UI - Top bar for validation status */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border shadow-lg flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-medium">{t("status_ok")}</span>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <button className="text-sm font-semibold hover:text-blue-600 transition-colors">
                        {t("export")}
                    </button>
                </div>
            </main>
        </div>
    );
}

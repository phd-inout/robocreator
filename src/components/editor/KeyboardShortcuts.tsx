
"use client";

import { useEffect } from "react";
import { useDesignStore } from "@/store/useDesignStore";

export default function KeyboardShortcuts() {
    const { setTransformMode, removePart, selectedPartId, selectPart } = useDesignStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case "v":
                    setTransformMode(null);
                    break;
                case "m":
                    setTransformMode("translate");
                    break;
                case "r":
                    setTransformMode("rotate");
                    break;
                case "delete":
                case "backspace":
                    if (selectedPartId) {
                        removePart(selectedPartId);
                        selectPart(null);
                    }
                    break;
                case "escape":
                    selectPart(null);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setTransformMode, removePart, selectedPartId, selectPart]);

    return null;
}

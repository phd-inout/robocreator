"use client";

import { useEffect, useRef } from "react";
import { Trash2, Copy, RotateCw, Settings } from "lucide-react";
import { useTranslations } from "next-intl";

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onRotate: () => void;
    onProperties: () => void;
}

export default function ContextMenu({
    x,
    y,
    onClose,
    onDelete,
    onDuplicate,
    onRotate,
    onProperties,
}: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("EditorPage");

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    const menuItems = [
        {
            icon: Copy,
            label: t("duplicate"),
            onClick: onDuplicate,
            color: "text-blue-600",
        },
        {
            icon: RotateCw,
            label: t("rotate_90"),
            onClick: onRotate,
            color: "text-green-600",
        },
        {
            icon: Settings,
            label: t("properties"),
            onClick: onProperties,
            color: "text-gray-600",
        },
        {
            icon: Trash2,
            label: t("delete"),
            onClick: onDelete,
            color: "text-red-600",
            divider: true,
        },
    ];

    return (
        <div
            ref={menuRef}
            className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[180px]"
            style={{
                left: `${x}px`,
                top: `${y}px`,
            }}
        >
            {menuItems.map((item, index) => (
                <div key={index}>
                    {item.divider && <div className="h-px bg-gray-200 my-1" />}
                    <button
                        onClick={() => {
                            item.onClick();
                            onClose();
                        }}
                        className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 transition-colors ${item.color}`}
                    >
                        <item.icon size={16} />
                        <span className="text-sm font-medium">{item.label}</span>
                    </button>
                </div>
            ))}
        </div>
    );
}

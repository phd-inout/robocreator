"use client";

import { useDesignStore } from "@/store/useDesignStore";

export default function StoreTest() {
    const { parts, addPart, removePart, updatePart } = useDesignStore();

    const handleAdd = () => {
        addPart({
            id: "part-" + Date.now(),
            type: "box",
            position: { x: Math.random() * 10, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            specs: {},
        });
    };

    return (
        <div className="p-4 border rounded shadow-md m-4">
            <h2 className="text-xl font-bold mb-2">Store Verification</h2>
            <div className="flex gap-2 mb-4">
                <button
                    onClick={handleAdd}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Random Part
                </button>
            </div>
            <div className="bg-gray-100 p-2 rounded max-h-60 overflow-auto">
                <pre className="text-xs">{JSON.stringify(parts, null, 2)}</pre>
            </div>
            {parts.length > 0 && (
                <div className="mt-2 flex gap-2">
                    <button
                        onClick={() => removePart(parts[parts.length - 1].id)}
                        className="text-red-500 text-sm hover:underline"
                    >
                        Remove Last
                    </button>
                </div>
            )}
        </div>
    );
}

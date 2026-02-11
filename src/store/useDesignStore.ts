import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { DesignState, Part } from '@/types/store';

export const useDesignStore = create<DesignState>()(
    immer((set) => ({
        parts: [],
        selectedPartId: null,
        requirements: {
            slope: 0,
            environment: "indoor",
            ground: "smooth"
        },

        addPart: (part: Part) =>
            set((state) => {
                state.parts.push(part);
            }),

        updatePart: (id: string, updates: Partial<Part>) =>
            set((state) => {
                const part = state.parts.find((p) => p.id === id);
                if (part) {
                    Object.assign(part, updates);
                }
            }),

        removePart: (id: string) =>
            set((state) => {
                state.parts = state.parts.filter((p) => p.id !== id);
                if (state.selectedPartId === id) {
                    state.selectedPartId = null;
                }
            }),

        selectPart: (id: string | null) =>
            set((state) => {
                state.selectedPartId = id;
            }),

        reparentPart: (childId: string, newParentId: string | null) =>
            set((state) => {
                if (childId === newParentId) return; // Cannot parent to self

                // Check for circular dependency
                let current = state.parts.find((p) => p.id === newParentId);
                while (current) {
                    if (current.id === childId) {
                        console.warn("Circular dependency detected");
                        return;
                    }
                    current = state.parts.find((p) => p.id === current?.parentId);
                }

                const part = state.parts.find((p) => p.id === childId);
                if (part) {
                    part.parentId = newParentId || undefined;
                    // Reset socket compatibility if unparented? Or keep as is?
                    // For now, simple reparenting.
                }
            }),

        transformMode: "translate",
        setTransformMode: (mode) =>
            set((state) => {
                state.transformMode = mode;
            }),
    }))
);

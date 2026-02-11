import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { DesignState, Part } from '@/types/store';

export const useDesignStore = create<DesignState>()(
    immer((set) => ({
        parts: [],
        selectedPartId: null,

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

        transformMode: "translate",
        setTransformMode: (mode) =>
            set((state) => {
                state.transformMode = mode;
            }),
    }))
);

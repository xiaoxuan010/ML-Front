import { defineStore } from "pinia";

export const useSelectedFileStore = defineStore("selectedFile", {
    state: () => ({
        selectedFile: null as File | null,
    }),
    getters: {
        isNull: (state) => state.selectedFile === null,
    },
    actions: {
        set(file: File) {
            this.selectedFile = file;
        },
        clear() {
            this.selectedFile = null;
        },
    },
});

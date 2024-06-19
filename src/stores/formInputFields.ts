import { defineStore } from "pinia";

export const useFormInputFieldsStore = defineStore("selectedFile", {
    state: () => ({
        selectedFile: null as File | null,
        targetField: "OT" as string,
        predictDays: 20 as number,
    }),
});

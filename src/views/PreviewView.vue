<script setup lang="ts">
import PreviewChart from "@/components/PreviewChart.vue";
import { useFormInputFieldsStore } from "@/stores/formInputFields";
import type { Snackbar } from "mdui";
import Papa from "papaparse";
import { storeToRefs } from "pinia";
import prettyBytes from "pretty-bytes";
import { onActivated, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

type ML_X = {
    date: string;
    HUFL: number;
    HULL: number;
    MUFL: number;
    MULL: number;
    LUFL: number;
    LULL: number;
};

const formInputFieldsStore = useFormInputFieldsStore();
const { selectedFile } = storeToRefs(formInputFieldsStore);

const data = ref<ML_X[]>([]);

const uploadGuide = ref<Snackbar | null>(null);
const parseErrorSnack = ref<Snackbar | null>(null);

async function parseFile() {
    return new Promise<void>((resolve) => {
        if (selectedFile.value !== null) {
            if (uploadGuide.value) {
                uploadGuide.value.open = false;
            }
            Papa.parse<ML_X>(selectedFile.value, {
                dynamicTyping: true,
                complete: (results) => {
                    data.value = results.data;
                    resolve();
                },
                error: (error) => {
                    console.error(error);
                    if (parseErrorSnack.value) {
                        parseErrorSnack.value.open = true;
                    } else {
                        console.error("Snackbar not initialized");
                        alert(
                            "解析 CSV 文件失败，请检查您的文件是否符合要求。"
                        );
                    }
                    resolve();
                },
            });
        } else {
            console.debug("No file selected");
            setTimeout(() => {
                if (uploadGuide.value) {
                    uploadGuide.value.open = true;
                } else {
                    console.error("Snackbar not initialized");
                    alert("请完成前置操作：上传文件");
                }
                resolve();
            }, 0);
        }
    });
}

onActivated(parseFile);

onBeforeRouteLeave(() => {
    if (uploadGuide.value) {
        uploadGuide.value.open = false;
    }
    if (parseErrorSnack.value) {
        parseErrorSnack.value.open = false;
    }
});
</script>

<template>
    <main class="container mdui-prose">
        <h1>数据预览</h1>

        <div class="selected-file-display" v-if="selectedFile !== null">
            <mdui-chip icon="dns">文件名：{{ selectedFile.name }}</mdui-chip>
            <mdui-chip icon="straighten"
                >大小：{{ prettyBytes(selectedFile.size) }}</mdui-chip
            >
        </div>

        <PreviewChart :data></PreviewChart>
    </main>
    <mdui-snackbar
        ref="uploadGuide"
        action="上传文件"
        auto-close-delay="0"
        @action-click="$router.push('/upload')"
        >请先完成前置操作</mdui-snackbar
    >
    <mdui-snackbar
        ref="parseErrorSnack"
        action="重新上传"
        auto-close-delay="0"
        @action-click="$router.push('/upload')"
        >解析 CSV 文件失败</mdui-snackbar
    >
</template>

<style scoped lang="scss">
.selected-file-display {
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;

    mdui-chip {
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }
}
</style>

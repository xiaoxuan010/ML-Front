<script setup lang="ts">
import PreviewChart from "@/components/PreviewChart.vue";
import { useSelectedFileStore } from "@/stores/selectedFile";
import type { Snackbar } from "mdui";
import Papa from "papaparse";
import prettyBytes from "pretty-bytes";
import { onMounted, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

type ML_X = {
    date: string;
    HUFL: number;
    HULL: number;
    MUFL: number;
    MULL: number;
    LUFL: number;
    LULL: number;
};

const selectedFileStore = useSelectedFileStore();
const selectedFile = selectedFileStore.selectedFile;

const data = ref<ML_X[]>([]);

const uploadGuide = ref<Snackbar | null>(null);

function parseFile() {
    if (selectedFile !== null) {
        Papa.parse<ML_X>(selectedFile, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                data.value = results.data;
            },
        });
    } else {
        console.debug("No file selected");
        setTimeout(() => {
            if (uploadGuide.value) {
                uploadGuide.value.open = true;
            } else {
                console.error("Snackbar not initialized");
            }
        }, 0);
    }
}

onMounted(parseFile);
onBeforeRouteUpdate(parseFile);
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

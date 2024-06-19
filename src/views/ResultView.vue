<script setup lang="ts">
import PredictionChart from "@/components/PredictionChart.vue";
import { useSelectedFileStore } from "@/stores/selectedFile";
import axios from "axios";
import type { Snackbar } from "mdui";
import { computed, onMounted, ref } from "vue";

const selectedFileStore = useSelectedFileStore();
const selectedFile = selectedFileStore.selectedFile;

type ResultData = {
    index: string;
    val: number;
};

const resultData = ref<ResultData[]>([]);

const uploadGuide = ref<Snackbar | null>(null);

const API_PERFIX = "http://127.0.0.1:5000";

function getResultData() {
    if (selectedFile !== null) {
        let formData = new FormData();
        formData.append("file", selectedFile);
        axios
            .post("/api/predict", formData, {
                baseURL: API_PERFIX,
            })
            .then((response) => {
                resultData.value = response.data.result;
                // console.debug(resultData.value);
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

onMounted(() => {
    getResultData();
});
</script>

<template>
    <main class="container mdui-prose">
        <h1>预测结果</h1>
        <div>
            <p>根据您上传的数据，系统给出以下预测：</p>
        </div>
        <PredictionChart :data="resultData"></PredictionChart>
    </main>
    <mdui-snackbar
        ref="uploadGuide"
        action="上传文件"
        auto-close-delay="0"
        @action-click="$router.push('/upload')"
        >请先完成前置操作</mdui-snackbar
    >
</template>

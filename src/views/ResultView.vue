<script setup lang="ts">
import PredictionChart from "@/components/PredictionChart.vue";
import { useFormInputFieldsStore } from "@/stores/formInputFields";
import axios from "axios";
import type { Dialog, Snackbar } from "mdui";
import { storeToRefs } from "pinia";
import { onActivated, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const formInputFieldsStore = useFormInputFieldsStore();
const formInputFields = storeToRefs(formInputFieldsStore);

type ResultData = {
    index: string;
    val: number;
};

const resultData = ref<ResultData[]>([]);
const resultDataError = ref<string | null>(null);
const resultErrorTitle = ref<string>("数据分析失败");

const uploadGuide = ref<Snackbar | null>(null);
const errorDialog = ref<Dialog | null>(null);

const API_PERFIX = "http://localhost:5000";

function getResultData() {
    if (formInputFields.selectedFile.value !== null) {
        if (uploadGuide.value) {
            uploadGuide.value.open = false;
        } else {
            console.warn("Snackbar not initialized");
        }

        resultData.value = [];

        let formData = new FormData();
        formData.append("file", formInputFields.selectedFile.value);
        formData.append("target", formInputFields.targetField.value);
        formData.append("days", formInputFields.predictDays.value.toString());
        axios
            .post("/api/predict", formData, {
                baseURL: API_PERFIX,
            })
            .then((res) => {
                if (res.data?.code !== 0) {
                    resultData.value = [];
                    resultErrorTitle.value = `数据分析失败：代码${res.data.code}`;
                    resultDataError.value = res.data.msg;
                    if (errorDialog.value) {
                        errorDialog.value.open = true;
                    } else {
                        console.error("Dialog not initialized");
                        alert("数据分析失败，请检查您的数据是否符合要求。");
                    }
                } else {
                    resultData.value = res.data.result;
                }
            })
            .catch((e) => {
                console.error(e);
                resultData.value = [];
                resultErrorTitle.value = "网络请求失败";
                resultDataError.value = e.toString();
                if (errorDialog.value) {
                    errorDialog.value.open = true;
                } else {
                    console.error("Dialog not initialized");
                    alert("网络请求失败，请检查您的网络连接。");
                }
            });
    } else {
        console.debug("No file selected");
        setTimeout(() => {
            if (uploadGuide.value) {
                uploadGuide.value.open = true;
            } else {
                console.error("Snackbar not initialized");
                alert("请先完成前置操作：上传文件");
            }
        }, 0);
    }
}

onActivated(() => {
    console.debug("ResultView activated");
    getResultData();
});

onBeforeRouteLeave(() => {
    if (uploadGuide.value) {
        uploadGuide.value.open = false;
    }
    if (errorDialog.value) {
        errorDialog.value.open = false;
    }
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
    <mdui-dialog
        icon="error"
        :headline="resultErrorTitle"
        close-on-overlay-click
        close-on-esc
        ref="errorDialog"
    >
        <p slot="description">错误信息：{{ resultDataError }}</p>
        <mdui-button
            slot="action"
            variant="text"
            @click="($refs.errorDialog as Dialog).open = false"
            >好的</mdui-button
        >
        <mdui-button
            slot="action"
            variant="tonal"
            @click="$router.push('/upload')"
            >重新上传</mdui-button
        >
    </mdui-dialog>
</template>

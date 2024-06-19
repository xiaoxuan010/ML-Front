<script setup lang="ts">
import { useFormInputFieldsStore } from "@/stores/formInputFields";
import { Card, type Snackbar } from "mdui";
import Papa from "papaparse";
import { storeToRefs } from "pinia";
import prettyBytes from "pretty-bytes";
import { ref, watch } from "vue";

const fileInput = ref<HTMLInputElement | null>(null);

const warningSnackbar = ref<Snackbar | null>(null);
const warningSnackbarText = ref<string>("");

const showWarningSnackbar = (text: string) => {
    console.debug("Showing warning snackbar: ", text);
    if (warningSnackbar.value) {
        warningSnackbarText.value = text;
        warningSnackbar.value.open = true;
    } else {
        console.error("Snackbar not initialized");
    }
};

const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    } else {
        console.error("File input not initialized");
    }
};

const fileUploadCard = ref<Card | null>(null);
const selectedFileStore = useFormInputFieldsStore();
const selectedFileHeaders = ref<string[]>([]);

const { selectedFile, targetField, predictDays } =
    storeToRefs(selectedFileStore);

const handleFileSelected = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (files === null || files.length === 0) {
        showWarningSnackbar("未选择文件");
    } else if (files.length > 1) {
        showWarningSnackbar("只能上传一个文件");
    } else {
        selectedFile.value = files[0];
    }
};

watch(selectedFile, (file) => {
    if (file !== null) {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            preview: 2,
            complete: (results) => {
                selectedFileHeaders.value = results.meta.fields ?? [];

                if (selectedFileHeaders.value.length === 0) {
                    showWarningSnackbar(
                        "文件解析失败，请检查您的文件是否符合要求。"
                    );
                } else {
                    console.debug("File headers: ", selectedFileHeaders.value);
                    targetField.value =
                        selectedFileHeaders.value.at(-1) ?? "OT";
                }
            },
            error: (error) => {
                console.warn(error);
                showWarningSnackbar(
                    "解析文件失败，请检查您的文件是否符合要求。"
                );
            },
        });
    }
});

const clearFileSelection = () => {
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = "";
};

const isDragEnter = ref(false);

const createPointerEvent = (type: string) =>
    new PointerEvent(type, {
        pointerId: 1,
        pointerType: "mouse",
    });

const dragEnterPrevent = (e: DragEvent) => {
    e.preventDefault();
    isDragEnter.value = true;

    fileUploadCard.value?.dispatchEvent(createPointerEvent("pointerenter"));
};
const dragOverPrevent = (e: DragEvent) => {
    // console.debug("Drag over event: ", e);
    e.preventDefault();
};
const dragLeavePrevent = (e: DragEvent) => {
    e.preventDefault();
    isDragEnter.value = false;
    fileUploadCard.value?.dispatchEvent(createPointerEvent("pointerleave"));
};
const dropPrevent = (e: DragEvent) => {
    e.preventDefault();

    isDragEnter.value = false;
    const dataTransfer = e.dataTransfer;
    const files = dataTransfer?.files;

    if (files === undefined || files.length === 0) {
        showWarningSnackbar("未选择文件");
    } else if (files.length > 1) {
        showWarningSnackbar("只能上传一个文件");
    } else {
        const file = files[0];
        if (file.type !== "text/csv") {
            showWarningSnackbar("输入格式有误，请选择 CSV 文件");
        } else {
            selectedFile.value = files[0];
        }
        // console.debug("File: ", file);
    }
};
</script>

<template>
    <main class="container mdui-prose">
        <h1>上传数据</h1>
        <div>
            <p>在这里上传需要预测的数据，以供系统分析。</p>
        </div>

        <form
            action="/api/upload"
            method="post"
            enctype="multipart/form-data"
            class="mdui-form"
        >
            <div class="file-upload-filed">
                <mdui-card
                    clickable
                    variant="outlined"
                    class="file-upload-card"
                    ref="fileUploadCard"
                    @click="triggerFileInput"
                    @dragenter="dragEnterPrevent"
                    @dragover="dragOverPrevent"
                    @dragleave="dragLeavePrevent"
                    @drop="dropPrevent"
                >
                    <mdui-icon
                        :name="isDragEnter ? 'upload_file' : 'file_present'"
                        class="card-theme-icon"
                    ></mdui-icon>
                    <p v-if="isDragEnter">松开鼠标以上传该文件</p>
                    <p v-else>
                        将文件拖动到此处或<strong>点击选择文件</strong>
                    </p>
                </mdui-card>

                <input
                    type="file"
                    name="file"
                    id="fileInput"
                    ref="fileInput"
                    accept=".csv"
                    style="display: none"
                    @change="handleFileSelected"
                />
            </div>
        </form>
        <table class="selected-file-table mdui-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>文件名</th>
                    <th>大小</th>
                    <th>目标字段</th>
                    <th>预测天数</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="selectedFile !== null">
                    <th>1</th>
                    <th>{{ selectedFile.name }}</th>
                    <th>{{ prettyBytes(selectedFile.size) }}</th>
                    <th>
                        <mdui-text-field
                            variant="outlined"
                            type="text"
                            :value="targetField"
                            @input="targetField = $event.target.value"
                        ></mdui-text-field>
                    </th>
                    <th>
                        <mdui-text-field
                            variant="outlined"
                            type="number"
                            :value="predictDays"
                            @input="predictDays = parseInt($event.target.value)"
                        ></mdui-text-field>
                    </th>
                    <th class="actions">
                        <mdui-button icon="close" @click="clearFileSelection"
                            >移除</mdui-button
                        >
                        <mdui-button
                            icon="preview"
                            @click="$router.push('/preview')"
                            >预览</mdui-button
                        >
                        <mdui-button
                            icon="query_stats"
                            @click="$router.push('/result')"
                            >预测</mdui-button
                        >
                    </th>
                </tr>
                <tr v-else>
                    <td colspan="6" class="null-file-warning">
                        暂未选择文件……
                    </td>
                </tr>
            </tbody>
        </table>
    </main>

    <mdui-snackbar ref="warningSnackbar">{{
        warningSnackbarText
    }}</mdui-snackbar>
</template>

<style scoped lang="scss">
.mdui-form {
    .input-title {
        .required-marker {
            color: rgb(var(--mdui-color-primary));
        }
    }

    .file-upload-card {
        // width: 30rem;
        max-width: 100%;

        height: 10rem;
        max-height: 50vh;

        margin: 1rem 0;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        & * {
            pointer-events: none;
        }

        .card-theme-icon {
            font-size: 180%;
        }
    }
}

.selected-file-display {
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;

    mdui-chip {
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }
}

.selected-file-table {
    td.null-file-warning {
        text-align: center;
        padding: 1rem;
        color: #999;
    }

    th.actions {
        display: flex;
        gap: 0.5rem;
    }
}
</style>

<script lang="ts">
import { RouterView } from "vue-router";

export default {
    components: {
        RouterView,
    },
    computed: {
        // The current route object
        routeId: {
            get() {
                return this.$route.name?.toString().split("-")[0];
            },
            set(val: String) {
                this.$router.push({ path: "/" + val });
            },
        },
    },
};
</script>

<template>
    <mdui-navigation-rail
        label-visibility="selected"
        :value="routeId"
        @change="routeId = $event.target.value"
    >
        <mdui-navigation-rail-item value="upload" icon="upload"
            >上传</mdui-navigation-rail-item
        >
        <mdui-navigation-rail-item value="preview" icon="table_view"
            >预览</mdui-navigation-rail-item
        >
        <mdui-navigation-rail-item value="result" icon="show_chart"
            >预测</mdui-navigation-rail-item
        >
    </mdui-navigation-rail>

    <mdui-layout-main>
        <div class="main">
            <KeepAlive>
                <RouterView></RouterView>
            </KeepAlive>
        </div>
    </mdui-layout-main>
</template>

<style scoped></style>

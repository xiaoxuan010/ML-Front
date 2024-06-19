import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "",
            redirect: { name: "upload" },
        },
        {
            path: "/upload",
            name: "upload",
            component: () => import("@/views/UploadView.vue"),
        },
        {
            path: "/preview",
            name: "preview",
            component: () => import("@/views/PreviewView.vue"),
        },
        {
            path: "/result",
            name: "result",
            component: () => import("@/views/ResultView.vue"),
        },
    ],
});

export default router;

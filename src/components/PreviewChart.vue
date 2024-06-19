<script setup lang="ts">
import { computed } from "vue";

import type { LineSeriesOption } from "echarts/charts";
import { LineChart } from "echarts/charts";
import type {
    DatasetComponentOption,
    GridComponentOption,
    LegendComponentOption,
    TooltipComponentOption,
} from "echarts/components";
import {
    DatasetComponent,
    GridComponent,
    LegendComponent,
    ToolboxComponent,
    TooltipComponent,
} from "echarts/components";
import type { ComposeOption } from "echarts/core";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

use([
    LegendComponent,
    TooltipComponent,
    DatasetComponent,
    GridComponent,
    LineChart,
    CanvasRenderer,
    ToolboxComponent,
]);

type EChartsOption = ComposeOption<
    | LegendComponentOption
    | TooltipComponentOption
    | DatasetComponentOption
    | GridComponentOption
    | LineSeriesOption
    | ToolboxComponentOption
>;

import type { ToolboxComponentOption } from "echarts";
import VChart from "vue-echarts";

const props = defineProps<{
    data: Array<{
        date: string;
        HUFL: number;
        HULL: number;
        MUFL: number;
        MULL: number;
        LUFL: number;
        LULL: number;
    }>;
}>();

const option = computed<EChartsOption>(() => ({
    legend: {
        top: "bottom",
    },
    grid: {
        left: 30,
        right: 25,
        bottom: 40,
        top: 20,
        containLabel: true,
    },
    tooltip: {
        trigger: "axis",
        confine: true,
        // formatter: tooltipFormatter,
    },
    toolbox: {
        show: true,
        feature: {
            saveAsImage: {
                show: true,
                title: "保存图片",
                name: "数据预览",
            },
        },
    },
    dataset: {
        source: props.data,
    },
    xAxis: {
        type: "category",
        boundaryGap: false,
    },
    yAxis: {
        type: "value",
        min: (val) => (val.min - 2).toFixed(0),
    },
    series: [
        {
            type: "line",
            name: "HUFL",
            smooth: true,
            symbol: "circle",
            showSymbol: false,
            sampling: "lttb",
            encode: { x: 0, y: 1 },
        },
        {
            type: "line",
            name: "HULL",
            smooth: true,
            symbol: "circle",
            sampling: "lttb",
            showSymbol: false,
            encode: { x: 0, y: 2 },
        },
        {
            type: "line",
            name: "MUFL",
            smooth: true,
            symbol: "circle",
            sampling: "lttb",
            showSymbol: false,
            encode: { x: 0, y: 3 },
        },
        {
            type: "line",
            name: "MULL",
            smooth: true,
            symbol: "circle",
            sampling: "lttb",
            showSymbol: false,
            encode: { x: 0, y: 4 },
        },
        {
            type: "line",
            name: "LUFL",
            smooth: true,
            symbol: "circle",
            sampling: "lttb",
            showSymbol: false,
            encode: { x: 0, y: 5 },
        },
        {
            type: "line",
            name: "LULL",
            smooth: true,
            symbol: "circle",
            sampling: "lttb",
            showSymbol: false,
            encode: { x: 0, y: 6 },
        },
    ],
}));
</script>

<template>
    <v-chart
        class="chart"
        id="chart"
        ref="chart"
        :option="option"
        :autoresize="true"
        :loading="data.length === 0"
    />
</template>

<style scoped>
#chart {
    width: 100%;
    height: 20rem;
}
</style>

<style lang="scss">
div.tooltip-content {
    padding: 0 0.4rem;

    div.tooltip-title {
        text-align: center;
        margin-bottom: 0.2rem;
    }

    div.tooltip-line {
        height: 1.4rem;
        span {
            display: inline-block;
            margin-bottom: 0;
        }

        span.line-subtitle {
            width: 5rem;
            text-align: left;
        }

        span.line-value {
            width: 3rem;
            text-align: right;
            font-weight: bold;
        }
    }
}
</style>

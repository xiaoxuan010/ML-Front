<script setup lang="ts">
import { computed } from "vue";

import type { LineSeriesOption } from "echarts/charts";
import { LineChart } from "echarts/charts";
import type {
    DatasetComponentOption,
    GridComponentOption,
    LegendComponentOption,
    ToolboxComponentOption,
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
    ToolboxComponent,
    CanvasRenderer,
]);

type EChartsOption = ComposeOption<
    | LegendComponentOption
    | TooltipComponentOption
    | DatasetComponentOption
    | GridComponentOption
    | LineSeriesOption
    | ToolboxComponentOption
>;

import VChart from "vue-echarts";

const props = defineProps<{
    data: Array<{
        index: string;
        val: number;
    }>;
}>();

const option = computed<EChartsOption>(() => {
    // console.log("Props data: ", props.data);
    return {
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
                    name: "预测结果",
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
                name: "零件期货价格",
                smooth: true,
                symbol: "circle",
                showSymbol: false,
                encode: { x: 0, y: 1 },
            },
        ],
    };
});
</script>

<template>
    <v-chart
        class="chart"
        id="chart"
        ref="chart"
        :option="option"
        :autoresize="true"
        :loading="props.data.length === 0"
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

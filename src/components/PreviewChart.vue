<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import {
    LegendComponent,
    TooltipComponent,
    DatasetComponent,
    GridComponent,
} from "echarts/components";
import { SVGRenderer } from "echarts/renderers";
import type { ComposeOption } from "echarts/core";
import type { LineSeriesOption } from "echarts/charts";
import type {
    LegendComponentOption,
    TooltipComponentOption,
    DatasetComponentOption,
    GridComponentOption,
} from "echarts/components";

use([
    LegendComponent,
    TooltipComponent,
    DatasetComponent,
    GridComponent,
    LineChart,
    SVGRenderer,
]);

type EChartsOption = ComposeOption<
    | LegendComponentOption
    | TooltipComponentOption
    | DatasetComponentOption
    | GridComponentOption
    | LineSeriesOption
>;

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

// let valKeys = ["HUFL", "HULL", "MUFL", "MULL", "LUFL", "LULL"];

// function tooltipFormatter(params: any) {
//     let datetime = new Date(params[0].name);
//     let dtStr =
//         datetime.getFullYear() +
//         "年" +
//         (datetime.getMonth() + 1) +
//         "月" +
//         datetime.getDate() +
//         "日" +
//         " " +
//         datetime.getHours() +
//         "时";

//     return (
//         `<div class="tooltip-content"><div class="tooltip-line tooltip-title"><span> ` +
//         dtStr +
//         "</span></div>" +
//         (params
//             .map((param: any) => {
//                 return `<div class="tooltip-line"><span class="line-subtitle">${param.marker}零件期货单价</span><span class="line-value">${
//                     param.value[valKeys[param.seriesIndex]]
//                 }元</span></div>`;
//             })
//             .join("") +
//             "</div>")
//     );
// }

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

<script setup lang="ts">
import { computed } from "vue";

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

// import vintage from "@/config/vintage.json";

// import { THEME_KEY } from "vue-echarts";

// registerTheme("vintage", vintage);
// provide(THEME_KEY, "vintage");

const props = defineProps<{
    data: Array<{
        index: string;
        val: number;
    }>;
}>();

// let valKeys = ["val"];

// function tooltipFormatter(params: any) {
//     // let datetime = new Date(params[0].name);
//     // let dtStr =
//     //     datetime.getFullYear() +
//     //     "年" +
//     //     (datetime.getMonth() + 1) +
//     //     "月" +
//     //     datetime.getDate() +
//     //     "日" +
//     //     " " +
//     //     datetime.getHours() +
//     //     "时";

//     return (
//         `<div class="tooltip-content"><div class="tooltip-line tooltip-title"><span> ` +
//         // dtStr +
//         "</span></div>" +
//         (params
//             .map((param: any) => {
//                 return `<div class="tooltip-line"><span class="line-subtitle">${param.marker}零件期货单价</span><span class="line-value">${param.value[1].toFixed(
//                     2
//                 )}元</span></div>`;
//             })
//             .join("") +
//             "</div>")
//     );
// }

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

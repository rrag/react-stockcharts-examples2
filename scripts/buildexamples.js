
const path = require("path");
const fse = require("fs-extra");
// const replaceStream = require("replacestream");

const base = path.join(__dirname, "..");

const args = process.argv.slice(2);
const mode = args[0];

const index = `
import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';
import { getData } from "./utils"

import { TypeChooser } from "react-stockcharts/lib/helper";


class ChartComponent extends React.Component {
	componentDidMount() {
		getData().then(data => {
			this.setState({ data })
		})
	}
	render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
			<TypeChooser>
				{type => <Chart type={type} data={this.state.data} />}
			</TypeChooser>
		)
	}
}

render(
	<ChartComponent />,
	document.getElementById("root")
);
`
const parseData = `
import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		return d;
	};
}
`
const endOfDayMSFT = `
${parseData}
const parseDate = timeParse("%Y-%m-%d");

export function getData() {
	const promiseMSFT = fetch("//rrag.github.io/react-stockcharts/data/MSFT.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)))
	return promiseMSFT;
}
`
const continuous = `
${parseData}
const parseDateTime = timeParse("%Y-%m-%d %H:%M:%S");

export function getData() {
	const promiseIntraDayContinuous = fetch("//rrag.github.io/react-stockcharts/data/bitfinex_xbtusd_1m.csv")
		.then(response => response.text())
		.then(data => csvParse(data, parseData(parseDateTime)))
		.then(data => {
			data.sort((a, b) => {
				return a.date.valueOf() - b.date.valueOf();
			});
			return data;
		});
	return promiseIntraDayContinuous;
}
`

const discontinuous = `
${parseData}

export function getData() {
	const promiseIntraDayDiscontinuous = fetch("//rrag.github.io/react-stockcharts/data/MSFT_INTRA_DAY.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(d => new Date(+d))));
	return promiseIntraDayDiscontinuous;
}
`
const comparison = `
${parseData}
const parseDate = timeParse("%Y-%m-%d");

export function getData() {
	const promiseCompare = fetch("//rrag.github.io/react-stockcharts/data/comparison.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, d => {
			d = parseData(parseDate)(d);
			d.SP500Close = +d.SP500Close;
			d.AAPLClose = +d.AAPLClose;
			d.GEClose = +d.GEClose;
			return d;
		}));
	return promiseCompare;
}
`
const bubbleData = `
${parseData}

export function getData() {
	const promiseBubbleData = fetch("//rrag.github.io/react-stockcharts/data/bubble.json")
		.then(response => response.json());
	return promiseBubbleData;
}
`

const barData = `
${parseData}

export function getData() {
	const promiseBarData = fetch("//rrag.github.io/react-stockcharts/data/barData.json")
		.then(response => response.json());
	return promiseBarData;
}
`

const horizontalBarData = `
${parseData}

export function getData() {
	const promiseBarData = fetch("//rrag.github.io/react-stockcharts/data/barData.json")
		.then(response => response.json())
		.then(barData => barData.map(({ x, y }) => ({ x: y, y: x })));

	return promiseBarData;
}
`

const groupedBarData = `
${parseData}

export function getData() {
	const promiseBarData = fetch("//rrag.github.io/react-stockcharts/data/groupedBarData.json")
		.then(response => response.json());
	return promiseBarData;
}
`
const horizontalGroupedBarData = `
${parseData}

export function getData() {
	const promiseBarData = fetch("//rrag.github.io/react-stockcharts/data/groupedBarData.json")
		.then(response => response.json())
		.then(groupedBarData => {
			return groupedBarData.map(d => {
				return {
					y: d.x,
					x1: d.y1,
					x2: d.y2,
					x3: d.y3,
					x4: d.y4,
				};
			});
		});
	return promiseBarData;
}
`

const examplesToPublish = [
	{ name: "AreaChart", files: [], utils: endOfDayMSFT },
	{ name: "AreaChartWithYPercent", files: [], utils: endOfDayMSFT },
	{ name: "AreaChartWithZoomPan", files: [], utils: endOfDayMSFT },
	{ name: "BarChart", files: [], utils: barData },
	{ name: "BubbleChart", files: [], utils: bubbleData },
	{ name: "CandleStickChartForContinuousIntraDay", files: [], utils: continuous },
	{ name: "CandleStickChartForDiscontinuousIntraDay", files: [], utils: discontinuous },
	{ name: "CandleStickChart", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartPanToLoadMore", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithAnnotation", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithBollingerBandOverlay", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithBrush", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithCHMousePointer", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithClickHandlerCallback", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithCompare", files: [], utils: comparison },
	{ name: "CandleStickChartWithDarkTheme", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithEdge", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithEquidistantChannel", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithFibonacciInteractiveIndicator", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithForceIndexIndicator", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithFullStochasticsIndicator", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithGannFan", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithHoverTooltip", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithInteractiveIndicator", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithMACDIndicator", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithMA", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithPriceMarkers", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithRSIIndicator", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithSAR", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithStandardDeviationChannel", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithUpdatingData", files: [ "CandleStickChartWithMACDIndicator", "updatingDataWrapper" ], utils: endOfDayMSFT },
	{ name: "CandleStickChartWithZoomPan", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickStockScaleChart", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickStockScaleChartWithVolumeBarV1", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickStockScaleChartWithVolumeBarV2", files: [], utils: endOfDayMSFT },
	{ name: "CandleStickStockScaleChartWithVolumeBarV3", files: [], utils: endOfDayMSFT },
	{ name: "GroupedBarChart", files: [], utils: groupedBarData },
	{ name: "HeikinAshi", files: [], utils: endOfDayMSFT },
	{ name: "HorizontalBarChart", files: [], utils: horizontalBarData },
	{ name: "HorizontalStackedBarChart", files: [], utils: horizontalGroupedBarData },
	{ name: "Kagi", files: [], utils: endOfDayMSFT },
	{ name: "KagiWithUpdatingData", files: [ "Kagi", "updatingDataWrapper" ], utils: endOfDayMSFT },
	{ name: "LineAndScatterChartGrid", files: [], utils: endOfDayMSFT },
	{ name: "LineAndScatterChart", files: [], utils: endOfDayMSFT },
	{ name: "MovingAverageCrossOverAlgorithmV1", files: [], utils: endOfDayMSFT },
	{ name: "MovingAverageCrossOverAlgorithmV2", files: [], utils: endOfDayMSFT },
	{ name: "OHLCChartWithElderImpulseIndicator", files: [], utils: endOfDayMSFT },
	{ name: "OHLCChartWithElderRayIndicator", files: [], utils: endOfDayMSFT },
	{ name: "PointAndFigure", files: [], utils: endOfDayMSFT },
	{ name: "PointAndFigureWithUpdatingData", files: [ "PointAndFigure", "updatingDataWrapper" ], utils: endOfDayMSFT },
	{ name: "Renko", files: [], utils: endOfDayMSFT },
	{ name: "RenkoWithUpdatingData", files: [ "Renko", "updatingDataWrapper" ], utils: endOfDayMSFT },
	{ name: "StackedBarChart", files: [], utils: endOfDayMSFT },
	{ name: "VolumeProfileBySessionChart", files: [], utils: endOfDayMSFT },
	{ name: "VolumeProfileChart", files: [], utils: endOfDayMSFT },
];

const srcDir = path.join(base, "..", "react-stockcharts", "docs", "lib", "charts")
const template = path.join(base, "scripts", "template")
const templatePackage = path.join(base, "scripts", "templatePackage")

examplesToPublish.forEach(publish)

async function remove(example) {
	const destDir = path.join(base, "examples", example.name)
	await fse.remove(destDir)
}

async function publish(example) {
	const destDir = path.join(base, "examples", example.name)

	await fse.ensureDir(destDir)
	await fse.copy(template, destDir)

	await fse.copy(
		path.join(templatePackage, "package.json"),
		path.join(destDir, "package.json"),
	)
	await fse.copy(
		path.join(templatePackage, "package-lock.json"),
		path.join(destDir, "package-lock.json"),
	)

	await fse.ensureSymlink(
		path.join(templatePackage, "node_modules"),
		path.join(destDir, "node_modules"),
	)

	const destExample = path.join(destDir, "src", "Chart.js")
	const srcExample = path.join(srcDir, `${example.name}.js`)

	await fse.copy(srcExample, destExample)

	await fse.outputFile(
		path.join(destDir, "src", "index.js"),
		index
	)

	await fse.outputFile(
		path.join(destDir, "src", "utils.js"),
		example.utils,
	)

	example.files.forEach(each => {
		fse.copy(
			path.join(srcDir, `${each}.js`),
			path.join(destDir, "src", `${each}.js`),
		)
	})
}
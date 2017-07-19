
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

const utils = `
import { tsvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";

const parseDate = timeParse("%Y-%m-%d");

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

export function getData() {
	const promiseMSFT = fetch("//rrag.github.io/react-stockcharts/data/MSFT.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)))
	return promiseMSFT;
}
`

const examplesToPublish = [
	{ name: "AreaChart", files: [] },
	{ name: "AreaChartWithYPercent", files: [] },
	{ name: "AreaChartWithZoomPan", files: [] },
	{ name: "BarChart", files: [] },
	{ name: "BubbleChart", files: [] },
	{ name: "CandleStickChartForContinuousIntraDay", files: [] },
	{ name: "CandleStickChartForDiscontinuousIntraDay", files: [] },
	{ name: "CandleStickChart", files: [] },
	{ name: "CandleStickChartPanToLoadMore", files: [] },
	{ name: "CandleStickChartWithAnnotation", files: [] },
	{ name: "CandleStickChartWithBollingerBandOverlay", files: [] },
	{ name: "CandleStickChartWithBrush", files: [] },
	{ name: "CandleStickChartWithCHMousePointer", files: [] },
	{ name: "CandleStickChartWithClickHandlerCallback", files: [] },
	{ name: "CandleStickChartWithCompare", files: [] },
	{ name: "CandleStickChartWithDarkTheme", files: [] },
	{ name: "CandleStickChartWithEdge", files: [] },
	{ name: "CandleStickChartWithEquidistantChannel", files: [] },
	{ name: "CandleStickChartWithFibonacciInteractiveIndicator", files: [] },
	{ name: "CandleStickChartWithForceIndexIndicator", files: [] },
	{ name: "CandleStickChartWithFullStochasticsIndicator", files: [] },
	{ name: "CandleStickChartWithGannFan", files: [] },
	{ name: "CandleStickChartWithHoverTooltip", files: [] },
	{ name: "CandleStickChartWithInteractiveIndicator", files: [] },
	{ name: "CandleStickChartWithMACDIndicator", files: [] },
	{ name: "CandleStickChartWithMA", files: [] },
	{ name: "CandleStickChartWithPriceMarkers", files: [] },
	{ name: "CandleStickChartWithRSIIndicator", files: [] },
	{ name: "CandleStickChartWithSAR", files: [] },
	{ name: "CandleStickChartWithStandardDeviationChannel", files: [] },
	{ name: "CandleStickChartWithUpdatingData", files: [ "CandleStickChartWithMACDIndicator", "updatingDataWrapper" ] },
	{ name: "CandleStickChartWithZoomPan", files: [] },
	{ name: "CandleStickStockScaleChart", files: [] },
	{ name: "CandleStickStockScaleChartWithVolumeBarV1", files: [] },
	{ name: "CandleStickStockScaleChartWithVolumeBarV2", files: [] },
	{ name: "CandleStickStockScaleChartWithVolumeBarV3", files: [] },
	{ name: "GroupedBarChart", files: [] },
	{ name: "HeikinAshi", files: [] },
	{ name: "HorizontalBarChart", files: [] },
	{ name: "HorizontalStackedBarChart", files: [] },
	{ name: "Kagi", files: [] },
	{ name: "KagiWithUpdatingData", files: [ "Kagi", "updatingDataWrapper" ] },
	{ name: "LineAndScatterChartGrid", files: [] },
	{ name: "LineAndScatterChart", files: [] },
	{ name: "MovingAverageCrossOverAlgorithmV1", files: [] },
	{ name: "MovingAverageCrossOverAlgorithmV2", files: [] },
	{ name: "OHLCChartWithElderImpulseIndicator", files: [] },
	{ name: "OHLCChartWithElderRayIndicator", files: [] },
	{ name: "PointAndFigure", files: [] },
	{ name: "PointAndFigureWithUpdatingData", files: [ "PointAndFigure", "updatingDataWrapper" ] },
	{ name: "Renko", files: [] },
	{ name: "RenkoWithUpdatingData", files: [ "Renko", "updatingDataWrapper" ] },
	{ name: "StackedBarChart", files: [] },
	{ name: "VolumeProfileBySessionChart", files: [] },
	{ name: "VolumeProfileChart", files: [] },
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
	const srcExample = path.join(srcDir, `${example.name}.jsx`)

	await fse.copy(srcExample, destExample)

	await fse.outputFile(
		path.join(destDir, "src", "index.js"),
		index
	)

	await fse.outputFile(
		path.join(destDir, "src", "utils.js"),
		utils
	)

	example.files.forEach(each => {
		fse.copy(
			path.join(srcDir, `${each}.jsx`),
			path.join(destDir, "src", `${each}.js`),
		)
	})
}
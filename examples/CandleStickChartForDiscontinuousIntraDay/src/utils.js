

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


export function getData() {
	const promiseIntraDayDiscontinuous = fetch("//rrag.github.io/react-stockcharts/data/MSFT_INTRA_DAY.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(d => new Date(+d))));
	return promiseIntraDayDiscontinuous;
}

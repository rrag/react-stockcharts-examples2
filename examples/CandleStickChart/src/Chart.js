
import React from "react";
import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { utcHour } from "d3-time";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";

const colorLoader = d => (d.close > d.open && '#00C300') || '#FF3300'

const candlesAppearance = {
  wickStroke: colorLoader,
  fill:colorLoader,
  stroke: colorLoader,
  candleStrokeWidth: 1,
  widthRatio: 0.3,
  opacity: 0.9,
}

class CandleStickChart extends React.Component {
  render() {
    const { type, width, data, ratio } = this.props;
    const xAccessor = d => d.date;
    const xExtents = [
      xAccessor(last(data)),
      xAccessor(data[0])
    ];
    return (
      <ChartCanvas height={400}
          ratio={ratio}
          width={width}
          margin={{ left: 100, right: 100, top: 20, bottom: 30 }}
          type={type}
          seriesName="MSFT"
          data={data}
          xAccessor={xAccessor}
          xScale={scaleTime()}
          xExtents={xExtents}>
        <Chart id={1} yExtents={d => [d.high, d.low]}>
          <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
          <YAxis axisAt="right" orient="right" ticks={5} />
          <CandlestickSeries width={timeIntervalBarWidth(utcHour)} {...candlesAppearance}/>
        </Chart>
      </ChartCanvas>
    );
  }
}

CandleStickChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChart.defaultProps = {
  type: "svg",
};
CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;

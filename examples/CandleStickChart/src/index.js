
import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';

import { TypeChooser } from "react-stockcharts/lib/helper";



const ChartComponent = ({ data = mockData }) => (
  <Chart data={data} type="canvas" />
);

render(
  <ChartComponent />,
  document.getElementById("root")
);

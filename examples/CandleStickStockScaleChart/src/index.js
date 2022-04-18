import React from "react";
import { render } from "react-dom";
import Chart from "./Chart";
import { getData } from "./utils";
import "./style.css";

import { TypeChooser } from "react-stockcharts/lib/helper";

class ChartComponent extends React.Component {
  componentDidMount() {
    getData().then((data) => {
      this.setState({ data });
    });
  }
  render() {
    if (this.state == null) {
      return <div>Loading...</div>;
    }
    return (
      <TypeChooser>
        {(type) => (
          <Chart
            style="background: #333 !important"
            type={type}
            data={this.state.data}
          />
        )}
      </TypeChooser>
    );
  }
}

render(<ChartComponent />, document.getElementById("root"));

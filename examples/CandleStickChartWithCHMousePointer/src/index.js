
import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';
import { getData } from "./utils"
import './index.css';


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
		return (<div>
			<p className="text">What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
 It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
 It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
 </p>
			<TypeChooser>
				
				{type => <Chart type={type} data={this.state.data} />}
			</TypeChooser>
			<p className="text">What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
 It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
 It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
 </p>
 <button>Button #1</button>
			</div>
		)
	}
}

render(
	<ChartComponent />,
	document.getElementById("root")
);

import React, { Component } from 'react';
import * as d3 from 'd3v4';
import ReactFauxDOM from 'react-faux-dom';

export default class NewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: []
    }
  }

  // componentDidMount () {
  //   const faux = this.props.connectFauxDOM('div', 'chart')
  //   console.log('faux ', faux);
  //   // console.log('faux ', faux.nodes());
  //   d3.select(faux)
  //     .data([1,2])
  //     .append('div')
  //     .html("heyhey")
  //   this.props.animateFauxDOM(800)
  // }

  render() {
    // Set units, margin, sizes
    var margin = { top: 10, right: 0, bottom: 10, left: 20 };
    var width = 690 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    // Initialize and append the svg canvas to faux-DOM
    // var svgNode = new ReactFauxDOM.Element('div');
    var svgNode = ReactFauxDOM.createElement('div');

    var svg = d3.select(svgNode)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    // .append("g")
    //  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var nodes_data = [
      { "name": "Travis", "sex": "M" },
      { "name": "Rake", "sex": "M" },
      { "name": "Diana", "sex": "F" },
      { "name": "Rachel", "sex": "F" },
      { "name": "Shawn", "sex": "M" },
      { "name": "Emerald", "sex": "F" }
    ]

    //set up the simulation 
    //nodes only for now 
    var simulation = d3.forceSimulation()
      //add nodes
      .nodes(nodes_data);

    //add forces
    //we're going to add a charge to each node 
    //also going to add a centering force
    simulation
      .force("charge_force", d3.forceManyBody())
      .force("center_force", d3.forceCenter(width / 2, height / 2));

    //draw circles for the nodes 
    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes_data)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", "red");

    console.log('node: ', node);

    // ==================================
    //WORKS UP TO HERE


    //add tick instructions: 
    simulation.on("tick", tickActions);

    //Time for the links 

    //Create links data 
    var links_data = [
      { "source": "Travis", "target": "Rake" },
      { "source": "Diana", "target": "Rake" },
      { "source": "Diana", "target": "Rachel" },
      { "source": "Rachel", "target": "Rake" },
      { "source": "Rachel", "target": "Shawn" },
      { "source": "Emerald", "target": "Rachel" }
    ]

    //Create the link force 
    //We need the id accessor to use named sources and targets 

    var link_force = d3.forceLink(links_data)
      .id(function (d) {
        return d.name;
      })


    //Add a links force to the simulation
    //Specify links  in d3.forceLink argument   


    simulation.force("links", link_force)

    //draw lines for the links 
    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links_data)
      .enter().append("line")
      .attr("stroke-width", 2);

    function tickActions() {
      //update circle positions each tick of the simulation 
      node
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        });

      //update link positions 
      //simply tells one end of the line to follow one node around
      //and the other end of the line to follow the other node around
      link
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });
    }


    return (
      <div>
        <div className="pseudo-form">
          <label>
            Id:
            <input type="text" name="id" ref={input => this.myId = input} />
          </label><br />
          <label>
            Join:
            <input type="text" name="join" ref={input => this.myJoin = input} />
          </label><br />
          <button type="button" onClick={this.addItem}>Submit</button>
        </div>
        {svgNode.toReact()}
        <p>{this.state.id}</p>
      </div>
    )
  }

  addItem = (event) => {
    console.log('event: ', event.target);
    console.log('id: ', this.myId.value);
    console.log('id: ', this.myJoin.value);
    this.state.arr.push({ id: this.myId.value, join: this.myJoin.value })
    console.log(this.state)
    // takes object as arg
    // this.setState({id: this.state.id + 1, join: 2})
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("form submitted: ", event.target[0].value);
  }
}

NewComponent.defaultProps = {
  chart: 'loading'
}

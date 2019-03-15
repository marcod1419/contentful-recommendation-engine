import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Button, Select, Option } from "@contentful/forma-36-react-components";
import { init } from "contentful-ui-extensions-sdk";
import "@contentful/forma-36-react-components/dist/styles.css";
import ReferenceCardWithRating from "../ReferenceCardWithRating/ReferenceCardWithRating";
//import "./index.css";

class RecommendationView extends React.Component {

  state = { 
    filter: 'marketing',
    selectedBlock: undefined
  }
  componentDidMount() {
    console.log(JSON.stringify(this.props.blocks));
  }

  onFilterChange = (event) => {
    this.setState({ filter: event.currentTarget.value });
  }

  onBlockSelected = (id) => {
    this.setState({ selectedBlock: id });
  }

  render = () => {

    let renderedBlocks = this.props.blocks.filter(b => b.entry.type === this.state.filter);

    
    return (
      <div>
        <Select
      id="optionSelect"
      name="optionSelect"
      onChange={this.onFilterChange}
    >
      <Option value="marketing">Marketing</Option>
      <Option value="product">Product</Option>
      <Option value="other">Other</Option>
    </Select>
        {
          renderedBlocks.map((b) => {
            return <ReferenceCardWithRating key={b.entry.id} rating={b.relevance} type={"marketing"} title={"my block type"} onClick={() => this.onBlockSelected(b.entry.id)}/>
          })
        }
        <Button onClick={() => this.props.onDone({ entryId: this.state.selectedBlock })}>Done</Button>

      </div>
    );
  };
}

export default RecommendationView;

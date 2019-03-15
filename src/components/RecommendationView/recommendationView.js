import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import {
  Button,
  Select,
  Option,
  TextInput,
  Paragraph,
  Pill
} from "@contentful/forma-36-react-components";
import { init } from "contentful-ui-extensions-sdk";
import "@contentful/forma-36-react-components/dist/styles.css";
import ReferenceCardWithRating from "../ReferenceCardWithRating/ReferenceCardWithRating";
import "./recommendationView.css";

class RecommendationView extends React.Component {
  state = {
    filter: "marketing",
    selectedBlock: undefined
  };
  componentDidMount() {
    console.log(JSON.stringify(this.props.blocks));
  }

  onFilterChange = event => {
    this.setState({ filter: event.currentTarget.value });
  };

  onBlockSelected = id => {
    this.setState({ selectedBlock: id });
  };

  render = () => {
    let renderedBlocks = this.props.blocks.filter(
      b => b.entry.type === this.state.filter
    );

    return (
      <div className="recContainer">
        <Paragraph>Search for entries</Paragraph>
        <div className="filterBar">
          <div className="inputContainer">
            <Pill label="Page Type" />
            <Select
              id="optionSelect"
              name="optionSelect"
              onChange={this.onFilterChange}
              width="medium"
            >
              <Option value="marketing">Marketing</Option>
              <Option value="product">Product</Option>
              <Option value="other">Other</Option>
            </Select>
          </div>
          <div className="inputContainer">
            <Pill label="Filter By Name" />
            <TextInput name="search" id="search" width="medium" />
          </div>
        </div>
        <div className="blockSelector">
          {renderedBlocks.map(b => {
            return (
              <div className="blockCard">
                <ReferenceCardWithRating
                  key={b.entry.id}
                  rating={b.relevance}
                  type={"marketing"}
                  title={"my block type"}
                  selected={this.state.selectedBlock === b.entry.id}
                  onClick={() => this.onBlockSelected(b.entry.id)}
                />
              </div>
            );
          })}
        </div>
        <div className="buttonBar">
          <Button
            buttonType="positive"
            extraClassNames="endButtons"
            disabled={!this.state.selectedBlock}
            onClick={() =>
              this.props.onAdd("done from within: " + this.state.selectedBlock)
            }
          >
            Insert Selected Entry
          </Button>
          <Button
            buttonType="muted"
            extraClassNames="endButtons"
            onClick={this.props.onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };
}

export default RecommendationView;

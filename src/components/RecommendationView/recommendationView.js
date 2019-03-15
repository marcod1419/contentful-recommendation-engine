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
import createRecService from "../../RecommendationService";

class RecommendationView extends React.Component {
  state = {
    filter: "marketing",
    selectedBlock: undefined,
    blocks: []
  };
  componentDidMount() {
    let service = createRecService(this.props.sdk);

    return service.getMockedRecommendations().then(recs => {
      console.log(JSON.stringify(recs[0]));
      let blocks = recs.map(r => {
        let entry = r.entry;
        return {
          relevance: r.relevance,
          entry: {
            id: entry.sys.id,
            type: "marketing",
            title: entry.fields.entryTitle
              ? entry.fields.entryTitle["en-CA"]
              : ""
          }
        };
      });

      this.setState({ blocks: blocks });
    });
  }

  onFilterChange = event => {
    this.setState({ filter: event.currentTarget.value });
  };

  onBlockSelected = id => {
    this.setState({ selectedBlock: id });
  };

  render = () => {
    let renderedBlocks = this.state.blocks.filter(
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
              <Option value="blog">Blog</Option>
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
              <div className="blockCard" key={b.entry.id}>
                <ReferenceCardWithRating
                  id={b.entry.id}
                  rating={b.relevance}
                  type={"marketing"}
                  title={b.entry.title}
                  image={'https://s3.amazonaws.com/telus-sitebuilder/hackathon/block2.png'}
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
            onClick={() => this.props.onAdd(this.state.selectedBlock)}
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

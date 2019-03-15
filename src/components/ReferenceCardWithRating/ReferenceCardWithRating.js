import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import {
  Card,
  Subheading,
  SectionHeading,
  Paragraph,
  Asset,
  Tag,
  IconButton
} from "@contentful/forma-36-react-components";

import tokens from "@contentful/forma-36-tokens";

import "./ReferenceCardWithRating.css";

class ReferenceCardWithRating extends React.Component {
  getRecLevel = () => {
    if (this.props.rating > 79) {
      return "positive";
    } else if (this.props.rating > 49) {
      return "warning";
    } else {
      return "negative";
    }
  };

  render() {
    return (
      <Card
        selected={this.props.selected}
        onClick={this.props.onClick}
        style={{ backgroundImage: `url(${this.props.image})` }}
        extraClassNames="cardBg"
      >
        <div className="cardContainer">
          <div className="infoHeader">
            <div className="left">
              <Paragraph>{this.props.type}</Paragraph>
              <Subheading element="h1">{this.props.title}</Subheading>
            </div>
            <div className="right">
              {this.props.rating ? (
                <Tag
                  tagType={this.getRecLevel()}
                  extraClassNames="recommendLevel"
                >
                  Relevance: {this.props.rating}%
                </Tag>
              ) : (
                <div>
                  <IconButton
                    label="Edit"
                    buttonType="muted"
                    iconProps={{ icon: "Edit" }}
                    onClick={() => {
                      this.props.onEdit(this.props.id);
                    }}
                  />
                  <IconButton
                    label="Remove"
                    buttonType="muted"
                    iconProps={{ icon: "Close" }}
                    onClick={() => {
                      this.props.onRemove(this.props.id);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

ReferenceCardWithRating.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
  imageTitle: PropTypes.string,
  rating: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func
};

ReferenceCardWithRating.defaultProps = {
  id: undefined,
  description: undefined,
  image: undefined,
  imageTitle: undefined,
  selected: false,
  onEdit: () => {},
  onRemove: () => {}
};

export default ReferenceCardWithRating;

import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import {
  Card,
  Subheading,
  SectionHeading,
  Paragraph,
  Asset,
  Tag
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
      <Card onClick={this.props.onClick}>
        <div className="cardContainer">
          <div className="left">
            <Paragraph>{this.props.type}</Paragraph>
            <Subheading element="h1">{this.props.title}</Subheading>
          </div>
          <div className="right">
            <Tag tagType={this.getRecLevel()} extraClassNames="recommendLevel">
              Recommendation: {this.props.rating}%
            </Tag>
            {this.props.image && (
              <Asset
                style={{ width: 80, height: 80 }}
                src={this.props.image}
                title={this.props.imageTitle}
              />
            )}
          </div>
        </div>
      </Card>
    );
  }
}

ReferenceCardWithRating.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string,
  imageTitle: PropTypes.string,
  rating: PropTypes.number.isRequired
};

ReferenceCardWithRating.defaultProps = {
  description: undefined,
  image: undefined,
  imageTitle: undefined
};

export default ReferenceCardWithRating;

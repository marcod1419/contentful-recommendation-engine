import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { TextInput } from "@contentful/forma-36-react-components";
import { init } from "contentful-ui-extensions-sdk";

import ReferenceCardWithRating from "./components/ReferenceCardWithRating/ReferenceCardWithRating";

import "@contentful/forma-36-react-components/dist/styles.css";
import "./index.css";

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = {
    value: this.props.sdk.field.getValue()
  };

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(
      this.onExternalChange
    );
  }

  componentWillUnmount() {
    this.detachExternalChangeHandler();
  }

  onExternalChange = value => {
    this.setState({ value });
  };

  onChange = e => {
    const value = e.currentTarget.value;
    this.setState({ value });
    if (value) {
      this.props.sdk.field.setValue(value);
    } else {
      this.props.sdk.field.removeValue();
    }
  };

  render = () => {
    return (
      <div>
        <ReferenceCardWithRating
          type="Test Type"
          title="Test Block"
          image="https://via.placeholder.com/1000/09f/fff.png"
          imageTitle="Img Title"
          rating={100}
          onClick={() => {
            console.log("Test selection!");
          }}
        />
      </div>
    );
  };
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById("root"));
});

// Enabling hot reload
if (module.hot) {
  module.hot.accept();
}

import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { TextInput } from "@contentful/forma-36-react-components";
import { init, locations } from "contentful-ui-extensions-sdk";
import "@contentful/forma-36-react-components/dist/styles.css";
import "./index.css";
import FieldView from "../fieldView";
import RecommendationView from "./components/RecommendationView/recommendationView";

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = {
    value: this.props.sdk.field ? this.props.sdk.field.getValue() : undefined
  };

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
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

  onAddButtonClick = e => {
    console.log("from click");

    this.props.sdk.dialogs
      .openExtension({
        id: "contentful-recommendation-engine",
        width: 500,
        shouldCloseOnOverlayClick: true,
        parameters: { test: true, value: 42 }
      })
      .then(data => {
        console.log(data);
      });
  };

  onDialogCloseButton = (data) => {
    this.props.sdk.close(data);
  }

  render = () => {
<<<<<<< HEAD
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
=======
    if (this.props.sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
      return <FieldView onClick={this.onAddButtonClick} />;
    } else if (this.props.sdk.location.is(locations.LOCATION_DIALOG)) {
      let blocks = [
        {
          relevance: 95,
          entry: {
            id:1,
            title: "dummy",
            type: "marketing",
            entryId: "123"
          }
        },
        {
          relevance: 20,
          entry: {
            id:2,
            title: "dummy",
            type: "marketing",
            entryId: "123"
          }
        }
      ];
      return <RecommendationView sdk={this.props.sdk} blocks={blocks} onDone={this.onDialogCloseButton} />;
    }
>>>>>>> first
  };
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById("root"));
});

// Enabling hot reload
if (module.hot) {
  module.hot.accept();
}

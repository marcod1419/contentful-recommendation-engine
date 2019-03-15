import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { TextInput } from "@contentful/forma-36-react-components";
import { init, locations } from "contentful-ui-extensions-sdk";
import "@contentful/forma-36-react-components/dist/styles.css";
import "./index.css";
import FieldView from "../fieldView";
import RecommendationView from "./components/RecommendationView/recommendationView";
import createRecService from "./RecommendationService";

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = {
    values: this.props.sdk.field ? this.props.sdk.field.getValue() : [],
    entries: []
  };

  async componentDidMount() {
    const service = createRecService(this.props.sdk);
    this.props.sdk.window.startAutoResizer();
    console.log("field values: " + JSON.stringify(this.state.values));

    let entryIds = this.state.values
      ? this.state.values.map(v => v.sys.id)
      : undefined;

    service.getReferencedEntries(entryIds).then(entries => {
      let data = entries.items.map(e => {
        return {
          title: e.fields["entryTitle"]["en-CA"],
          id: e.sys.id
        };
      });

      this.setState({ entries: data });
    });

    //console.log(JSON.stringify(this.props.sdk.field.getValue()));
  }

  onExternalChange = value => {
    //this.setState({ value });
  };

  onChange = e => {
    /*const value = e.currentTarget.value;
    this.setState({ value });
    if (value) {
      this.props.sdk.field.setValue(value);
    } else {
      this.props.sdk.field.removeValue();
    }*/
  };

  onAddButtonClick = e => {
    console.log("from click");

    this.props.sdk.dialogs
      .openExtension({
        id: "contentful-recommendation-engine",
        width: 800,
        title: "Insert entries by relevance",
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEscapePress: true,
        parameters: { test: true, value: 42 }
      })
      .then(data => {
        let entry = {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: data
          }
        };

        let service = createRecService(this.props.sdk);

        console.log("entries: " + JSON.stringify(entry));
        service.getReferencedEntries([entry.sys.id]).then(entries => {
          console.log("entries within: " + JSON.stringify(entries));
          let data = entries.items.map(e => {
            return {
              title: e.fields["entryTitle"]["en-CA"],
              id: e.sys.id
            };
          });

          this.setState({ entries: [...this.state.entries, ...data] });
        });

        /*this.props.sdk.field.setValue(values).then(() => {
          console.log("done");
        });*/
        //this.setState({ values: values });
      });
  };

  onDialogAddButton = data => {
    this.props.sdk.close(data);
  };

  onDialogCloseButton = () => {
    this.props.sdk.close();
  };

  render = () => {
    if (this.props.sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
      return (
        <FieldView
          onClick={this.onAddButtonClick}
          blocks={this.state.entries}
        />
      );
    } else if (this.props.sdk.location.is(locations.LOCATION_DIALOG)) {
      return (
        <RecommendationView
          sdk={this.props.sdk}
          onAdd={this.onDialogAddButton}
          onClose={this.onDialogCloseButton}
        />
      );
    }
  };
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById("root"));
});

// Enabling hot reload
if (module.hot) {
  module.hot.accept();
}

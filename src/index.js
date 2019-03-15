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
    value: this.props.sdk.field ? this.props.sdk.field.getValue() : undefined,
    entries: []
  };

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    let entryIds = this.state.value ? this.state.value.map(v => v.sys.id) : []


    let service = createRecService(this.props.sdk)

    service.getReferencedEntries(entryIds).then((entries) => {

      let data = entries.items.map(e => {
        return {
          title: e.fields['entryTitle']["en-CA"],
          id: e.sys.id
        }
      })

      this.setState( {entries: data})
    })

    

    
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
        width: 500,
        shouldCloseOnOverlayClick: true,
        parameters: { test: true, value: 42 }
      })
      .then(data => {

        let entry = [{
          "sys": {
            "type": "Link",
            "linkType": "Entry",
            "id": data.entryId 
          }
        }]

        this.props.sdk.field.setValue(entry).then(console.log('done'));
      });
  };

  onDialogCloseButton = data => {
    this.props.sdk.close(data);
  };

  render = () => {
    if (this.props.sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
      return (<FieldView onClick={this.onAddButtonClick} blocks={this.state.entries} />);
    } else if (this.props.sdk.location.is(locations.LOCATION_DIALOG)) {
      let blocks = [
        {
          relevance: 95,
          entry: {
            id: '7e7lZ5aru0d2K3HUUqUal4',
            title: "dummy",
            type: "marketing",
          }
        },
        {
          relevance: 20,
          entry: {
            id: '7jY4p06eGWgq4UoIyWQMEw',
            title: "dummy",
            type: "marketing",
          }
        }
      ];
      return (
        <RecommendationView
          sdk={this.props.sdk}
          blocks={blocks}
          onDone={this.onDialogCloseButton}
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

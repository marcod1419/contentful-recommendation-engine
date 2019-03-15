import React from "react";
import {
  TextInput,
  Button,
  Modal
} from "@contentful/forma-36-react-components";
import "@contentful/forma-36-react-components/dist/styles.css";
import ReferenceCardWithRating from "./src/components/ReferenceCardWithRating/ReferenceCardWithRating";
import { join } from "path";
//import "./index.css";

const FieldView = ({ blocks, onClick }) => {
  console.log(JSON.stringify(blocks));

  const onItemEdit = data => {
    console.log("Item edited.", data);
  };

  const onItemRemove = data => {
    console.log("Item removed", data);
  };

  console.log(JSON.stringify(blocks));
  return (<div>
    {blocks && blocks.map((b) => {
      return <ReferenceCardWithRating key={b.id} image={'https://s3.amazonaws.com/telus-sitebuilder/hackathon/block2.png'}  type={"marketing"} title={b.title} onClick={() => this.onBlockSelected('abc')} />
    })}
    <Button onClick = {() => onClick()}>Add</Button>
  </div >)
};

export default FieldView;

import React from "react";
import { TextInput, Button, Modal  } from "@contentful/forma-36-react-components";
import "@contentful/forma-36-react-components/dist/styles.css";
import ReferenceCardWithRating from "./src/components/ReferenceCardWithRating/ReferenceCardWithRating";
import { join } from "path";
//import "./index.css";

const FieldView = ({ blocks, onClick }) => {

  console.log(JSON.stringify(blocks));
  return (<div>
    {blocks && blocks.map(b => {
      return <ReferenceCardWithRating key={b.id} rating={22} type={"marketing"} title={b.title} onClick={() => this.onBlockSelected('abc')} />
    })}
    <Button onClick = {() => onClick()}>Add</Button>
  </div >)
}

export default FieldView;
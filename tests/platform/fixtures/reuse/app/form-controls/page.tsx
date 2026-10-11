"use client";
import { useState } from "react";
import Select from "@khatab/design/ui/select";
import { Checkbox, Radio } from "@khatab/design/ui/choice-controls";
const options = [{ value: "alpha", label: "Alpha" }, { value: "beta", label: "Beta", disabled: true }, { value: "gamma", label: "Gamma" }];
export default function ControlsFixture() {
  const [controlled, setControlled] = useState("gamma"), [result, setResult] = useState("");
  return <main className="lms-container"><h1>Shared form controls</h1>
    <form className="lms-profile-form" onSubmit={event => { event.preventDefault(); setResult(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)))); }}>
      <Select label="Category" name="category" options={options} defaultValue="" required placeholder="Choose" validationMessage="Choose a category." />
      <Select label="Controlled" name="controlled" options={options} value={controlled} defaultValue="alpha" onValueChange={setControlled} />
      <Select label="Disabled" name="disabled" options={options} disabled />
      <Checkbox label="Agree" name="agree" value="yes" />
      <Checkbox label="Unavailable" name="unavailable" disabled />
      <fieldset><legend>Choose a radio</legend><Radio label="First" name="choice" value="first" defaultChecked /><Radio label="Second" name="choice" value="second" /></fieldset>
      <button className="btn-primary" type="submit">Submit</button><button className="lms-secondary-button" type="reset">Reset</button>
      <output>{result}</output>
    </form>
  </main>;
}

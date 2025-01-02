import { getData } from "@js/data";
import { useState } from "react";
import "./App.css";
import { Calendar } from "./components/Calendar";

function App() {
  return (
    <>
      <h1>Calendar</h1>
      <Calendar data={getData()} />
    </>
  );
}

export default App;

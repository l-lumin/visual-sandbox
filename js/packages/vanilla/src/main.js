import { getData } from "@js/data";
import { renderCalendar } from "./calendar.js";
import "./style.css";

const moodData = getData();
const container = "#app";
const year = 2024;
renderCalendar(moodData, year, container);

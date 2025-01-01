import * as d3 from "d3";

/**
 * Renders a mood calendar into the given container.
 *
 * @param {Array} moodData - An array of objects: [{date: "2024-01-01T00:00:00.000", rate: 7}, ...]
 * @param {Number} year - The year you want to render (e.g., 2024).
 * @param {String} container - A CSS selector for the element in which to render the chart (e.g. "#app")
 */
export function renderCalendar(moodData, year, container) {
  const cellSize = 15;
  const cellPadding = 2;

  const root = d3.select(container);

  // Remove any existing SVG if re‑rendering
  root.selectAll("svg").remove();

  const width = 53 * (cellSize + cellPadding) + 50;
  const height = 7 * (cellSize + cellPadding) + 70;

  const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L");
  const dataMap = new Map();
  moodData.forEach((d) => {
    const dayDate = parseDate(d.date);
    const dayOnly = d3.timeDay.floor(dayDate);
    dataMap.set(dayOnly.getTime(), +d.rate);
  });

  // Generate all days for the specified year
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);
  const daysInYear = d3.timeDay.range(startOfYear, endOfYear);

  const colorScale = d3
    .scaleSequential(d3.interpolateRdYlGn)
    .domain([-10, 10])
    .clamp(true);

  const svg = root.append("svg").attr("width", width).attr("height", height);

  svg
    .selectAll(".day-rect")
    .data(daysInYear)
    .enter()
    .append("rect")
    .attr("class", "day-rect")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("rx", 20)
    .attr("ry", 20)
    .attr("x", (d) => {
      const weekIndex = d3.timeWeek.count(d3.timeYear(d), d);
      return weekIndex * (cellSize + cellPadding) + 30;
    })
    .attr("y", (d) => {
      let dow = d.getDay();
      return dow * (cellSize + cellPadding) + 20;
    })
    .attr("fill", (d) => {
      const key = d.getTime();
      return dataMap.has(key) ? colorScale(dataMap.get(key)) : "#eeeeee";
    })
    .append("title")
    .text((d) => {
      const key = d.getTime();
      const rate = dataMap.has(key) ? dataMap.get(key) : "N/A";
      return `Date: ${d3.timeFormat("%Y/%m/%d")(d)}\nRate: ${rate}`;
    });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach((dayName, i) => {
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", i * (cellSize + cellPadding) + 32)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("font-size", 10)
      .text(dayName);
  });

  const legendWidth = 300;
  const legendHeight = 10;

  const legendScale = d3
    .scaleLinear()
    .domain([-10, 10])
    .range([0, legendWidth]);

  const legendAxis = d3
    .axisBottom(legendScale)
    .ticks(5)
    .tickFormat(d3.format("d"));

  const legendGroup = svg
    .append("g")
    .attr("transform", `translate(30, ${height - 40})`);

  const defs = svg.append("defs");

  const gradient = defs
    .append("linearGradient")
    .attr("id", "legend-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  gradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", colorScale(-10));
  gradient
    .append("stop")
    .attr("offset", "50%")
    .attr("stop-color", colorScale(0));
  gradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", colorScale(10));

  legendGroup
    .append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#legend-gradient)");

  legendGroup
    .append("g")
    .attr("transform", `translate(0, ${legendHeight})`)
    .call(legendAxis)
    .selectAll("text")
    .attr("font-size", 10)
    .attr("alignment-baseline", "middle");
}

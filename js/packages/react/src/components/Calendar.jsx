import * as d3 from "d3";

export const Calendar = ({ data }) => {
  const year = 2024;
  const cellSize = 15;
  const cellPadding = 2;
  const width = 53 * (cellSize + cellPadding) + 50;
  const height = 7 * (cellSize + cellPadding) + 70;

  const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L");
  const dataMap = new Map();
  data.forEach((d) => {
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

  return (
    <svg width={width} height={height}>
      {daysInYear.map((d) => {
        const key = d.getTime();
        const rate = dataMap.has(key) ? dataMap.get(key) : "N/A";
        const weekIndex = d3.timeWeek.count(d3.timeYear(d), d);
        const dow = d.getDay();
        return (
          <rect
            key={key}
            width={cellSize}
            height={cellSize}
            rx={20}
            ry={20}
            x={weekIndex * (cellSize + cellPadding) + 30}
            y={dow * (cellSize + cellPadding) + 20}
            fill={dataMap.has(key) ? colorScale(dataMap.get(key)) : "#eeeeee"}
          >
            <title>
              Date: {d3.timeFormat("%Y/%m/%d")(d)}
              {"\n"}
              Rate: {rate}
            </title>
          </rect>
        );
      })}
    </svg>
  );
};

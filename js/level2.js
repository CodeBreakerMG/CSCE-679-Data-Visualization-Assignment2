/*DEFINITION OF THE MARGINS AND SVG*/
const marginL1 = { top: 60, right: 20, bottom: 50, left: 80 };
const widthL1 = 1000 - marginL1.left - marginL1.right;
const heightL1 = 500 - marginL1.top - marginL1.bottom;
const svgL1 = d3.select("#level2")
    .attr("width", widthL1 + marginL1.left + marginL1.right)
    .attr("height", heightL1 + marginL1.top + marginL1.bottom)
    .append("g")
    .attr("transform", `translate(${marginL1.left},${marginL1.top})`);

//TOOLTIP
const tooltipL1 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(255, 255, 255, 0.9)")
    .style("color", "#333")
    .style("border", "1px solid #ccc")
    .style("padding", "6px 10px")
    .style("border-radius", "6px")
    .style("box-shadow", "0px 2px 6px rgba(0,0,0,0.2)")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("display", "none");

//MONTHS
const monthsL1 = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

//LOAD DATA AND HEATMAP WITH LEGEND
d3.csv("data/temperature_daily.csv").then(data => {

 
    let maxEntry = 0

    //Load of the data
    data.forEach(d => {
        let parsedDate = new Date(d.date);
        d.date = parsedDate;
        d.year = parsedDate.getUTCFullYear();
        d.month = parsedDate.getUTCMonth();
        d.day = parsedDate.getUTCDate();
        d.max_temperature = +d.max_temperature;
        d.min_temperature = +d.min_temperature;
        maxEntry = Math.max(maxEntry, d.year);
    });


 
   // let maxEntry = data.reduce((max, d) => (d.max_temperature > max.max_temperature ? d : max), data[0]);
    let maxYear = maxEntry;  // The year of the highest recorded temperature
    let cutoff = maxYear - 10; // Entries older than this should be removed

    data = data.filter(d => d.year >= cutoff); //filtering data to just have the max year
    const yearsL1 = [...new Set(data.map(d => d.year))].sort((a, b) => a - b);
 

 
    const xScaleL1 = d3.scaleBand().domain(yearsL1).range([0, widthL1]).padding(0.2);
    const yScaleL1 = d3.scaleBand().domain(monthsL1).range([0, heightL1]).padding(0.2);
    const colorScaleL1 = d3.scaleSequential(d3.interpolateOrRd)
        .domain([d3.min(data, d => d.max_temperature), d3.max(data, d => d.max_temperature)]);

 
    svgL1.append("g")
        .attr("transform", `translate(0, -10)`)
        .call(d3.axisTop(xScaleL1).tickFormat(d3.format("d")));

    // Y-axis (Months) stays on the left
    svgL1.append("g").call(d3.axisLeft(yScaleL1));

    // Group data by year and month
    const nestedDataL1 = d3.group(data, d => `${d.year}-${d.month}`);

 

    // Heatmap Cells with Ogives
    const cellGroupsL1 = svgL1.selectAll("g.cell")
        .data(nestedDataL1)
        .enter()
        .append("g")
        .attr("transform", d => {
            const [year, month] = d[0].split("-").map(Number);
            return `translate(${xScaleL1(year)}, ${yScaleL1(monthsL1[month])})`;
        });

    // Background Color
    cellGroupsL1.append("rect")
        .attr("width", xScaleL1.bandwidth())
        .attr("height", yScaleL1.bandwidth())
        .attr("fill", d => colorScaleL1(d3.mean(d[1], v => v.max_temperature)));

    // Line Chart Scales
    const xLineScaleL1 = d3.scaleLinear().domain([1, 31]).range([2, xScaleL1.bandwidth() - 2]); // Days
    const yLineScaleL1 = d3.scaleLinear()
        .domain([
            d3.min(data, d => d.min_temperature), 
            d3.max(data, d => d.max_temperature)
        ])
        .range([yScaleL1.bandwidth() - 2, 2]); // Temperature Range

    // Define Line Generators
    const maxLineL1 = d3.line()
        .x(d => xLineScaleL1(d.day))
        .y(d => yLineScaleL1(d.max_temperature))
        .curve(d3.curveMonotoneX);

    const minLineL1 = d3.line()
        .x(d => xLineScaleL1(d.day))
        .y(d => yLineScaleL1(d.min_temperature))
        .curve(d3.curveMonotoneX);

    // Draw Max Temperature Ogive (Green)
    cellGroupsL1.append("path")
        .datum(d => d[1])
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", maxLineL1);

    // Draw Min Temperature Ogive (White)
    cellGroupsL1.append("path")
        .datum(d => d[1])
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("d", minLineL1);

    // Tooltip Interaction
    cellGroupsL1.on("mouseover", (event, d) => {
            tooltipL1.style("display", "block")
                .html(`
                    Date: ${d[1][0].year}-${String(d[1][0].month + 1).padStart(2, '0')}; 
                    max: ${d3.max(d[1], v => v.max_temperature)} min: ${d3.min(d[1], v => v.min_temperature)}
                `);
        })
        .on("mousemove", (event) => {
            tooltipL1.style("left", `${event.pageX + 15}px`)
                .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", () => tooltipL1.style("display", "none"));

 
const extraSpaceForLegend = 100;
d3.select("#level2")
    .attr("width", widthL1 + marginL1.left + marginL1.right + extraSpaceForLegend); // Add extra width

//LEGEND: PROPERTIES AND DEFINITION
const legendWidth = 10;
const legendHeight = 100;
const legendPadding = 40; // Space from heatmap
const legendSteps = 10; // Number of discrete steps (squares)

 
const legendScale = d3.scaleLinear()
    .domain([40, 0])                    //   40°C is at the bottom
    .range([legendHeight, 0]);

 
const tempValues = d3.range(0, 41, 40 / legendSteps); // 10 steps from 0°C to 40°C

const legendSvg = svgL1.append("g")
    .attr("transform", `translate(${widthL1 + legendPadding}, 0)`);

 
const stepHeight = legendHeight / legendSteps;          //  HEIGHT Steps Calculation

legendSvg.selectAll("rect")
    .data(tempValues)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", d => legendScale(d) - stepHeight) // Align each square
    .attr("width", legendWidth)
    .attr("height", stepHeight)
    .attr("fill", d => d3.interpolateOrRd(d / 40)) // Map temp range (0-40°C) to colors
    .attr("stroke", "black"); // Add border for visibility

 
legendSvg.append("text")
    .attr("x", legendWidth / 2  + 25)
    .attr("y", -8)
    .attr("text-anchor", "middle")
    .attr("font-size", "8px")
    .attr("font-family", "Arial")
 
    .text("0 Celsius");

legendSvg.append("text")
    .attr("x", legendWidth / 2 + 25)
    .attr("y", legendHeight + 8)
    .attr("text-anchor", "middle")
    .attr("font-size", "8px")
    .attr("font-family", "Arial")
    .text("40 Celsius");

});

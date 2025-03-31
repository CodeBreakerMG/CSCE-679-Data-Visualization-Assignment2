// Set up dimensions
const margin = { top: 60, right: 20, bottom: 50, left: 80 };
const width = 1000 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Append SVG
const svgL2 = d3.select("#level1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip setup (Floating box)
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(255, 255, 255, 0.9)") // Light transparent background
    .style("color", "#333") // Dark text
    .style("border", "1px solid #ccc")
    .style("padding", "6px 10px")
    .style("border-radius", "6px")
    .style("box-shadow", "0px 2px 6px rgba(0,0,0,0.2)")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("display", "none");

// Month names
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Load Data
d3.csv("data/temperature_daily.csv").then(data => {
    data.forEach(d => {
        let parsedDate = new Date(d.date);
        d.date = parsedDate;
        d.year = parsedDate.getUTCFullYear();
        d.month = parsedDate.getUTCMonth();
        d.day = parsedDate.getUTCDate();
        d.max_temperature = +d.max_temperature;
        d.min_temperature = +d.min_temperature;
    });

    const years = [...new Set(data.map(d => d.year))].sort((a, b) => a - b);

    // Scales

    const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.2); //new and thicker whitespaces
    const yScale = d3.scaleBand().domain(months).range([0, height]).padding(0.2); //new and thicker whitespaces
    //const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.05); OLD
    //const yScale = d3.scaleBand().domain(months).range([0, height]).padding(0.05); OLD 
    const colorScale = d3.scaleSequential(d3.interpolateOrRd)
        .domain([d3.min(data, d => d.max_temperature), d3.max(data, d => d.max_temperature)]);

    // Move X-axis (Years) to the top
    svgL2.append("g")
        .attr("transform", `translate(0, -10)`)
        .call(d3.axisTop(xScale).tickFormat(d3.format("d")));

    // Y-axis (Months) stays on the left
    svgL2.append("g").call(d3.axisLeft(yScale));

    // Heatmap Cells
    svgL2.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(months[d.month]))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", d => colorScale(d.max_temperature))
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .html(`
                    Date: ${d.year}-${String(d.month).padStart(2, '0')}; 
                    max: ${d.max_temperature} min: ${d.min_temperature}
                `);
        })
        .on("mousemove", (event) => {
            tooltip.style("left", `${event.pageX + 15}px`) // Keep tooltip to the right of the cursor
                .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", () => tooltip.style("display", "none"));
});


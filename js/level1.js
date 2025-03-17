const months = [
    "January", "Febraury", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "Decembeer"
]

const margin = {top: 50, right: 20, bottom: 50, left: 80};
const width = 1000 - margin.left -  margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("#heatmap")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


/*LOAD DATA FROM THE CSV FILE*/
//d3 DATA STRUCTURE FOR THE HEATMAP... IT IS AN ARRAY OF AN ARRAY
d3.csv("data/temperature_daily.csv").then(data => {
    data.forEach(d => {
        d.date = new Date(d.date);
        d.year = d.date.getFullYear();
        d.month = d.date.getMonth();
        d.max_temperature = +d.max_temperature;
        d.min_temperature = +d.min_temperature; 
    });

});
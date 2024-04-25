d3.csv("https://raw.githack.com/Tanoy004/Emotion-recognition-through-CNN/main/data1.csv")
    .then(function(data) {
        // Get list of variables
        var variables = Object.keys(data[0]);

        // Populate variable select dropdown
        var variableSelect = document.getElementById("variable-select");
        variables.forEach(function(variable) {
            var option = document.createElement("option");
            option.text = variable;
            variableSelect.add(option);
        });

        // Initial chart drawing
        updateChart(data);

        // Event listener for variable select change
        variableSelect.addEventListener("change", function() {
            updateChart(data);
        });

        // Event listener for flip button
        document.getElementById("flip-button").addEventListener("click", function() {
            flipOrientation();
            updateChart(data);
        });
    })
    .catch(function(error) {
        // Handle any errors here
        console.error("Error loading the CSV file:", error);
    });

// Function to update chart based on user selections
function updateChart(data) {
    var variable = document.getElementById("variable-select").value;
    var orientation = document.getElementById("flip-button").getAttribute("data-orientation");

    // Remove existing chart
    var chartContainer = document.getElementById("chart");
    chartContainer.innerHTML = "";

    // Draw chart based on variable type
    if (variable === "Country" || variable === "Status" || variable === "Human Development Groups") {
        drawBarChart(data, variable, orientation);
    } else {
        drawHistogram(data, variable, orientation);
    }
}

// Function to flip the orientation
function flipOrientation() {
    var flipButton = document.getElementById("flip-button");
    var currentOrientation = flipButton.getAttribute("data-orientation");
    var newOrientation = currentOrientation === "vertical" ? "horizontal" : "vertical";
    flipButton.setAttribute("data-orientation", newOrientation);
}

// Function to draw a bar chart
function drawBarChart(data, variable, orientation) {
    if(orientation=="vertical"){
    // Set up SVG dimensions and margins
    var margin = { top: 50, right: 50, bottom: 50, left: 50 };
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    // Adjust width and height based on orientation
    if (orientation === "horizontal") {
        var temp = width;
        width = height;
        height = temp;
    }

    // Create SVG container
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Extract unique values and their counts for the selected variable
    var counts = d3.rollups(data, v => v.length, d => d[variable]);
    var xValues = counts.map(d => d[0]);
    var yValues = counts.map(d => d[1]);

    //Create x and y scales
    var xScale = d3.scaleBand()
        .domain(xValues)
        .range([0, width])
        .padding(0.1);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(yValues)])
        .range([height, 0]);
    // if(orientation == "horizontal"){
    //     var xScale = d3.scaleLinear()
    //     .domain([0, d3.max(bins, d => d.length)])
    //     .range([0, width]);

    // var yScale = d3.scaleLinear()
    //     .domain([d3.min(values), d3.max(values)])
    //     .range([0, height]);
    // } else{
    //     var xScale = d3.scaleLinear()
    //     .domain([d3.min(values), d3.max(values)])
    //     .range([0, width]);

    // var yScale = d3.scaleLinear()
    //     .domain([0, d3.max(bins, d => d.length)])
    //     .range([height, 0]);
    // }

    // Adjust axis based on orientation
    var xAxis = orientation === "vertical" ? d3.axisBottom(xScale) : d3.axisLeft(xScale);
    var yAxis = orientation === "vertical" ? d3.axisLeft(yScale) : d3.axisBottom(yScale);
    //var xAxis = orientation === "vertical" ? d3.axisBottom(xScale) : d3.axisLeft(xScale);
    //var yAxis = orientation === "vertical" ? d3.axisLeft(yScale) : d3.axisBottom(yScale);

    // Draw x axis
    svg.append("g")
        .attr("transform", orientation === "vertical" ? "translate(0," + height + ")" : "translate(0,0)")
        //.attr("transform", orientation === "vertical" ? "translate(0," + height + ")" : "translate(0,"+height+") rotate(-90)")
        .call(xAxis)
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .style("text-anchor", "middle")
        .text(variable);

    // Draw y axis
    svg.append("g")
        //.attr("transform", orientation === "vertical" ? "rotate(0)" : "translate(0,"+height+")rotate(270)")
        .call(yAxis)
        .append("text")
        .attr("transform", orientation === "vertical" ? "rotate(-90)" : "rotate(0)")
        .attr("x", orientation === "vertical" ? -height / 2 : width / 2)
        .attr("y", orientation === "vertical" ? -35 : height + 40)
        .style("text-anchor", "middle")
        .text("Number of Items");

    // Draw bars
    svg.selectAll("rect")
        .data(counts)
        .enter().append("rect")
        .attr("x", d => xScale(d[0]))
        .attr("y", orientation === "vertical" ? (d => yScale(d[1])) : 0)
        .attr("width", xScale.bandwidth())
        .attr("height", orientation === "vertical" ? (d => height - yScale(d[1])) : (d => yScale(d[1])))
        // .attr("x", orientation === "vertical" ? (d => xScale(d.x0)) : (1))
        // .attr("y", orientation === "vertical" ? (d => yScale(d.length)) : (d => yScale(d.x0)))
        // .attr("width", orientation === "vertical" ? (d => xScale(d.x1) - xScale(d.x0) - 1) : (d => xScale(d.length)))
        // .attr("height", orientation === "vertical" ? (d => height - yScale(d.length)) : (d => yScale(d.x1) - yScale(d.x0) - 1))
        .attr("fill", "steelblue")
        .transition()
        .duration()

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Bar Chart of " + variable);
}
else
{
    var selectedVariable = d3.select("#variable-select").node().value;
    //var toggleChecked = d3.select("#orientation").node().checked;
    d3.select("#chart").selectAll("*").remove();

        var margin = { top: 20, right: 30, bottom: 30, left: 40 };
        var width = 600 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Extract unique values and their counts for the selected variable
        var counts = d3.rollups(data, v => v.length, d => d[selectedVariable]);
        var xValues = counts.map(d => d[1]);
        var yValues = counts.map(d => d[0]);

        // Create x and y scales
        var xScale = d3.scaleLinear()
            .domain([0, d3.max(xValues)])
            .range([0, width]);

        var yScale = d3.scaleBand()
            .domain(yValues)
            .range([0, height])
            .padding(0.1);

        // Draw x axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        // Draw y axis
        svg.append("g")
            .call(d3.axisLeft(yScale));

        // Draw bars
        svg.selectAll("rect")
            .data(counts)
            .enter().append("rect")
            .attr("y", d => yScale(d[0]))
            .attr("width", d => xScale(d[1]))
            .attr("height", yScale.bandwidth())
            .attr("fill", "steelblue");

        // Set chart title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .text("Bar Chart of " + selectedVariable);
    }
}

// Function to draw a histogram
function drawHistogram(data, variable, orientation) {
    // Set up SVG dimensions and margins
    var margin = { top: 50, right: 50, bottom: 50, left: 50 };
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    // Adjust width and height based on orientation
    // if (orientation === "horizontal") {
    //     var temp = width;
    //     width = height;
    //     height = temp;
    // }

    // Create SVG container
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Extract numerical values for the selected variable
    var values = data.map(d => +d[variable]);
    // var values = data.map(d => parseFloat(d["BMI"]));
    // min = d3.min( data.map(d=>{return parseFloat(data["BMI"])}))
    // max = d3.max(data.map(d=>{return parseFloat(data["BMI"])}))
    console.log(values);   // Define histogram bins
    var bins = d3.histogram()
        .domain(d3.extent(values))
        .thresholds(d3.range(d3.min(values), d3.max(values), (d3.max(values) - d3.min(values)) / 20))
        // .thresholds(d3.range(min, max, (max - min) / 20))
        (values);
    console.log("bins ",bins);
    // Create x and y scales
    if(orientation == "horizontal"){
        var xScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(values), d3.max(values)])
        .range([0, height]);
    } else{
        var xScale = d3.scaleLinear()
        .domain([d3.min(values), d3.max(values)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height, 0]);
    }
    
    // var xScale = d3.scaleLinear()
    //     .domain([d3.min(values), d3.max(values)])
    //     .range([0, width]);

    // var yScale = d3.scaleLinear()
    //     .domain([0, d3.max(bins, d => d.length)])
    //     .range([height, 0]);   
    // Adjust axis based on orientation
    var xAxis = orientation === "vertical" ? d3.axisBottom(xScale) : d3.axisLeft(xScale);
    var yAxis = orientation === "vertical" ? d3.axisLeft(yScale) : d3.axisBottom(yScale);

    // Draw x axis
    svg.append("g")
        .attr("transform", orientation === "vertical" ? "translate(0," + height + ")" : "translate(0,"+height+") rotate(-90)")
        .call(xAxis)
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .style("text-anchor", "middle")
        .text(variable);

    // Draw y axis
    svg.append("g")
        .attr("transform", orientation === "vertical" ? "rotate(0)" : "translate(0,"+height+")rotate(-90)")
        .call(yAxis)
        .append("text")
        .attr("x", orientation === "vertical" ? -height / 2 : width / 2)
        .attr("y", orientation === "vertical" ? -35 : 10)
        .style("text-anchor", "middle")
        .text("Number of Items");

    // Draw histogram bars
    svg.selectAll("rect")
        .data(bins)
        .enter().append("rect")
        .attr("x", orientation === "vertical" ? (d => xScale(d.x0)) : (1))
        .attr("y", orientation === "vertical" ? (d => yScale(d.length)) : (d => yScale(d.x0)))
        .attr("width", orientation === "vertical" ? (d => xScale(d.x1) - xScale(d.x0) - 1) : (d => xScale(d.length)))
        .attr("height", orientation === "vertical" ? (d => height - yScale(d.length)) : (d => yScale(d.x1) - yScale(d.x0) - 1))
        .attr("fill", "steelblue")
       

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Histogram of " + variable);
}





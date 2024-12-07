// Vælg elementer med D3
const inputFelt = d3.select("#food");
const resultsDiv = d3.select("#results");
const chartDiv = d3.select("#chart");

// Knapperne for at vælge graferne
const GrafInternet = d3.select("#GrafInternet");
const GrafMobil = d3.select("#GrafMobil");
const GrafElektricitet = d3.select("#GrafElektricitet");

// Lagene for graferne
const GrafElektricitetLag = d3.select("#checkedelektricitet");
const GrafInternetLag = d3.select("#checkedinternet");
const GrafMobilLag = d3.select("#checkedmobil");

let dataLoaded = {
  internet: false,
  mobile: false,
  electricity: false,
};

let graphData = {
  internet: null,
  mobile: null,
  electricity: null,
};
function toggleOpacity(layer, knappen) {
  const opacity = layer.style("opacity");
  if (opacity === "1") {
    layer.style("opacity", "0");
    dataLoaded[knappen] = false; // Deactivate data for the selected button
  } else {
    layer.style("opacity", "1");
    dataLoaded[knappen] = true; // Activate data for the selected button
  }
  console.log(`${knappen} was clicked`);
  updateGraph(); // Update the graph every time a button is toggled
}

// Button event handlers
GrafInternet.on("click", () => {
  toggleOpacity(GrafInternetLag, "internet");
});

GrafMobil.on("click", () => {
  toggleOpacity(GrafMobilLag, "mobile");
});

GrafElektricitet.on("click", () => {
  toggleOpacity(GrafElektricitetLag, "electricity");
});

// Input field functionality
inputFelt.on("focus", () => {
  resultsDiv.classed("hidden", false);
});

inputFelt.on("input", async function () {
  const query = this.value;

  try {
    const response = await fetch(`/api/onGetCountry?country=${query}`);
    const data = await response.json();

    resultsDiv.html("");

    data.forEach((item) => {
      resultsDiv
        .append("div")
        .text(item.country)
        .on("click", async () => {
          inputFelt.property("value", item.country);
          resultsDiv.classed("hidden", true);
          await loadCountryData(item.country); // Fetch and display data for the selected country
        });
    });
  } catch (error) {
    console.log("An error occurred:", error);
  }
});

d3.select("body").on("click", (event) => {
  const clickedElement = event.target;
  if (
    !inputFelt.node().contains(clickedElement) &&
    !resultsDiv.node().contains(clickedElement)
  ) {
    resultsDiv.classed("hidden", true); // Hide results when clicking outside the input
  }
});

// Function to fetch and display data as line charts for internet, mobile, and electricity
async function loadCountryData(country) {
  try {
    // Fetch data for all three categories
    const apiCalls = [];

    apiCalls.push(
      fetch(`/api/internet_data?country=${country}`).then((response) =>
        response.json()
      )
    );
    apiCalls.push(
      fetch(`/api/telephones_data?country=${country}`).then((response) =>
        response.json()
      )
    );
    apiCalls.push(
      fetch(`/api/electricity_data?country=${country}`).then((response) =>
        response.json()
      )
    );

    const results = await Promise.all(apiCalls);

    // Save data for later use
    graphData.internet = results[0];
    graphData.mobile = results[1];
    graphData.electricity = results[2];

    // Update the graph with the fetched data
    updateGraph();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

// Function to update the graph
function updateGraph() {
  // Check if the data is properly loaded
  if (!graphData.internet || !graphData.mobile || !graphData.electricity) {
    console.log("Data is not properly loaded.");
    return; // Stop updating if the data is not available
  }

  // Clear the existing chart
  chartDiv.html("");

  // Define dimensions and margins
  const width = 800;
  const height = 500;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };

  const svg = chartDiv
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(graphData.internet, (d) => d.year))
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([
      0,
      Math.max(
        d3.max(graphData.internet, (d) => d.internet_usage),
        d3.max(graphData.mobile, (d) => d.telephones_per_100),
        d3.max(graphData.electricity, (d) => d.electricity_access_percentage)
      ),
    ])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const line = d3
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.value));

  // Add axes
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

  if (dataLoaded.internet && graphData.internet) {
    createGraphLine(
      svg,
      graphData.internet,
      "internet",
      "steelblue",
      line,
      xScale,
      yScale,
      margin
    );
  }

  if (dataLoaded.mobile && graphData.mobile) {
    createGraphLine(
      svg,
      graphData.mobile,
      "mobile",
      "green",
      line,
      xScale,
      yScale,
      margin
    );
  }

  if (dataLoaded.electricity && graphData.electricity) {
    createGraphLine(
      svg,
      graphData.electricity,
      "electricity",
      "orange",
      line,
      xScale,
      yScale,
      margin
    );
  }
}

function createGraphLine(svg, data, type, color, line, xScale, yScale, margin) {
  const formattedData = data.map((d) => ({
    year: +d.year,
    value:
      +d[
        `${
          type === "internet"
            ? "internet_usage"
            : type === "mobile"
            ? "telephones_per_100"
            : "electricity_access_percentage"
        }`
      ],
  }));

  // Draw the main line
  svg
    .append("path")
    .datum(formattedData)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", 2)
    .attr("d", line);

  // Find the top value
  const topPoint = formattedData.reduce((max, d) =>
    d.value > max.value ? d : max
  );

  // Add a dotted line from the top value to the y-axis
  svg
    .append("line")
    .attr("x1", xScale(topPoint.year))
    .attr("x2", margin.left)
    .attr("y1", yScale(topPoint.value))
    .attr("y2", yScale(topPoint.value))
    .attr("stroke", color)
    .attr("stroke-dasharray", "4 2")
    .attr("stroke-width", 1);

  // Find the position of the text label to avoid overlap
  let offset = -0;
  svg.selectAll("text").each(function () {
    const currentText = d3.select(this);
    const currentY = parseFloat(currentText.attr("y"));
    const currentDy = parseFloat(currentText.attr("dy")) || 0;
    const distance = Math.abs(currentY - (yScale(topPoint.value) + currentDy));

    if (distance < 10) {
      offset += 25; // Adjust the distance between overlapping labels
    }
  });

  // Add a text label just after the y-axis and closer to the dotted line
  svg
    .append("text")
    .attr("x", margin.left + 10)
    .attr("y", yScale(topPoint.value) + offset)
    .attr("dy", "-0.3em")
    .style("fill", color)
    .style("font-size", "12px")
    .style("text-anchor", "start")
    .text(`${topPoint.value}`);
}

// Set default "Denmark" in the search field and load data
inputFelt.property("value", "Denmark");
loadCountryData("Denmark");

// Activate only the internet button
toggleOpacity(GrafInternetLag, "internet");

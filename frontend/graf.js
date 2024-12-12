// Vælg elementer med D3
const inputFelt = d3.select("#food");
const resultsDiv = d3.select("#results");
const chartDiv = d3.select("#chart");
const kikkertKnap = d3.select("#kikkert");

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
    dataLoaded[knappen] = false; // Deaktiver data for den valgte
  } else {
    layer.style("opacity", "1");
    dataLoaded[knappen] = true; // Aktiver data for den valgte
  }
  console.log(`${knappen} Blev klikket`);
  updateGraph(); // opdater grafen hver gang en knap er klikket
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

// Input felt funktionalitet
inputFelt.on("focus", () => {
  resultsDiv.classed("hidden", false);
});

kikkertKnap.on("click", () => {
  resultsDiv.classed("hidden", false);
});

inputFelt.on("input", async function () {
  const query = this.value.trim();

  try {
    const response = await fetch(`/api/onGetCountry?country=${query}`);
    const data = await response.json();

    resultsDiv.html("");

    // Filtrér lande der STARTER MED det indtastede
    const filteredCountries = data.filter((item) =>
      item.country.toLowerCase().startsWith(query.toLowerCase())
    );

    filteredCountries.forEach((item) => {
      resultsDiv
        .append("div")
        .text(item.country)
        .on("click", async () => {
          inputFelt.property("value", item.country);
          kikkertKnap.property("value", item.country);
          resultsDiv.classed("hidden", true);
          await loadCountryData(item.country);
        });
    });

    inputFelt.on("keydown", async (event) => {
      if (event.key === "Enter") {
        const userInput = inputFelt.property("value").toLowerCase();

        // Find den tætteste værdi
        const closestMatch = filteredCountries.find((item) =>
          item.country.toLowerCase().startsWith(userInput)
        );

        if (closestMatch) {
          // Brug den fundne værdi
          const selectedCountry = closestMatch.country;
          inputFelt.property("value", selectedCountry);
          kikkertKnap.property("value", selectedCountry);
          resultsDiv.classed("hidden", true);
          await loadCountryData(selectedCountry);
        } else {
          console.log("Ingen match fundet!");
        }
      }
    });
  } catch (error) {
    console.log("En fejl opstod:", error);
  }
});

d3.select("body").on("click", (event) => {
  const clickedElement = event.target;
  if (
    !inputFelt.node().contains(clickedElement) &&
    !resultsDiv.node().contains(clickedElement) &&
    !kikkertKnap.node().contains(clickedElement)
  ) {
    resultsDiv.classed("hidden", true); // gem resultater
  }
});

// Funktion til at hente og vise data for mobil, internet og elektricitet
async function loadCountryData(country) {
  try {
    // Fetch data for alle tre kategorier
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

    // Gem dataen
    graphData.internet = results[0];
    graphData.mobile = results[1];
    graphData.electricity = results[2];

    updateGraph();
  } catch (error) {
    console.error("Fejlede ved at fetche:", error);
  }
}

function updateGraph() {
  if (!graphData.internet || !graphData.mobile || !graphData.electricity) {
    console.log("Data blev ikke hentet rigtigt.");
    return;
  }

  chartDiv.html(""); // Clear previous graph

  // Define dimensions and margins
  let width = 800;
  let height = 500;
  let margin = { top: 20, right: 30, bottom: 50, left: 50 };

  function updateDimensions() {
    if (window.innerWidth < 900) {
      width = 400;
      height = 300;
      margin = { top: 10, right: 15, bottom: 25, left: 25 };
    } else if (window.innerWidth < 1300) {
      width = 800;
      height = 425;
      margin = { top: 15, right: 20, bottom: 40, left: 40 };
    } else {
      width = 800;
      height = 500;
      margin = { top: 20, right: 30, bottom: 50, left: 50 };
    }
  }

  window.addEventListener("resize", updateDimensions);
  updateDimensions();

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

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text("ÅRSTAL");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text("PROCENT");

  if (dataLoaded.internet && graphData.internet) {
    createGraphLine(
      svg,
      graphData.internet,
      "internet",
      "steelblue",
      line,
      xScale,
      yScale
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
      yScale
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
      yScale
    );
  }
}

function createGraphLine(svg, data, type, color, line, xScale, yScale) {
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
    type, // Added data type for tooltip
  }));

  // Create the line with thicker stroke
  const graphLine = svg
    .append("path")
    .datum(formattedData)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", 4.5) // Increased stroke width for thicker line
    .attr("d", line);

  // Add hover functionality to the line
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add circles for hover interaction
  graphLine
    .on("mouseover", function (event, d) {
      // Find the exact point that the mouse is hovering over
      const mouseX = d3.pointer(event)[0];
      const mouseY = d3.pointer(event)[1];

      // Find the closest data point to the mouse position
      const closestData = formattedData.reduce((prev, curr) => {
        return Math.abs(xScale(curr.year) - mouseX) <
          Math.abs(xScale(prev.year) - mouseX)
          ? curr
          : prev;
      });

      // Add larger circle for hover effect
      svg
        .append("circle")
        .attr("cx", xScale(closestData.year))
        .attr("cy", yScale(closestData.value))
        .attr("r", 8) // Larger radius for easier interaction
        .attr("fill", color)
        .style("pointer-events", "none"); // Prevent the circle from interfering with other events

      // Show tooltip with year, value, and data type
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(
          `År: ${closestData.year}<br>Værdi: ${closestData.value}<br>Datatype: ${closestData.type}`
        )
        .style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", function () {
      // Remove the circle when mouseout
      svg.selectAll("circle").remove();

      // Hide tooltip
      tooltip.transition().duration(500).style("opacity", 0);
    });
}

// Sæt Denmark til at være default
inputFelt.property("value", "Denmark");
loadCountryData("Denmark");

// Aktiver kun internet
toggleOpacity(GrafInternetLag, "internet");

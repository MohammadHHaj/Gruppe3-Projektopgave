const inputFelt = d3.select("#food");
const resultsDiv = d3.select("#results");

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
        .on("click", () => {
          inputFelt.property("value", item.country);
          resultsDiv.classed("hidden", true);
        });
    });
  } catch (error) {
    console.log("Der skete en fejl:", error);
  }
});

d3.select("body").on("click", (event) => {
  const clickedElement = event.target;
  if (
    !inputFelt.node().contains(clickedElement) &&
    !resultsDiv.node().contains(clickedElement)
  ) {
    resultsDiv.classed("hidden", true);
  }
});

const GrafInternet = document.getElementById("GrafInternet");
const GrafMobil = document.getElementById("GrafMobil");
const GrafElektricitet = document.getElementById("GrafElektricitet");
//Knapperne
const GrafElektricitetLag = document.getElementById("checkedelektricitet");
const GrafInternetLag = document.getElementById("checkedinternet");
const GrafMobilLag = document.getElementById("checkedmobil");
//Colored squares :)

function toggleOpacity(layer, knappen) {
  if (layer.style.opacity === "1") {
    layer.style.opacity = "0";
  } else {
    layer.style.opacity = "1";
  }
  console.log(`${knappen} Blev trykket på`);
}

GrafInternet.addEventListener("click", () =>
  toggleOpacity(GrafInternetLag, "GrafInternet")
);
GrafMobil.addEventListener("click", () =>
  toggleOpacity(GrafMobilLag, "GrafMobil")
);
GrafElektricitet.addEventListener("click", () =>
  toggleOpacity(GrafElektricitetLag, "GrafElektricitet")
);

//Grafen starter her

// set the dimensions and margins of the graph
const margin = { top: 30, right: 10, bottom: 30, left: 75 },
  width = 600 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv(
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv"
).then(function (data) {
  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, (d) => d.name); // nest function allows to group the calculation per level of a factor

  // Add X axis --> it is a date format
  const x = d3
    .scaleLinear()
    .domain(
      d3.extent(data, function (d) {
        return d.year;
      })
    )
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d.n;
      }),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // color palette
  const color = d3
    .scaleOrdinal()
    .range([
      "#e41a1c",
      "#377eb8",
      "#4daf4a",
      "#984ea3",
      "#ff7f00",
      "#ffff33",
      "#a65628",
      "#f781bf",
      "#999999",
    ]);

  // Draw the line
  svg
    .selectAll(".line")
    .data(sumstat)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", function (d) {
      return color(d[0]);
    })
    .attr("stroke-width", 1.5)
    .attr("d", function (d) {
      return d3
        .line()
        .x(function (d) {
          return x(d.year);
        })
        .y(function (d) {
          return y(+d.n);
        })(d[1]);
    });
});

// Vælg DOM-elementer med D3
const inputFelt = d3.select("#food");
const resultsDiv = d3.select("#results");
const chartDiv = d3.select("#chart");
const kikkertKnap = d3.select("#kikkert");
const legendDiv = d3.select("#legend");

// Knapper for at vælge graf-typer
const GrafInternet = d3.select("#GrafInternet");
const GrafMobil = d3.select("#GrafMobil");
const GrafElektricitet = d3.select("#GrafElektricitet");

// Lag for grafer
const GrafElektricitetLag = d3.select("#checkedelektricitet");
const GrafInternetLag = d3.select("#checkedinternet");
const GrafMobilLag = d3.select("#checkedmobil");

let dataLoaded = {
  internet: true,
  mobile: false,
  electricity: false,
};

let selectedCountries = [];
let graphData = {};

// Farvepalet for lande
const countryColors = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

// Farver for forskellige datatyper (komplementerende)
const dataColors = {
  0: {
    internet: "steelblue",
    mobile: "green",
    electricity: "orange",
  },
  1: {
    internet: "#FF6B6B", // Rød-pink nuance
    mobile: "#4ECDC4", // Grøn-blå nuance
    electricity: "#FFA726", // Lysere orange
  },
};

function toggleOpacity(layer, knappen) {
  const opacity = layer.style("opacity");
  if (opacity === "1") {
    layer.style("opacity", "0");
    dataLoaded[knappen] = false; // Deaktiver data for det valgte
  } else {
    layer.style("opacity", "1");
    dataLoaded[knappen] = true; // Aktivér data for det valgte
  }
  console.log(`${knappen} Knap blev klikket`);
  updateGraph(); // Opdater grafen hver gang en knap bliver klikket
}

// Knapper event handlers
GrafInternet.on("click", () => toggleOpacity(GrafInternetLag, "internet"));
GrafMobil.on("click", () => toggleOpacity(GrafMobilLag, "mobile"));
GrafElektricitet.on("click", () =>
  toggleOpacity(GrafElektricitetLag, "electricity")
);

// Input-felt funktionalitet
inputFelt.on("focus", () => resultsDiv.classed("hidden", false));
kikkertKnap.on("click", () => resultsDiv.classed("hidden", false));

inputFelt.on("input", async function () {
  const query = this.value.trim();

  try {
    const response = await fetch(`/api/onGetCountry?country=${query}`);
    const data = await response.json();

    resultsDiv.html("");

    // Filtrer lande der STARTER MED inputtet
    const filteredCountries = data.filter((item) =>
      item.country.toLowerCase().startsWith(query.toLowerCase())
    );

    filteredCountries.forEach((item) => {
      resultsDiv
        .append("div")
        .text(item.country)
        .on("click", async () => {
          inputFelt.property("value", "");
          resultsDiv.classed("hidden", true);
          await addCountryToGraph(item.country);
        });
    });

    inputFelt.on("keydown", async (event) => {
      if (event.key === "Enter") {
        const userInput = inputFelt.property("value").toLowerCase();

        // Find den nærmeste match
        const closestMatch = filteredCountries.find((item) =>
          item.country.toLowerCase().startsWith(userInput)
        );

        if (closestMatch) {
          inputFelt.property("value", "");
          resultsDiv.classed("hidden", true);
          await addCountryToGraph(closestMatch.country);
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
    resultsDiv.classed("hidden", true); // Skjul resultater
  }
});

async function addCountryToGraph(country) {
  // Tjek om landet allerede er tilføjet
  if (selectedCountries.includes(country)) {
    console.log(`${country} er allerede tilføjet`);
    return;
  }

  // Tjek om der allerede er to lande valgt
  if (selectedCountries.length >= 2) {
    alert("Du kan kun vælge to lande ad gangen.");
    return;
  }

  try {
    // Hent data for alle tre kategorier
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

    // Gem data
    graphData[country] = {
      internet: results[0],
      mobile: results[1],
      electricity: results[2],
    };

    // Tilføj land til listen
    selectedCountries.push(country);

    // Opdater grafen
    updateGraph();
  } catch (error) {
    console.error("Fejl ved hentning:", error);
  }
}

// Fjern land fra grafen
function removeCountry(country) {
  const index = selectedCountries.indexOf(country);
  if (index > -1) {
    selectedCountries.splice(index, 1);
    delete graphData[country];
    updateGraph();
  }
}

// Funktion til at opdatere grafen
function updateGraph() {
  // Ryd eksisterende indhold
  chartDiv.html("");
  legendDiv.html("");

  // Tjek om der er nogen lande
  if (Object.keys(graphData).length === 0) {
    console.log("Ingen data at vise");
    return;
  }

  // Definer grafmål og margener
  let width = 800;
  let height = 500;
  let margin = { top: 20, right: 200, bottom: 50, left: 50 };

  function updateDimensions() {
    if (window.innerWidth < 900) {
      width = 400;
      height = 300;
      margin = { top: 10, right: 150, bottom: 25, left: 25 };
    } else if (window.innerWidth < 1300) {
      width = 800;
      height = 425;
      margin = { top: 15, right: 200, bottom: 40, left: 40 };
    } else {
      width = 800;
      height = 500;
      margin = { top: 20, right: 200, bottom: 50, left: 50 };
    }
  }

  // Lyt på ændringer af vinduets størrelse
  window.addEventListener("resize", updateDimensions);

  // Første opdatering
  updateDimensions();

  const svg = chartDiv
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Bestem max-værdier for alle lande
  const maxInternet = d3.max(
    selectedCountries.flatMap((country) =>
      graphData[country].internet.map((d) => d.internet_usage)
    )
  );
  const maxMobile = d3.max(
    selectedCountries.flatMap((country) =>
      graphData[country].mobile.map((d) => d.telephones_per_100)
    )
  );
  const maxElectricity = d3.max(
    selectedCountries.flatMap((country) =>
      graphData[country].electricity.map((d) => d.electricity_access_percentage)
    )
  );

  const minYear = d3.min(
    selectedCountries.flatMap((country) =>
      graphData[country].internet.map((d) => d.year)
    )
  );
  const maxYear = d3.max(
    selectedCountries.flatMap((country) =>
      graphData[country].internet.map((d) => d.year)
    )
  );

  const xScale = d3
    .scaleLinear()
    .domain([minYear, maxYear])
    .range([margin.left, width + 150 - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(maxInternet, maxMobile, maxElectricity) * 1.1])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const line = d3
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.value));

  // Tilføj akser
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
    .text("% / ANTAL");

  // Opret en gruppe til labels
  const labelGroup = svg.append("g").attr("class", "label-group");

  // Iterér over hvert land
  selectedCountries.forEach((country, countryIndex) => {
    const countryColor = countryColors[countryIndex % countryColors.length];
    const dataTypes = [
      {
        type: "internet",
        color: dataColors[countryIndex].internet,
        label: "Internet Usage",
      },
      {
        type: "mobile",
        color: dataColors[countryIndex].mobile,
        label: "Mobile Phones",
      },
      {
        type: "electricity",
        color: dataColors[countryIndex].electricity,
        label: "Electricity Access",
      },
    ];

    const usedYPositions = [];

    dataTypes.forEach(({ type, color, label }) => {
      if (dataLoaded[type] && graphData[country][type]) {
        createGraphLine(
          svg,
          labelGroup,
          graphData[country][type],
          type,
          color,
          line,
          xScale,
          yScale,
          margin,
          country,
          countryColor,
          usedYPositions,
          width,
          countryIndex
        );
      }
    });

    // Tilføj land til legenden
    const legendItem = legendDiv
      .append("div")
      .attr("class", "legend-item")
      .style("display", "flex")
      .style("align-items", "center")
      .style("margin-bottom", "10px");

    legendItem
      .append("span")
      .text("✖")
      .style("cursor", "pointer")
      .style("margin-right", "10px")
      .style("color", "red")
      .on("click", () => removeCountry(country));

    legendItem
      .append("span")
      .text(country)
      .style("margin-right", "10px")
      .style("font-weight", "bold");

    dataTypes.forEach(({ type, color, label }) => {
      legendItem
        .append("span")
        .style("display", "inline-block")
        .style("width", "10px")
        .style("height", "10px")
        .style("background-color", color)
        .style("margin-right", "5px")
        .attr("title", label);
    });
  });
}

function createGraphLine(
  svg,
  labelGroup,
  data,
  type,
  color,
  line,
  xScale,
  yScale,
  margin,
  country,
  countryColor,
  usedLabels,
  width,
  countryIndex
) {
  const formattedData = data.map((d) => ({
    year: +d.year,
    value:
      +d[
        type === "internet"
          ? "internet_usage"
          : type === "mobile"
          ? "telephones_per_100"
          : "electricity_access_percentage"
      ],
  }));

  // Tegn linjen
  svg
    .append("path")
    .datum(formattedData)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", 2)
    .attr("d", line);

  // Find det højeste punkt
  const topPoint = formattedData.reduce((max, d) =>
    d.value > max.value ? d : max
  );

  const x = xScale(topPoint.year);
  const yOriginal = yScale(topPoint.value);

  // Tegn den stiplede linje
  svg
    .append("line")
    .attr("x1", x)
    .attr("x2", margin.left)
    .attr("y1", yOriginal)
    .attr("y2", yOriginal)
    .attr("stroke", color)
    .attr("stroke-dasharray", "4 2")
    .attr("stroke-width", 1);

  // Definér kolonnepositioner for labels
  const columnPositions = [
    { x: margin.left + 10, y: margin.top + 20 },
    { x: width - margin.right + 10, y: margin.top + 20 },
  ];

  // Vælg kolonneposition baseret på landets indeks
  const labelPosition = columnPositions[countryIndex];

  // Beregn vertikal offset for hver datatype
  const verticalOffset = {
    internet: 0,
    mobile: 20,
    electricity: 40,
  };

  // Tilføj tekstlabel i kolonnen
  labelGroup
    .append("text")
    .attr("x", labelPosition.x)
    .attr("y", labelPosition.y + verticalOffset[type])
    .style("fill", color)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("text-anchor", "start")
    .text(`${country}: ${topPoint.value.toFixed(1)}`);
}

// Standard til Danmark
inputFelt.property("value", "Denmark");
addCountryToGraph("Denmark");

// Aktiver kun internet-grafen initialt
toggleOpacity(GrafInternetLag, "internet");

// Vælg HTML-elementer med D3
const inputFelt = d3.select("#food");
const resultsDiv = d3.select("#results");
const chartDiv = d3.select("#chart");
const kikkertKnap = d3.select("#kikkert");

// Knapper til at vælge graferne
const GrafInternet = d3.select("#GrafInternet");
const GrafMobil = d3.select("#GrafMobil");
const GrafElektricitet = d3.select("#GrafElektricitet");

// Lag for graferne
const GrafElektricitetLag = d3.select("#checkedelektricitet");
const GrafInternetLag = d3.select("#checkedinternet");
const GrafMobilLag = d3.select("#checkedmobil");

// Variabler til at holde styr på om data er hentet
let dataLoaded = {
  internet: false,
  mobile: false,
  electricity: false,
};

// Variabler til at gemme hentet data
let graphData = {
  internet: null,
  mobile: null,
  electricity: null,
};

// Funktion til at skifte gennemsigtighed af lag
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
  updateGraph(); // Opdater grafen hver gang en knap er klikket
}

// Tilføj klik-event til knapperne

// Internet
GrafInternet.on("click", () => {
  toggleOpacity(GrafInternetLag, "internet");
});

// Mobil
GrafMobil.on("click", () => {
  toggleOpacity(GrafMobilLag, "mobile");
});

// Elektricitet
GrafElektricitet.on("click", () => {
  toggleOpacity(GrafElektricitetLag, "electricity");
});

// Åben resultat diven (De foskellige lande) ved fokus på inputfeltet
inputFelt.on("focus", () => {
  resultsDiv.classed("hidden", false);
});

// Vis resultater, når der klikkes på kikkerten (Forstørrelsesglasset har id'et kikkert)
kikkertKnap.on("click", () => {
  resultsDiv.classed("hidden", false);
});

// Håndter indtastning i søgefeltet
inputFelt.on("input", async function () {
  const query = this.value.trim();

  // Fortæller at den skal fetche landende fra vores endpoint laver i server.js
  try {
    const response = await fetch(`/api/onGetCountry?country=${query}`);
    const data = await response.json();

    resultsDiv.html("");

    // Filtrér lande, der starter med det indtastede
    const filteredCountries = data.filter((item) =>
      item.country.toLowerCase().startsWith(query.toLowerCase())
    );

    // Vis filtrerede lande som klikbare resultater
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

    // Håndter tryk på Enter-tasten
    inputFelt.on("keydown", async (event) => {
      if (event.key === "Enter") {
        const userInput = inputFelt.property("value").toLowerCase();

        // Find nærmeste match
        const closestMatch = filteredCountries.find((item) =>
          item.country.toLowerCase().startsWith(userInput)
        );

        if (closestMatch) {
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
// Registrer klik uden for inputfeltet og resultatområdet
// Skjuler resultatlisten hvis der klikkes udenfor

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

// Funktion til at hente og vise data for mobil, internet og elektricitet
async function loadCountryData(country) {
  try {
    // Opret en liste til API-kald
    const apiCalls = [];

    // Hent data fra API for hver kategori

    // Internet
    apiCalls.push(
      fetch(`/api/internet_data?country=${country}`).then((response) =>
        response.json()
      )
    );

    // Mobil
    apiCalls.push(
      fetch(`/api/telephones_data?country=${country}`).then((response) =>
        response.json()
      )
    );

    // Elektricitet
    apiCalls.push(
      fetch(`/api/electricity_data?country=${country}`).then((response) =>
        response.json()
      )
    );

    // Vent på at alle API-kald er færdige
    const results = await Promise.all(apiCalls);

    // Gem dataen i de globale variabler
    graphData.internet = results[0];
    graphData.mobile = results[1];
    graphData.electricity = results[2];

    updateGraph(); // Opdater grafen med den hentede data
  } catch (error) {
    console.error("Fejl under datahentning:", error);
  }
}

// Funktion til at opdatere grafen med ny data
function updateGraph() {
  // Tjek om data er tilgængelig
  if (!graphData.internet || !graphData.mobile || !graphData.electricity) {
    console.log("Data blev ikke hentet korrekt.");
    return;
  }

  chartDiv.html(""); // Ryd tidligere grafer

  // Definer dimensioner og margener
  let width = 800;
  let height = 500;
  let margin = { top: 20, right: 30, bottom: 50, left: 50 };

  // Funktion til at opdatere dimensioner baseret på skærmbredde
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

  // Opret SVG-element til grafen
  const svg = chartDiv
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Opret skalaer for x- og y-aksen
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

  // Definer linjefunktion til graferne
  const line = d3
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.value));

  // Tilføj akser

  // Tilføjer x-aksen
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  // Tilføjer y-aksen
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

  // Tilføj akse-labels

  // X-akse
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text("ÅRSTAL");

  // Y-akse
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text("PROCENT");

  // Opret grafer for hver datatype
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
// Funktion til at oprette en linje i grafen med interaktivitet
function createGraphLine(svg, data, type, color, line, xScale, yScale) {
  // Formatter data til at passe til den ønskede struktur
  const formattedData = data.map((d) => ({
    year: +d.year, // Konverter år til et tal
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
    type, // Tilføj datatypen til infobox
  }));

  // Opret linjen med en tykkere streg
  const graphLine = svg
    .append("path")
    .datum(formattedData)
    .attr("fill", "none")
    .attr("stroke", color) // Sæt linjens farve
    .attr("stroke-width", 4.5) // Øg størrelse for bedre synlighed, og interaktivitet
    .attr("d", line); // Anvend linjefunktionen

  // Opret Graf infobox-elementet
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0); // Skjul graf info box fra start

  // Tilføj interaktivitet ved mus-over
  graphLine
    .on("mouseover", function (event, d) {
      // Find musepositionen
      const mouseX = d3.pointer(event)[0];
      const mouseY = d3.pointer(event)[1];

      // Find det nærmeste datapunkt til musen
      const closestData = formattedData.reduce((prev, curr) => {
        return Math.abs(xScale(curr.year) - mouseX) <
          Math.abs(xScale(prev.year) - mouseX)
          ? curr
          : prev;
      });

      // Tilføj en større cirkel for at fremhæve punktet
      svg
        .append("circle")
        .attr("cx", xScale(closestData.year))
        .attr("cy", yScale(closestData.value))
        .attr("r", 8) // Større radius for nemmere interaktion
        .attr("fill", color)
        .style("pointer-events", "none"); // Forhindre, at cirklen blokerer andre events

      // Vis værktøjstip med år, værdi og datatype
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(
          `År: ${closestData.year}<br>Værdi: ${closestData.value}<br>Datatype: ${closestData.type}`
        )
        .style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", function () {
      // Fjern cirklen, når musen forlader området
      svg.selectAll("circle").remove();

      // Skjul info box
      tooltip.transition().duration(500).style("opacity", 0);
    });
}

// Sæt standardlandet til Danmark
inputFelt.property("value", "Denmark");
loadCountryData("Denmark");

// Aktivér kun internet-laget som standard
toggleOpacity(GrafInternetLag, "internet");

const inputFelt = d3.select("#food");
const resultsDiv = d3.select("#results");
const chartDiv = d3.select("#chart");

// Inputfelt funktion
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
          await loadCountryData(item.country); // Hent og vis data for landet
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

// Funktion til at hente og vise data som linjediagram for internet, telefoner og elektricitet
async function loadCountryData(country) {
  try {
    const [internetResponse, telephonesResponse, electricityResponse] =
      await Promise.all([
        fetch(`/api/internet_data?country=${country}`),
        fetch(`/api/telephones_data?country=${country}`),
        fetch(`/api/electricity_data?country=${country}`),
      ]);

    const internetData = await internetResponse.json();
    const telephonesData = await telephonesResponse.json();
    const electricityData = await electricityResponse.json();

    // Fjern eksisterende diagram
    chartDiv.html("");

    // Konverter data til passende format
    const formattedInternetData = internetData.map((d) => ({
      year: +d.year,
      internet_usage: +d.internet_usage,
    }));

    const formattedTelephonesData = telephonesData.map((d) => ({
      year: +d.year,
      telephones_per_100: +d.telephones_per_100,
    }));

    const formattedElectricityData = electricityData.map((d) => ({
      year: +d.year,
      electricity_access_percentage: +d.electricity_access_percentage,
    }));

    // Definer dimensions og margins
    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    const svg = chartDiv
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(formattedInternetData, (d) => d.year))
      .range([margin.left, width - margin.right]);

    const yScaleInternet = d3
      .scaleLinear()
      .domain([0, d3.max(formattedInternetData, (d) => d.internet_usage)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const yScaleTelephones = d3
      .scaleLinear()
      .domain([0, d3.max(formattedTelephonesData, (d) => d.telephones_per_100)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const yScaleElectricity = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          formattedElectricityData,
          (d) => d.electricity_access_percentage
        ),
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const lineInternet = d3
      .line()
      .x((d) => xScale(d.year))
      .y((d) => yScaleInternet(d.internet_usage));

    const lineTelephones = d3
      .line()
      .x((d) => xScale(d.year))
      .y((d) => yScaleTelephones(d.telephones_per_100));

    const lineElectricity = d3
      .line()
      .x((d) => xScale(d.year))
      .y((d) => yScaleElectricity(d.electricity_access_percentage));

    // Tilføj akser
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScaleInternet));

    // Tilføj linjer
    svg
      .append("path")
      .datum(formattedInternetData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", lineInternet);

    svg
      .append("path")
      .datum(formattedTelephonesData)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2)
      .attr("d", lineTelephones);

    svg
      .append("path")
      .datum(formattedElectricityData)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 2)
      .attr("d", lineElectricity);

    // Labels for each line
    svg
      .append("text")
      .attr("x", width - margin.right - 10)
      .attr(
        "y",
        yScaleInternet(
          formattedInternetData[formattedInternetData.length - 1].internet_usage
        )
      )
      .attr("dy", ".35em")
      .style("fill", "steelblue")
      .style("font-size", "12px")
      .style("text-anchor", "start")
      .text("Internet Usage (%)");

    svg
      .append("text")
      .attr("x", width - margin.right - 10)
      .attr(
        "y",
        yScaleTelephones(
          formattedTelephonesData[formattedTelephonesData.length - 1]
            .telephones_per_100
        )
      )
      .attr("dy", ".35em")
      .style("fill", "green")
      .style("font-size", "12px")
      .style("text-anchor", "start")
      .text("Telephones per 100");

    svg
      .append("text")
      .attr("x", width - margin.right - 10)
      .attr(
        "y",
        yScaleElectricity(
          formattedElectricityData[formattedElectricityData.length - 1]
            .electricity_access_percentage
        )
      )
      .attr("dy", ".35em")
      .style("fill", "orange")
      .style("font-size", "12px")
      .style("text-anchor", "start")
      .text("Electricity Access (%)");
  } catch (error) {
    console.error("Kunne ikke hente data:", error);
  }
}

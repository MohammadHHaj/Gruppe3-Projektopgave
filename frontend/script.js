function fetchAlbums() {
  const year = d3.select("#year").property("value");
  console.log("Det valgte årstal:", year);

  d3.json(`/api/internet_usage?year=${year}`)
    .then((data) => {
      if (!data || data.length === 0) {
        d3.select("#data-table").html("No data found for selected year.");
        return;
      }

      const headers = Object.keys(data[0]);
      const table = d3.select("#data-table").html("").append("table");

      table
        .append("thead")
        .append("tr")
        .selectAll("th")
        .data(headers)
        .enter()
        .append("th")
        .text((d) => d);

      table
        .append("tbody")
        .selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .selectAll("td")
        .data((d) => Object.values(d))
        .enter()
        .append("td")
        .text((d) => d);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      d3.select("#data-table").html("Error fetching data.");
    });
}

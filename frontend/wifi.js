function fetchWifi() {
    const year = d3.select('#year').property('value');
    d3.json(`/api/internet_usage?year=${year}`).then((dataWifi) => {
        console.log(dataWifi);
        if (dataWifi.length === 0) {
            d3.select('#map').html('No data found.')
        }
        const table = d3.select('#map')
            .html('')
            .append('table');
        table.append('thead')
            .append('tr')
            .selectAll('th')
            .data(headers)
            .enter()
            .append('th')
            .text((d) => d);
        table.append('tbody')
            .selectAll('tr')
            .data(dataWifi)
            .enter()
            .append('tr')
            .selectAll('td')
            .data((d) => Object.values(d))
            .enter()
            .append('td')
            .text((d) => d);
    });
}



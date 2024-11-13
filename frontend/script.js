function fetchData() {
    const year = d3.select('#year').property('value');
    d3.json(`/api/internet_usage?year=${year}`).then((data) => {
        console.log(data);
        if (data.length === 0) {
            d3.select('#visuals').html('No albums found.')
        }
        const headers = Object.keys(data[0]);
        const table = d3.select('#visuals')
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
            .data(data)
            .enter()
            .append('tr')
            .selectAll('td')
            .data((d) => Object.values(d))
            .enter()
            .append('td')
            .text((d) => d);
    });
}



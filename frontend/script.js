
function fetchAlbums() {
    const year = d3.select('#year').property('value');
    d3.json(`/api/albums=${year}`).then((internet_usage) => {
        if (internet_usage.length === 0) {
            d3.select('#visuals').html('No albums found.')
        }
        const headers = Object.keys(internet_usage[0]);
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
            .data(internet_usage)
            .enter()
            .append('tr')
            .selectAll('td')
            .data((d) => Object.values(d))
            .enter()
            .append('td')
            .text((d) => d);
    })
    .catch((error) => {
        console.error('Error fetching albums:', error);
        d3.select('#visuals').html('Failed to load albums.');
    });
}


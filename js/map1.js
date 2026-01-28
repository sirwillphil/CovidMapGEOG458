mapboxgl.accessToken =
'pk.eyJ1Ijoid2lsbHNlbmVua28iLCJhIjoiY21oNm9tenlzMGxmNzJpb211eWN4OWhzMiJ9.CNtId7OzmVwm4EajEwdCGg';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-98.5833, 39.8333], // starting position [lng, lat]
    zoom: 4 // starting zoom
});

map.on('load', () => {
    
    map.setProjection({
        name: 'albers',
        center: [-98.5833, 39.8333],
        parallels: [29.5, 45.5]
    });

    map.addSource('covidrates', {
        type: 'geojson',
        data: 'assets/us-covid-2020-rates.json'
    });

    map.addLayer({
        'id': 'covidrates-layer',
        'type': 'fill',
        'source': 'covidrates',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'rates'],

                '#FFEDA0',   // 0–10
                10,
                '#FED976',   // 10–25
                25,
                '#FEB24C',   // 25–50
                50,
                '#FD8D3C',   // 50–100
                100,
                '#FC4E2A'    // 100+
            ],
            'fill-outline-color': '#BBBBBB',
            'fill-opacity': 0.7,
        }
    });
    map.addLayer({
        'id': 'covidData-borders',
        'type': 'line',
        'source': 'covidrates',
        'paint': {
            'line-color': 'black',   // border color
            'line-width': 1            // thickness in pixels
        }
    });

    map.on('mousemove', ({point}) => {
        const covidrates = map.queryRenderedFeatures(point, {
        layers: ['covidrates-layer']
    });

    document.getElementById('text-description').innerHTML = covidrates.length ?
        `<h3>${covidrates[0].properties.county} County, ${covidrates[0].properties.state}</h3><p><strong><em>${covidrates[0].properties.rates}</strong> cases per 1000 residents</em></p>` :
        `<b>Hover over a County!</b>`;
    });
    
    const layers = [
        '0-10',
        '10-25',
        '25-50',
        '50-100',
        '100+'
    ];

    const colors = [
        '#FFEDA0', 
        '#FED976',   // 10–25
        '#FEB24C',   // 25–50
        '#FD8D3C',   // 50–100
        '#FC4E2A' 
    ];

    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>    Covid-19 Case Rate <br> By County (1/1k)</b><br><br>";

    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });
});

    
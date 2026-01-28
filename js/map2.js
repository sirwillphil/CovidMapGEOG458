mapboxgl.accessToken =
'pk.eyJ1Ijoid2lsbHNlbmVua28iLCJhIjoiY21oNm9tenlzMGxmNzJpb211eWN4OWhzMiJ9.CNtId7OzmVwm4EajEwdCGg';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v11', // style URL
    center: [-98.5833, 39.8333], // starting position [lng, lat]
    zoom: 4 // starting zoom
});

const grades = [1000, 5000, 10000, 25000];

const colors = [
    '#fff5f0',  // < 1,000 cases (very pale pink)
    '#fee0d2',  // 1,000–5,000
    '#fc9272',  // 5,000–10,000
    '#de2d26',  // 10,000–25,000
    '#a50f15'   // 25,000+ cases (dark red)
];

const radii = [
    4,   // < 1,000
    8,   // 1,000–5,000
    12,  // 5,000–10,000
    18,  // 10,000–25,000
    26   // 25,000+
];
    
map.on('load', () => {
    map.setProjection({
        name: 'albers',
        center: [-98.5833, 39.8333],
        parallels: [29.5, 45.5]
    });

    map.addSource('covidcounts', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.json'
    });

    map.addLayer({
        'id': 'covidcounts-layer',
        'type': 'circle',
        'source': 'covidcounts',
        'paint': {
            // increase the radii of the circle as the zoom level and dbh value increases
            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [grades[0], radii[0]],
                    [grades[1], radii[1]],
                    [grades[2], radii[2]]
                ]
            },
            'circle-color': {
                'property': 'cases',
                'stops': [
                    [grades[0], colors[0]],
                    [grades[1], colors[1]],
                    [grades[2], colors[2]]
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.6
        }
    });

    map.on('mousemove', ({point}) => {
        const covidcounts = map.queryRenderedFeatures(point, {
        layers: ['covidcounts-layer']
    });

    document.getElementById('text-description').innerHTML = covidcounts.length ?
        `<h3>${covidcounts[0].properties.county} County, ${covidcounts[0].properties.state}</h3><p><strong><em>${covidcounts[0].properties.cases}</strong> Cases</em></p>` :
        `<b>Hover over a County!</b>`;
    });


    const legend = document.getElementById('legend');
    //set up legend grades and labels
    var labels = ['<strong>Number of Cases</strong>'],
        vbreak;
    //iterate through grades and create a scaled circle and label for each
    for (var i = 0; i < grades.length; i++) {
        vbreak = grades[i];
        // you need to manually adjust the radius of each dot on the legend 
        // in order to make sure the legend can be properly referred to the dot on the map.
        dot_radii = 2 * radii[i];
        labels.push(
            '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
            'px; height: ' +
            dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
            '</span></p>');
    }

    legend.innerHTML = labels.join('');
});

    
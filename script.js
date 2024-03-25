// event listeners for the quiz buttons
document.getElementById('with-comma').addEventListener('click', function() {
    showResults('With Oxford Comma');
});
document.getElementById('without-comma').addEventListener('click', function() {
    showResults('Without Oxford Comma');
});

// display the results based on the user's selection
function showResults(preference) {
    // hide with results page
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results-page').style.display = 'block';

    fetch('processed_data.json')
        .then(response => response.json())
        .then(data => {
            // percentages
            const withCommaPercentage = data.find(d => d.Preference === 'With Oxford Comma').Percentage;
            const withoutCommaPercentage = data.find(d => d.Preference === 'Without Oxford Comma').Percentage;

            // prepare for pie chart, highlight user selection
            const resultsData = [
                {option: 'With Oxford Comma', value: withCommaPercentage, color: '#4CAF50'},
                {option: 'Without Oxford Comma', value: withoutCommaPercentage, color: '#c02424'}
            ];

            // pie color based on preference
            const highlightColor = '#9b9892'; // grey for part not selected
            if (preference === 'Without Oxford Comma') {
                resultsData[0].color = highlightColor; // same as the buttons
            } else {
                resultsData[1].color = highlightColor;
            }

            drawPieChart(resultsData);
        })
        .catch(error => console.error('Error loading the data:', error));
}

function drawPieChart(data) {
    const width = 750;
    const height = 750;
    const radius = Math.min(width, height) / 2; // radius based on svg dimensions

    // ensure only one pie chart displayed at a time
    d3.select('#results-container').html('');

    // svg element within the results container
    const svg = d3.select('#results-container').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // set up pie layout generator
    const pie = d3.pie()
        .sort(null)
        .value(d => d.value); // data maps to pie slice

    // arc generator for the slices
    const path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0); // non-zero would create a donut chart

    // bind data to custom elements
    // create a 'g' element for each slice
    const arc = svg.selectAll('.arc')
        .data(pie(data))
        .enter().append('g')
        .attr('class', 'arc'); // Class used for styling and selection

    // draw pie slices with transition effect
    arc.append('path')
        .attr('fill', d => d.data.color)
        .attr('d', path)
        .transition() // animate the pie chart formation
        .duration(1000)
        .attrTween('d', function(d) {
            const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
            return function(t) {
                d.endAngle = i(t);
                return path(d);
            };
        })
        .end()
        .then(() => {
            // hover interactivity
            arc.selectAll('path')
                .on('mouseover', function(event, d) {
                    // enlarge slice on hover
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .attr('d', path.outerRadius(radius - 5));
                })
                .on('mouseout', function(event, d) {
                    // return to original size on mouse out
                    d3.select(this)
                        .transition()
                        .duration(300)
                        .attr('d', path.outerRadius(radius - 10));
                });
        });

    // text labels to each pie slice
    arc.append("text")
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; }) // Position text at slice centroid
        .attr("dy", "5px") // Vertically center text
        .attr("text-anchor", "middle") // Horizontally center text
        .text(function(d) { return `${d.data.option}: ${d.data.value.toFixed(1)}%`; }) // Display text
        .style("fill", "#fff"); // Text color
}


document.addEventListener('DOMContentLoaded', () => {
    // attach click event listeners to quiz buttons
    const withCommaButton = document.getElementById('with-comma');
    const withoutCommaButton = document.getElementById('without-comma');

    withCommaButton.addEventListener('click', () => {
        showResults('With Oxford Comma');
    });

    withoutCommaButton.addEventListener('click', () => {
        showResults('Without Oxford Comma');
    });
});
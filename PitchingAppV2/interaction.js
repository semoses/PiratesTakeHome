// CONSTANTS

const width = (window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth);
const height = width; // make the graph a square
const margin = width * 0.05; // 5%  of the window is the margin
const radius = 2;
const innerWidth = width - (margin * 2);
const innerHeight = height - (margin * 2);
const centerX = innerWidth / 2,
    centerY = innerHeight / 2;
const strikeZoneWidth = 17 / 12;
const strikeZoneHeight = 2;
const tooltipOffset = 20;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HELPER FUNCTIONS

/* 
 getGraphMax is a helper function that returns the maximum absolute value for either field1 or field2
 this value is used when setting the scale of the visualization axes
 @param {Array} data - An array of objects
 @param {String} field1 - One of the fields determining the max
 @param {String} field2 - The other field determining the max
 @returns {Number} - The maximum absolute value of field1 or field2 in the set of data
 @example
 const data = [{pitchId: 1, plateX: -5.4, plateZ: 0.2}, {pitchId: 2, plateX: 3.8, plateZ: -2.4}];
 const max = getGraphMax(data, "plateX", "plateZ");
 console.log(max);
 5.4
*/
function getAbsMax(data, field1, field2) {
    let max;
    var xMax = d3.max(data, d => Math.abs(d[field1]));
    var yMax = d3.max(data, d => Math.abs(d[field2]));

    if (xMax > yMax) {
        m = (innerWidth) / (xMax * 2);
        max = xMax
    } else {
        m = (innerWidth) / (yMax * 2);
        max = yMax
    }
    return max
}

/* 
 getUniqueFieldValues is a helper function that returns a unique list of values for 
 this value is used when setting the scale of the visualization axes
 @param {Array} data - An array of objects
 @param {String} field - The field thats values are used to create the unique list
 @param {Array} filter - An array of values not to be included in the unique list
 @returns {Array} - An array of unique values of data for a given field
 @example
 const data = [ {pitchId: 1, pitchType: "Curveball"},
                {pitchId: 2, pitchType: "Fastball (4-seam)"},
                {pitchId: 3, pitchType: "Slider"},
                {pitchId: 4, pitchType: "Curveball"},
                {pitchId: 5, pitchType: "Unknown"}
    ];
 const uniqVals = getUniqueFieldValues(data, "pitchType", ["Unknown"]);
 console.log(uniqVals);
 ["Curveball", "Fastball (4-seam)", "Slider"]
*/
function getUniqueFieldValues(data, field, filter) {
    var lookup = {}
    var result = []

    for (let i = 0; i < data.length; i++) {
        var value = data[i][field];

        if (!(value in lookup) && !(filter.includes(value))) {
            lookup[value] = 1;
            result.push(value);
        }
    }
    return result;
}

/* 
getDataByFieldVal is a helper function that returns a subset of filtered
where a field equals a specified value
 @param {Array} data - An array of objects
 @param {String} field - The field that is used to subset the data
 @param {String} val - The value that the field values are checked against 
 @returns {Array} - An array of data where the objects field values are equal to the specified value
 @example
 const data = [ {pitchId: 1, pitchType: "Curveball"},
                {pitchId: 2, pitchType: "Fastball (4-seam)"},
                {pitchId: 3, pitchType: "Slider"},
                {pitchId: 4, pitchType: "Curveball"},
                {pitchId: 5, pitchType: "Sinker"}
    ];
 const curveballData = getUniqueFieldValues(data, "pitchType", "Curveball");
 console.log(curveballData);
 [ {pitchId: 1, pitchType: "Curveball"}, {pitchId: 4, pitchType: "Curveball"} ]
*/
function getDataByFieldVal(data, field, val) {
    return data.filter(function (entry) {
        return entry[field] === val;
    })
}

/* 
setButtonNames is a helper function that updates the generic button names (Button 0, 
Button 1... etc) with the names contained in NamesArray
This function has logic specific to the pitch graph information, but could be abstracted 
out if needed for future use.
 @param {Array} nameArray - An array of names to be used in button names
 @param {String} buttonIdStart - The starting string used in the html doc button ids
 NOTE: For this function, the button id's on the page must be of the same form buttonIdStart-#
*/
function setButtonNames(nameArray, buttonIdStart) {
    for (let i = 0; i < nameArray.length; i++) {
        document.getElementById('pitchingGraph-' + (i)).innerText = nameArray[i] + " in SZ";
    }
}

/*
 Set up the page for the visualizations
 Namely: 
 - Grab and display the player name dynamically based on the given data
 - Generate inital graph (because the user has not selected a button yet)
 - Link the buttons such that when a user clicks one, the previous data is cleared and
    a new graph is generated
 - Rename the buttons to represent what they actually display
*/
function setUp() {
    document.getElementById('player-name').innerText = data[0].pitcherName.split(",").reverse().join(" ");

    const uniqPitchVals = getUniqueFieldValues(data, "pitchType", ["Unknown"]);

    generateGraph(uniqPitchVals[0]);

    // loop through each button and add a click event listener to change generated graph
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            d3.selectAll("svg > *").remove();
            generateGraph(uniqPitchVals[button.id.split("-")[1]]);
        });
    });

    setButtonNames(uniqPitchVals)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// D3 LOGIC

setUp();

function generateGraph(pitchType) {

    // Get data and data specific
    const pitchData = getDataByFieldVal(data, "pitchType", pitchType);
    const max = getAbsMax(pitchData, "plateX", "plateZ");
    const szPercent = parseFloat(pitchData.filter(({ isInZone }) => isInZone === 1).length * 100 / pitchData.length).toFixed(2)

    var background = d3.select('body')
        .append('svg')
        .attr('width', width * 1.5)
        .attr('height', width)
        .attr('class', 'background');

    var svg = d3.select('body')
        .append('svg')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('class', 'svg');

    var tooltip = d3.select("#pitchInfo")
        .append("div")
        .attr("id", "tooltip");

    // Scale xAxis
    const xAxis = d3.scaleLinear()
        .domain([-max, max])
        .range([0, innerWidth]);

    // Draw the xAxis
    svg.append("g")
        .attr("transform", `translate(${centerX - innerWidth / 2},${innerHeight - margin})`)
        .call(d3.axisBottom(xAxis));

    // Label xAxis
    background.append("text")
        .attr("class", "axesLabel")
        .attr("text-anchor", "end")
        .attr("x", innerWidth / 1.2)
        .attr("y", height - margin / 2)
        .text("X Coordinate of Ball At Plate Relative to Stike Zone (ft)");

    // Draw xAxis Grid
    svg.append("g")
        .attr("transform", `translate(${centerX - innerWidth / 2},${innerHeight - margin})`)
        .attr("class", "axesGrid")
        .call(d3.axisBottom(xAxis).tickSize(-innerHeight).tickFormat(''));

    // Scale yAxis
    const yAxis = d3.scaleLinear()
        .domain([-max + 2.5, max + 2.5])
        .range([innerHeight, 0]);

    // Draw the yAxis
    svg.append("g")
        .attr("transform", `translate(${margin},${0})`)
        .call(d3.axisLeft(yAxis));

    // Label yAxis
    background.append("text")
        .attr("class", "axesLabel")
        .attr("text-anchor", "end")
        .attr("y", margin / 2)
        .attr("dy", ".75em")
        .attr("dx", "-10em")
        .attr("transform", "rotate(-90)")
        .text("Z Coordinate of Ball At Plate Relative to Stike Zone (ft)");

    // Draw yAxis Grid
    svg.append("g")
        .attr("transform", `translate(${margin},${0})`)      // This controls the vertical position of the Axis
        .attr("class", "axesGrid")
        .call(d3.axisLeft(yAxis).tickSize(-innerHeight).tickFormat(''));

    // Label Graph
    background.append("text")
        .attr("class", "axesLabel")
        .attr("text-anchor", "end")
        .attr("y", margin / 1.5)
        .attr("x", innerWidth / 1.3)
        .text(`${pitchType} Relative to Strike Zone`);

    var circle = svg.selectAll('circle')
        .data(pitchData)
        .enter()
        .append('circle')
        .attr('r', radius)
        .attr('cx', (d) => {
            return centerX + (d.plateX * m);
        })
        .attr('cy', (d) => {
            return centerY - (d.plateZ * m) + (2.5 * m);
        })
        .attr('class', 'svg-circle')
        .on('mouseover', handleMouseOver)
        .on('mousemove', handleMouseMove)
        .on('mouseout', handleMouseOut);

    var strikeZone = svg.append('rect')
        .attr("x", centerX - strikeZoneWidth / 2 * m)
        .attr("y", centerY - strikeZoneHeight / 2 * m)
        .attr("height", m * 2)
        .attr("width", m * (17 / 12))
        .attr('class', 'strikeZone');

    // Add meta pitch info
    var meta = svg.append("text")
        .attr("class", "axesLabel")
        .attr("text-anchor", "end")
        .attr("x", innerWidth * 0.85)
        .attr("y", margin)
        .text(`n = ${pitchData.length}`)

    svg.append("text")
        .attr("class", "axesLabel")
        .attr("text-anchor", "end")
        .attr("x", innerWidth * 0.9)
        .attr("y", margin * 2)
        .text(`% in SZ: ${szPercent}%`)

    // tooltip functions that control what happens when the cursor moves over and off of a data point
    function handleMouseOver() {
        tooltip.style("visibility", "visible");
    };

    function handleMouseMove(event, d) {
        tooltip.style("top", event.clientY + tooltipOffset + "px").style("left", event.clientX + tooltipOffset + "px")
            .html(parseFloat(d.plateX).toFixed(2) + ", " + parseFloat(d.plateZ).toFixed(2));
    };

    function handleMouseOut() {
        tooltip.style("visibility", "hidden");
    }
}

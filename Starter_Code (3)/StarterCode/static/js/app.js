// Assign the URL to a constant variable.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise in a pending state.
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Set up the Dashboard upon sccessful data loading
dataPromise.then(data => {
    // Select the dropdown menu 
    var selector = d3.select("#selDataset");

    // Retrive the sample names from the dataset
    var sampleNames = data.names;

    // Include the sample names as option in the dropdown menu
    sampleNames.forEach(sample => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
    });

    //  Assign the initial sample name to be displayed first on the dashboard.
    var initialSample = sampleNames[0];

    //  Display information and charts for the initial sample.
    buildMetadata(initialSample, data);
    buildCharts(initialSample, data);
});

// This function executes when a new sample is chosen from the dropdown menu.
function optionChanged(newSample) {
    // Update the information and charts for the new sample
    dataPromise.then(data => {
        buildMetadata(newSample, data);
        buildCharts(newSample, data);
    });
}

//  This function displays demographic information for the chosen sample.
function buildMetadata(sample, data) {
    // Retrieve metadata for all samples.
    var metadata = data.metadata;

    // Filter the metadata to include only the chosen sample.
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var selectedSample = metadataArray[0];
    var PANEL = d3.select("#sample-metadata");

    // Remove the existing demographic datya
    PANEL.html("");

    //  Display the demographic details for the chosen sample.
    Object.entries(selectedSample).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
    });
}

// This function displays the charts corresponding to the selected sample
function buildCharts(sample, data) {
    // Get all the sample data
    var samples = data.samples;

    // Refine the sample data to exclusively incorporate the chosen sample.
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    // Filter the metadata information to exclusively involve the chosen sample.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var selectedSample = sampleArray[0];

    // Retrieve the data corresponding to the selected sample.
    var otu_ids = selectedSample.otu_ids;
    var otu_labels = selectedSample.otu_labels;
    var sample_values = selectedSample.sample_values;
    var wfreq = metadataArray[0].wfreq;

    // Code for Bar Chart
      // Generate y-axis labels by utilizing the slice function to extract only the top 10.
      var yticks = otu_ids.slice(0,10).map(outId => `OTU ${outId}`).reverse();

      // Invert the x-axis to guarantee the bar chart displays the largest values from top to bottom.
      var barData = [{
          x: sample_values.slice(0,10).reverse(),
          y: yticks,
          type: "bar",
          orientation: "h",
          text: otu_labels.slice(0,10),
      }];
  
  
      // Create the bar chart
      Plotly.newPlot("bar", barData);
  
    // Code for Gauge Chart
 // Trigonometry to calculate the meter point.
 var degrees = 180 - wfreq * 20,
 radius = .5;
var radians = degrees * Math.PI / 180;  // Calculate the angle in radians for the needle on the gauge chart
var x = radius * Math.cos(radians); // Calculate the x-coordinate for the needle
var y = radius * Math.sin(radians); // Calculate the y-coordinate for the needle

// Generate the path for the needle.
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
  pathX = String(x),
  space = ' ',
  pathY = String(y),
  pathEnd = ' Z';
var path = mainPath.concat(pathX, space, pathY, pathEnd);

// Generate the path for the needle.
var mainPath = 'M ',
pathX1 = -1 * Math.sin(radians) * .025,
pathY1 = Math.cos(radians) * .025,
pathX2 = -1 * pathX1,
pathY2 = -1 * pathY1; 

var path = mainPath.concat(pathX1, ' ', pathY1, ' L ', pathX2, ' ', pathY2, ' L ', String(x), ' ', String(y), ' Z'); 

// Generate the data for both the scattered plot and the pie chart
var scatterData = { 
type: 'scatter',
x: [0], y: [0],
marker: {
    size: 28, 
    color:'850000',
    },
showlegend: false,
text: wfreq,
hoverinfo: 'text'
};

var pieData = { 
values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
rotation: 90,
text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2','0-1', ''],
textinfo: 'text',
textposition:'inside',	  
marker: { 
    colors: ['rgba(15, 128, 0, .5)', 'rgba(15, 128, 0, .45)', 'rgba(15, 128, 0, .4)',
            'rgba(110, 154, 22, .5)', 'rgba(110, 154, 22, .4)','rgba(110, 154, 22, .3)',
            'rgba(210, 206, 145, .5)','rgba(210, 206, 145, .4)','rgba(210, 206, 145, .3)',
            'rgba(255, 255, 255, 0)']
    },
hole: .5,
type: 'pie',
hoverinfo: 'text',
showlegend: false
};

var gaugeData = [scatterData, pieData];

var gaugeLayout = {
    // Needle
    shapes: [{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: { color: '850000' }
    }],
    title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
    height: 500, width: 500,
    xaxis: { zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
    yaxis: { zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', gaugeData, gaugeLayout);  // Create the gauge chart

    // Code for Bubble Chart
      var bubbleData = [{
          x: otu_ids,
          y: sample_values,
          mode: "markers",
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth"
          },
          text: otu_labels
      }];
  
      var bubbleLayout = {
          xaxis: {title: "OTU ID"}
      };
  
      // Create the bubble chart
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    }
  
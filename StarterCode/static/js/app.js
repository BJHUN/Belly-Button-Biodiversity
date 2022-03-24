function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    console.log(selector);

    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

// Initialize the dashboard
init();


function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
}
// Demographics Panel
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}


function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        // Filter the data for the object with the desired sample number
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var sample_values = result.sample_values;
        console.log(sample_values);
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        // Get top 10 otu
        ylabel = otu_ids.slice(0, 10).map(otuIds => `OTU ${otuIds}`).reverse()
        console.log(ylabel);

        // Create Bar Chart
        var barData = [

            {

                y: ylabel,
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: 'bar',
                orientation: 'h',
            }
        ]

        var barlayout = {
            title: 'Top 10 Bacteria in Samples',

        }
        // Create plotly chart
        Plotly.newPlot("bar", barData, barlayout);

        // Create Bubble Chart
        var bubbledata = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: 'YlGnBu',
                } 
            }
        ]

        var bubblelayout = {
            title: "All Bacteria in Samples",
            showlegend: false,
            xaxis: {title:"OTU ID"},
            yaxis: {title:"Bacteria Count"},
        }
        // Generate the bubble chart
        Plotly.newPlot("bubble", bubbledata,bubblelayout);



    });
}













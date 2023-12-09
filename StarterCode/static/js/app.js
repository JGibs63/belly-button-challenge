// Establish the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


// Create dropdown including data
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // An array of id names
        let names = data.names;

        // Iterate through the names Array
        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Assign the first name to name variable
        let name = names[0];

        // Call functions to make the base graphics
        demo(name);
        bar(name);
        bubble(name);
        gauge(name);
    });
}

init();

// Create bar chart
function bar(chosenValue) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let samples = data.samples;

        // Filter data where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === chosenValue);

        // Assign the first object
        let object = filteredData[0];
        
        // Create trace for the bar chart
        let trace = [{
            x: object.sample_values.slice(0,10).reverse(),
            y: object.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: object.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "rgb(60,150,255)"
            },
            orientation: "h"
        }];
        
        // Plot the data
        Plotly.newPlot("bar", trace);
    });
}

// Make the demographics legend
function demo(chosenValue) {
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // Establish metadata array
        let metadata = data.metadata;
        
        // filter metadata
        let filteredData = metadata.filter((meta) => meta.id == chosenValue);
      
        // Assign the first object
        let object = filteredData[0]
        
        // select id in html in order to only pull desired data
        d3.select("#sample-metadata").html("");
  
        let entries = Object.entries(object);
        
        // Iterate through the entries array and append each h5 text for each key/value
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        // Log the entries Array
        console.log(entries);
    });
  }

// Create bubble chart
function bubble(chosenValue) {
    d3.json(url).then((data) => {

        let samples = data.samples; 
        let filteredData = samples.filter((sample) => sample.id === chosenValue);
        let object = filteredData[0];
    
        let trace = [{
            x: object.otu_ids,
            y: object.sample_values,
            text: object.otu_labels,
            mode: "markers",
            marker: {
                size: object.sample_values,
                color: object.otu_ids,
                colorscale: "Earth"
            }
        }];
    
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        Plotly.newPlot("bubble", trace, layout);
    });
}

// Toggle new plots when Test Subject is changed
function optionChanged(chosenValue) {
    demo(chosenValue);
    bar(chosenValue);
    bubble(chosenValue)
}
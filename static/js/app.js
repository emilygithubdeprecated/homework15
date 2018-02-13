/* Dropdown with list of all sample names */

function buildDropdown() {
    var selDataset = document.getElementById("selDataset");

    Plotly.d3.json('/names', function(error, data){
        if (error) return console.warn(error);
        for (i = 0; i < data.length; i++) {
                    SampleName=data[i]
                    var selDatasetItem = document.createElement("option");
                    selDatasetItem.text=SampleName;
                    selDatasetItem.value=SampleName;
                    selDataset.appendChild(selDatasetItem);
                }
    }
)}

buildDropdown()




/*

PIE CHART

Initialize with default sampleID = BB_940

*/

function getPieChartData(data) {
    
    if (data.samples.length>10) {
        endListRange=9
        }
    else endListRange=data.samples.length-1

    top10Samples=[]
    top10OTUIDs=[]
    for (i = 0; i < endListRange; i++) {
        top10Samples.push(+data.samples[i])
        top10OTUIDs.push(+data.otu_ids[i])
    }

    
    pieChartData = [{
        "labels": top10OTUIDs,
        "values": top10Samples,
        "type": "pie"}]

    return pieChartData
    
}


function buildPie(sampleID) {
    url='/samples/'+sampleID;
    Plotly.d3.json(url, function(error, data){
        if (error) return console.warn(error);

        var layout = {
            title: "It's a CHART"}
        var PIE = document.getElementById('pie');

        var trace=getPieChartData(data)

        Plotly.plot(PIE, trace, layout);
    })
}

buildPie('BB_940')


function updatePieChart(newdata) {
    url='/samples/'+newdata;
    Plotly.d3.json(url, function(error, data){
        if (error) return console.warn(error);

        var PIE = document.getElementById('pie');
        
        var trace=getPieChartData(data)

        console.log(trace)
        console.log(trace[0].labels)
        console.log(trace[0].values)
        Plotly.restyle(PIE, "labels", [trace[0].labels]);
        Plotly.restyle(PIE, "values", [trace[0].values]);
    })
  }



/*this is triggered when an option is selected from the dropdown*/
function optionChanged(sampleID) {
  
    //console.log(sampleID)

    /*print the metadata to the console*/
    //url="/metadata/"+sampleID

    //buildPie(sampleID)
    
    updatePieChart(sampleID)
    getMetadata(sampleID)

    }




    function getMetadata(sampleID) {
        url = '/metadata/'+sampleID
        Plotly.d3.json(url, function(error, data){
            if (error) return console.warn(error);
            
            var metadata_results={
                "AGE":data.AGE[0],
                "BBTYPE":data.BBTYPE[0],
                "ETHNICITY":data.ETHNICITY[0],
                "GENDER":data.GENDER[0],
                "LOCATION":data.LOCATION[0],
                "SAMPLEID":data.SAMPLEID[0]
            }

            var Metadata=document.getElementById('metadata')
            var BBType=document.getElementById('bbtype')
            var Ethnicity=document.getElementById('ethnicity')
            var Gender=document.getElementById('gender')
            var Location=document.getElementById('location')
            var SampleID=document.getElementById('sampleid')

            Age.innerHTML="Age: "+data.AGE[0]
            BBType.innerHTML="BBType: "+data.BBTYPE[0]
            Ethnicity.innerHTML="Ethnicity: "+data.ETHNICITY[0]
            Gender.innerHTML="Gender: "+data.GENDER[0]
            Location.innerHTML="Location: "+data.LOCATION[0]
            SampleID.innerHTML="Sample ID: "+data.SAMPLEID[0]


        })
        
    }



/*
function buildPlot() {
    Plotly.d3.json(url, function(error, response) {

        console.log(response);
        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: "Bigfoot Sightings",
            x: response.map(data => data.months),
            y: response.map(data => data.sightings),
            line: {
                color: "#17BECF"
            }
        };

        var data = [trace1];

        var layout = {
            title: "Bigfoot Sightings Per Year",
            xaxis: {
                type: "date"
            },
            yaxis: {
                autorange: true,
                type: "linear"
            }
        };

        Plotly.newPlot("plot", data, layout);
    });
}

buildPlot();
*/
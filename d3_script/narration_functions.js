

function tooltipHTML(object) {
    return "<div>" + object.Country + "</div><div>$" + Math.round(object.GDP) + " GDP/person</div><div>" + Math.round(object.Life_expectancy) + " years</div>";
}

function tooltipHTMLHPP(object) {
    return "<div>" + object.CountryName + "</div><div>$" + Math.round(object.CHPP) + " GDP/person</div><div>" + Math.round(object.Life_Expectancy) + " years</div>";
}


function renderLegend(svg, incomeGroups, width, bubbleColor) {
    //add dots for each income group
    svg.selectAll("legend-dots")
        .data(incomeGroups)
        .enter()
        .append("circle")
        .attr("cx", width - 100)
        .attr("cy", function (d, i) {
            return 400 + i * 25
        })
        .attr("r", 2)
        .style("fill", function (d) {
            return bubbleColor(d)
        })

    svg.selectAll("legend-labels")
        .data(incomeGroups)
        .enter()
        .append("text")
        .attr("x", width + 8 - 100)
        .attr("y", function (d, i) {
            return 400 + i * 25
        })
        .style("fill", function (d) {
            return bubbleColor(d)
        })
        .text(function (d) {
            return d
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
}



//Create first scene of GDP and Life Expectancy
async function renderGDPLifeChart() {
    var margin = {top: 10, right: 20, bottom: 30, left: 50};
    var width = 1000 - margin.left - margin.right;
    var height = 800 - margin.top - margin.bottom;


    var data = await d3.csv("https://raw.githubusercontent.com/waveeq/cs416/main/gdp_life_2020.csv");
    var year = 2020
    var filteredData = data.filter(function (d) {
        return d.Year == year  && d.GDP != "" && d.Life_expectancy != "" && d.population != "";
    });


    console.log(filteredData);

    svg = d3.select("#gdp-life").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //create scales
    var x = d3.scaleLinear()
        .domain([0, 30000])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([50, 85])
        .range([height, 0]);


    var z = d3.scaleLog()
        .domain([200000, 1310000000])
        .range([1, 30]);

    var bubbleColor = d3.scaleOrdinal()
        .domain(["Low income" , "Upper middle income" , "Lower middle income" , "High income" ])
        .range(d3.schemeSet2);

    //add axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d => "$" + d ));

    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d =>  d + " years"));


    // Add a scale for bubble color


    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#gdp-life-scene")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10")
        .style("color", "white")
        .style("width", "150px")
        .style("height", "60px")
        .style("position", "absolute")
        .style("text-align", "center");


    // Add dots
    svg.append('g')
        .selectAll("scatterplot-dot")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) {
            return x(d.GDP);
        })
        .attr("cy", function (d) {
            return y(d.Life_expectancy);
        })
        .attr("id", function (d) {
            return "bubble-" + d.CountryCode;
        })
        .attr("r", function (d) {
            return z(d.population);
        })
        .style("fill", function (d) {
            return bubbleColor(d.IncomeGroup);
        })
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(240)
                .style("opacity", .9);
            tooltip.html(tooltipHTML(d));

            tooltip.style("left", (event.pageX  +15) + "px").style("top", (event.pageY - 28) + "px")
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click" , function(event , d){

            window.location = "life_expectancy.html?country=" + d.Country;
        })
    ;



    renderLegend(svg,["Low income" , "Upper middle income" , "Lower middle income" , "High income" ],width-100, bubbleColor);

    //countryCodesToAnnotate().forEach(function (countryCode) {
    //    for (let i = 0; i < filteredData.length; i++) {
    //        if (filteredData[i].code === countryCode) {
    //            const countryData = filteredData[i];
    //            renderFirstChartAnnotations(countryData, x(Number(countryData.gdp_per_capita)), y(Number(countryData.average_annual_hours_worked)), margin);
    //        }
    //    }
    //})
}



async function renderHPPLifeChart() {
    var margin = {top: 10, right: 20, bottom: 30, left: 50};
    var width = 1000 - margin.left - margin.right;
    var height = 800 - margin.top - margin.bottom;


    var data = await d3.csv("https://raw.githubusercontent.com/waveeq/cs416/main/chpp_life_2019.csv");
    var year = 2019
    var filteredData = data.filter(function (d) {
        return d.Year == year  && d.CHPP != "" && d.Life_Expectancy != "" && d.population != "";
    });


    console.log(filteredData);

    svg = d3.select("#hpp-life").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //create scales
    var x = d3.scaleLinear()
        .domain([-200, 15000])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([50, 90])
        .range([height, 0]);


    var z = d3.scaleLog()
        .domain([200000, 150000000])
        .range([1, 15]);

    var bubbleColor = d3.scaleOrdinal()
        .domain(["Low income" , "Upper middle income" , "Lower middle income" , "High income" ])
        .range(d3.schemeSet2);

    //add axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d => "$" + d ));

    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d =>  d + " years"));


    // Add a scale for bubble color


    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#hpp-life-scene")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10")
        .style("color", "white")
        .style("width", "150px")
        .style("height", "60px")
        .style("position", "absolute")
        .style("text-align", "center");


    // Add dots
    svg.append('g')
        .selectAll("scatterplot-dot")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) {
            return x(d.CHPP);
        })
        .attr("cy", function (d) {
            return y(d.Life_Expectancy);
        })
        .attr("id", function (d) {
            return "bubble-" + d.CountryCode;
        })
        .attr("r", function (d) {
            return z(d.population);
        })
        .style("fill", function (d) {
            return bubbleColor(d.IncomeGroup);
        })
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(240)
                .style("opacity", .9);
            tooltip.html(tooltipHTMLHPP(d));

            tooltip.style("left", (event.pageX  +15) + "px").style("top", (event.pageY - 28) + "px")
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click" , function(event , d){

            window.location = encodeURI("life_expectancy.html?country=" +  d.CountryName);
        });



    renderLegend(svg,["Low income" , "Upper middle income" , "Lower middle income" , "High income" ],width-100, bubbleColor);

}






function renderLifeExpectancyAnnotation(d, x, y, margin) {
    d3.select(".annotation-group").remove();
    var annotations = [
        {
            note: {
                label: "Life Expectancy in " + d.Value + " years",
                lineType: "none",
                bgPadding: {"top": 10, "left": 10, "right": 10, "bottom": 10},
                title: d.Country
            },
            type: d3.annotationCalloutCircle,
            subject: {radius: 30},
            x: x,
            y: y,
            dx: -100,
            dy: +30
        },
    ];
    var makeAnnotations = d3.annotation().annotations(annotations);
    var chart = d3.select("svg")
    chart.transition()
        .duration(1000);
    chart.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "annotation-group")
        .call(makeAnnotations)
}



// render life expectancy chart
async function renderLineChartOfLifeExpectancy() {
    var margin = {top: 10, right: 50, bottom: 30, left: 50};
    var width = 800 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;


    var data = await d3.csv("https://raw.githubusercontent.com/waveeq/cs416/main/life_expectancy_data_csv.csv");
    console.log(data)

    var countryList = getCountryList();

    //create select list
    d3.select("#select-country")
        .selectAll('country-options')
        .data(countryList)
        .enter()
        .append('option')
        .text(function (d) {
            return d;
        })
        .attr("value", function (d) {
            return d;
        })


    //add svg object
    var svg = d3.select("#life-expectancy-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var filteredData = data.filter(function (d) {
        return d.Value != "" && d.Year != "";
    });





    // A color scale for each group
    var myColor = d3.scaleOrdinal()
        .domain(countryList)
        .range(d3.schemeSet2);

    // Add X axis for years starting 1955
    var x = d3.scaleLinear()
        .domain([1955, 2025])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add Y axis of life expectancy
    var y = d3.scaleLinear()
        .domain([0, 90])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d => d + " year"));

    // Initialize line with first country
    var firstCountryData = filteredData.filter(function (d) {
        return d.Country === countryList[0]
    });

    var line = svg
        .append('g')
        .append("path")
        .attr("id", "line-" + countryList[0])
        .datum(firstCountryData)
        .attr("d", d3.line()
            .x(function (d) {
                return x(Number(d.Year))
            })
            .y(function (d) {
                return y(Number(d.Value))
            })
        )
        .attr("stroke", function (d) {
            return myColor(d.Country)
        })
        .style("stroke-width", 3)
        .style("fill", "none")

    var mostRecentFirstCountryData = firstCountryData[firstCountryData.length - 1]
    renderLifeExpectancyAnnotation(mostRecentFirstCountryData, x(Number(mostRecentFirstCountryData.Year)) - 10, y(Number(mostRecentFirstCountryData.Value)) - 10, margin);

    function update(selectedGroup) {
        // get new data with selection
        const countryData = filteredData.filter(function (d) {
            return d.Country === selectedGroup;
        });


        console.log(countryData);
        console.log(selectedGroup);

        // Create new line
        line
            .datum(countryData)
            .transition()
            .duration(1000)
            .attr("id", "line-" + selectedGroup)
            .attr("d", d3.line()
                .x(function (d) {
                    return x(Number(d.Year))
                })
                .y(function (d) {
                    return y(Number(d.Value))
                })
            )
            .attr("stroke", function (d) {
                return myColor(selectedGroup)
            })


        var finalCountryData = countryData[countryData.length - 1];
        renderLifeExpectancyAnnotation(finalCountryData, x(Number(finalCountryData.Year)) - 10, y(finalCountryData.Value) - 10, margin)
    }

    // When selection is changed update chart
    d3.select("#select-country").on("change", function (d) {
        const selectedOption = d3.select(this).property("value")

        update(selectedOption)

    })

    var i=0;
    var telem;
    var search_values=location.search.replace('\?','').split('&');
    var query={}
    for(i=0;i<search_values.length;i++){
        telem=search_values[i].split('=');
        query[telem[0]]=telem[1];
    }


    console.log(query)

    console.log(query.length)

    if(typeof query.country != "undefined"){
        console.log(query.country)
        update(decodeURIComponent(query.country))
    }



}


function getCountryList() {
    return ["Afghanistan",
"Albania",
"Algeria",
"American Samoa",
"Andorra",
"Angola",
"Antigua and Barbuda",
"Argentina",
"Armenia",
"Aruba",
"Australia",
"Austria",
"Azerbaijan",
"Bahrain",
"Bangladesh",
"Barbados",
"Belarus",
"Belgium",
"Belize",
"Benin",
"Bermuda",
"Bhutan",
"Bolivia",
"Bosnia and Herzegovina",
"Botswana",
"Brazil",
"British Virgin Islands",
"Brunei Darussalam",
"Bulgaria",
"Burkina Faso",
"Burundi",
"Cabo Verde",
"Cambodia",
"Cameroon",
"Canada",
"Cayman Islands",
"Chad",
"Channel Islands",
"Chile",
"China",
"Colombia",
"Comoros",
"Costa Rica",
"Cote d'Ivoire",
"Croatia",
"Cuba",
"Curacao",
"Cyprus",
"Czech Republic",
"Denmark",
"Djibouti",
"Dominica",
"Dominican Republic",
"Ecuador",
"El Salvador",
"Equatorial Guinea",
"Eritrea",
"Estonia",
"Eswatini",
"Ethiopia",
"Faroe Islands",
"Fiji",
"Finland",
"France",
"French Polynesia",
"Gabon",
"Georgia",
"Germany",
"Ghana",
"Gibraltar",
"Greece",
"Greenland",
"Grenada",
"Guam",
"Guatemala",
"Guinea-Bissau",
"Guinea",
"Guyana",
"Haiti",
"Honduras",
"Hungary",
"Iceland",
"India",
"Indonesia",
"Iraq",
"Ireland",
"Isle of Man",
"Israel",
"Italy",
"Jamaica",
"Japan",
"Jordan",
"Kazakhstan",
"Kenya",
"Kiribati",
"Kosovo",
"Kuwait",
"Kyrgyz Republic",
"Lao PDR",
"Latvia",
"Lebanon",
"Lesotho",
"Liberia",
"Libya",
"Liechtenstein",
"Lithuania",
"Luxembourg",
"Madagascar",
"Malawi",
"Malaysia",
"Maldives",
"Mali",
"Malta",
"Marshall Islands",
"Mauritania",
"Mauritius",
"Mexico",
"Moldova",
"Monaco",
"Mongolia",
"Montenegro",
"Morocco",
"Mozambique",
"Myanmar",
"Namibia",
"Nauru",
"Nepal",
"Netherlands",
"New Caledonia",
"New Zealand",
"Nicaragua",
"Niger",
"Nigeria",
"North America",
"North Macedonia",
"Northern Mariana Islands",
"Norway",
"Oman",
"Pakistan",
"Palau",
"Panama",
"Papua New Guinea",
"Paraguay",
"Peru",
"Philippines",
"Poland",
"Portugal",
"Puerto Rico",
"Qatar",
"Romania",
"Russian Federation",
"Rwanda",
"Samoa",
"San Marino",
"Sao Tome and Principe",
"Saudi Arabia",
"Senegal",
"Serbia",
"Seychelles",
"Sierra Leone",
"Singapore",
"Sint Maarten (Dutch part)",
"Slovak Republic",
"Slovenia",
"Small states",
"Solomon Islands",
"Somalia",
"South Africa",
"South Sudan",
"Spain",
"Sri Lanka",
"St. Kitts and Nevis",
"St. Lucia",
"St. Martin (French part)",
"St. Vincent and the Grenadines",
"Sudan",
"Suriname",
"Sweden",
"Switzerland",
"Syrian Arab Republic",
"Tajikistan",
"Tanzania",
"Thailand",
"Timor-Leste",
"Togo",
"Tonga",
"Trinidad and Tobago",
"Tunisia",
"Turkey",
"Turkmenistan",
"Turks and Caicos Islands",
"Tuvalu",
"Uganda",
"Ukraine",
"United Arab Emirates",
"United Kingdom",
"United States",
"Upper middle income",
"Uruguay",
"Uzbekistan",
"Vanuatu",
"Vietnam",
"Virgin Islands (U.S.)",
"West Bank and Gaza",
"World",
"Zambia",
"Zimbabwe",
"Bahamas",
"Congo",
"Egypt",
"Gambia",
"Hong Kong SAR",
"Iran",
"Korea",
"Macao SAR",
"Micronesia",
"Venezuela",
"Yemen"]
}

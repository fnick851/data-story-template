// self-calling anonymous function for private scope
(function () { // write everything inside the bracket of this function

    makeChart();

    function makeChart() {

        //set the margin attributes
        var margin = {
                top: 35,
                right: 0,
                bottom: 25,
                left: 135
            },
            width = 500,
            height = 236;


        var legend_color = d3.scaleOrdinal()
            .domain(["Charter"])
            .range(["#00a6d2"]);

        //set the appropriate bar padding
        var y = d3.scaleBand().rangeRound([0, height]).padding(0.3);


        //set the domain and range for the x axis
        var x = d3.scaleLinear()
            .domain([1.0, 0])
            .range([width, 0]);

        //y axis variable using the scale created above based on selected chart type
        var yAxis = d3.axisLeft()
            .scale(y)
            .tickSize(0);


        //tip variable to format the tip using the class defined earlier, offset, and html function to return give the correct labels and info in the correct font
        function position_tip(y) {
            if (y > height / 2) {
                y = y - 25
            }
            return (100)
        }

        //svg is the standard name for the d3 bar chart graphic, this creates it and sets some attributes, append appends to it
        var svg = d3.select("#school_type_bar").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var dataFile = "viz/data/school_type_data.txt";

        //read in the data tsv and recreate the y domain to only include characteristic variables based on the selected chart data
        d3.tsv(dataFile, type, function (error, data) {
            y.domain(data.map(function (d) {
                return d.characteristic;
            }));

            //append the bars to the chart
            var barBackground = svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "barBackground")
                .attr("fill", function (d) {
                    return "#f1f1f1"
                })
                .attr("x", function (d) {
                    return x(0);
                }) //coordinates start at 0
                .attr("height", function (d) {
                    return y.bandwidth();
                })
                .attr("y", function (d) {
                    return y(d.characteristic);
                }) //align bar with proper y axis characteristic
                .attr("width", width);

            //append the bars to the chart
            var bar = svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("fill", function (d) {
                    return "#2EB4E7"
                })
                .attr("x", function (d) {
                    return x(0);
                }) //coordinates start at 0
                .attr("height", function (d) {
                    return y.bandwidth();
                })
                .attr("y", function (d) {
                    return y(d.characteristic);
                }) //align bar with proper y axis characteristic
                .attr("width", function (d) {
                    return x(d.percentageEnrolledInAlgebra);
                }) //extend as far as the percentage enrolled in algebra 1
                .on('mouseover', mouseover) //show / hide the tip based on where the mouse is
                .on('mouseout', mouseout);

            //append the text to the chart
            svg.selectAll("text")
                .data(data)
                .enter().append("text")
                .text(function (d) {
                    if (d.percentageEnrolledInAlgebra == 0 | d.percentageEnrolledInAlgebra == "") {
                        return ""
                    } else {
                        if (d.characteristic == "Magnet schools")
                            return Math.round((d.percentageEnrolledInAlgebra) * 100) + "%"
                        else {
                            return Math.round((d.percentageEnrolledInAlgebra) * 100)
                        }
                    }
                })
                .attr("x", function (d) {
                    return x(d.percentageEnrolledInAlgebra) + 5;
                }) //coordinates start at 0
                .attr("y", function (d) {
                    return y(d.characteristic) + 18;
                })
                .attr("text-anchor", "right")
                .style("font-size", "13px")
                .style("font-family", "Chivo-Bold")
                .style("fill", "#616161");


            //append the y axis
            var appendYAxis = svg.append("g")
                .attr("class", "yAxis")
                .call(yAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.5em")
                .attr("dy", ".4em")
                .style("font-size", "14px")
                .style("font-family", "Chivo-Regular")
                .style("fill", "#474747");

            var new_axis = svg.append("line")
                .attr("x1", 0)
                .attr("y1", 5)
                .attr("x2", 0)
                .attr("y2", 235)
                .attr("stroke-width", 2)
                .attr("stroke", "#2E2E2E");

            var new_axis = svg.append("line")
                .attr("x1", x(.79588))
                .attr("y1", -5)
                .attr("x2", x(.79588))
                .attr("y2", 240)
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", 3)
                .attr("stroke", "#2E2E2E");



            var annotation = svg.append("text")
                .attr("x", x(0))
                .attr("y", -20)
                .attr("text-anchor", "start")
                .style("font-size", "14px")
                .style("font-family", "Chivo-Bold")
                .style("fill", "#2e2e2e")
                .style("font-weight", 600)
                .text("% of 8th graders who could take Algebra I at...");

            var annotation = svg.append("text")
                .attr("x", x(.75) + 60)
                .attr("y", 255)
                .attr("text-anchor", "end")
                .style("font-size", "14px")
                .style("font-family", "Chivo-Regular")
                .style("fill", "#2e2e2e")
                .style("font-weight", 600)
                .text("Overall 80% of 8th graders could take Algebra 1");



            //Move the hover over as needed
            function position_tip(x, y) {
                if (x > (50 + width / 2)) {
                    x = d3.max(x - 500, 140) //move tooltip to left of mouse for elements in the right of page
                }
                if (y > height / 2) {
                    y = y - 125
                }
                return ([x, y])
            }

            //set up interactive funcaitonality 
            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            function mouseover(d) {
                div.transition().duration(100)
                    .style("opacity", .9);
                div.html("<span style='font-family: Chivo-Regular; font-size: 14px; color: #ffffff;'>" + d.characteristic +
                        "</span><br/><hr style='opacity: 0.2;border: 1px solid #CDCCCC;'>" +
                        "<span style='font-family: Chivo-Regular; font-size: 13px; color: #FFFFFF; line-height: 16px;'>" +
                        d3.format(",.0f")(d.percentageEnrolledInAlgebra * 100) +
                        "% could take Algebra I in 8th grade</span><br/>" +
                        "<span style='font-family: Chivo-Regular; line-height: 16px;'>" +
                        d3.format(",.0f")(d.n_sch_w_alg) + " out of " + d3.format(",.0f")(d.total) + " students</span>")
                    .style("left", (position_tip(d3.event.pageX, d3.event.pageY)[0]) + "px")
                    .style("top", (position_tip(d3.event.pageX, d3.event.pageY)[1]) + "px");
            }

            function mouseout(d) {
                div.transition().duration(200).style("opacity", 0);

            }


        });

        //Set data type of percentage to numeric 
        function type(d) {
            d.percentageEnrolledInAlgebra = +d.percentageEnrolledInAlgebra;
            return d;
        }
    }
})();
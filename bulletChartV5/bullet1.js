var margin = { top: 5, right: 40, bottom: 20, left: 200 },
		width = 800 - margin.left - margin.right,
		height = 50 - margin.top - margin.bottom;
	var chart = d3.bullet().width(width).height(height);

	// Tooltips
	var tip = d3.select('body').append('tip')
		.attr('class', 'tooltip')
		.style('opacity', 0);

	//Loading json data
	d3.json("bulletdata.json").then(function (data) {
		var svg = d3.select("#my_dataviz").selectAll("svg").data(data)
			.enter().append("svg")
			.attr("class", "bullet")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.call(chart)
			.on('mouseover', d => {
				tip.transition().duration(200).style('opacity', 0.9);
				tip.html("Mesure : " + d.measures[0] +"<br> Marker : " + d.markers +"<br>Range : " + d.ranges[2])
				    .style("top", (12*height) + "px")
				    .style("left", (2*width + 30) + "px")
					.style("opacity", 1)
			})
			.on('mouseout', () => { tip.transition().duration(500).style('opacity', 0); });

		var title = svg.append("g").style("text-anchor", "end").attr("transform", "translate(-6," + height / 2 + ")");

		title.append("text").attr("class", "title").text(function (d) { return d.title; });

		title.append("text").attr("class", "subtitle").attr("dy", "2em").text(function (d) { return d.subtitle; });

		d3.selectAll("button").on("click", function () {
			svg.datum(randomize).call(chart.duration(1000));
		});
	});

	function randomize(d) {
		if (!d.randomizer) d.randomizer = randomizer(d);
		d.markers = d.markers.map(d.randomizer);
		d.measures = d.measures.map(d.randomizer);
		return d;
	}

	function randomizer(d) {
		var k = d3.max(d.ranges) * .2;
		return function (d) {
			return Math.max(0, d + k * (Math.random() - .5));
		};
	}

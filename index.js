"use-strict";

let width = 800;
let height = 600;

let svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

let g = svg.append("g");

let project = d3.geoAlbers()
  .scale(190000)
  .rotate([71.057, 0])
  .center([0, 42.313])
  .translate([width / 2, height / 2]);

let geoPath = d3.geoPath()
  .projection(project);

d3.json('data/neighborhoods.json').then(function (data) {
  g.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("fill", "#ccc")
    .attr("d", geoPath)

  d3.json('data/points.json').then(function (data) {
    var points = svg.append("g");
    points.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr('fill', '#00FFFF')
      .attr('stroke', '#FF1493')
      .style('stroke-width', '2px')
      .attr('d', geoPath);

    let links = [];
    for (let i = 0; i < data.features.length - 1; i++) {
      let coordinate1 = data.features[i].geometry.coordinates;
      let coordinate2 = data.features[i + 1].geometry.coordinates;
      links.push({
        type: "LineString",
        coordinates: [
          [coordinate1[0], coordinate1[1]],
          [coordinate2[0], coordinate2[1]]
        ]
      });
    }

    var tweenDash = function tweenDash() {
      var len = this.getTotalLength(),
        interpolate = d3.interpolateString("0," + len, len + "," + len);

      return function (t) { return interpolate(t); };
    }

    document.getElementById("startButton").addEventListener("click", (click) => {
      let path = svg.append("g");
      let pathArcs = path.selectAll(".arc")
          .data(links)
          .enter()
          .append("path")
          .attr("class", "arc")
          .attr("fill", "none")
          .attr("d", geoPath)
          .style("stroke", '#0000FF')
          .style('stroke-width', '2px')
          .each(function(d, i) {
            d3.select(this).attr("class", "arc").attr("stroke-dasharray", 27 + " " + 27).attr("stroke-dashoffset", 27).transition().duration(500).delay(200 * i).attr("stroke-dashoffset", 0).style("stroke-width", 3)
          });
    });
  });
});
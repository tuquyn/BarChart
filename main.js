d3.csv("https://tungth.github.io/data/vn-provinces-data.csv")
    .then((data) => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            data[i]['GRDP-VND'] = parseInt(data[i]['GRDP-VND'], 10);
        }
        database = data
        draw()
})
var size = 20
const margin = {top: 20, right: 30, bottom: 40, left: 100},
    w = 800 - margin.left - margin.right,
    h = 600 - margin.top - margin.bottom;
var x,y, xAxis, yAxis,data
var svg,rect,text
function draw() {
    data = database.filter((d,i) => {
        if(i < size)
            return d;
    })
    svg = d3.select("#barchart")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    x = d3.scaleLinear()
        .range([0, w])
    xAxis = svg.append("g")
        .attr("transform", `translate(0, ${h})`)
    y = d3.scaleBand()
        .range([0, h])
        .padding(.1)
    yAxis = svg.append("g")

    rect = svg.append("g")
    text = svg.append("g")
    d3.selectAll("p#add")
        .on("click", function(){
            size++
            size = Math.min(63, size)
            data = database.filter((d,i) => {
                if(i < size)
                    return d;
            })
            update()
        })
    d3.selectAll("p#remove")
        .on("click", function(){
            size--
            size = Math.max(1, size)
            data = database.filter((d,i) => {
                if(i < size)
                    return d;
            })
            update()
        })

    d3.select("#sort-select").on("change", function () {
        // d3.event is set to the current event within an event listener
        let criterion = d3.select("#sort-select").node().value;
        console.log(criterion)
        // sorting the array based on name, or GDP
        data = data.sort(function (a, b) {
            switch (criterion) {
                case "name":
                    // lexicographic sorting for province name
                    if (a["province"] < b["province"])
                        return -1;
                    else if (a["province"] > b["province"])
                        return 1;
                    else return 0;
                case "GDP":
                    // sorting by magnitude of tons
                    return b['GRDP-VND'] - a['GRDP-VND'];
            }
        })

        update()
    })

        update()
}
function update(){
    x.domain([0, d3.max(data, d => d['GRDP-VND'])])
    xAxis.transition().duration(100).call(d3.axisBottom(x).ticks(5))

    y.domain(data.map(d => d["province"]))
    yAxis.transition().duration(100).call(d3.axisLeft(y))

    rect
        .selectAll("rect")
        .data(data)
        .join("rect")
        .transition()
        .duration(100)
        .attr("x", x(0) )
        .attr("y", d => y(d["province"]))
        .attr("width", d => x(d['GRDP-VND']))
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2")

    text
        .selectAll("text")
        .data(data)
        .join("text")
        .transition()
        .duration(100)
        .attr("x", d => x(d['GRDP-VND']) + 5 )
        .attr("y", (d,i) => y(d["province"]) + 8)
        .attr("fill", "black")
        .text(d => d["GRDP-VND"])

    }

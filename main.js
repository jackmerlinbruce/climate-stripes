document.addEventListener('DOMContentLoaded', () => {

    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

    const svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height)

    d3.csv('./climate.csv', (data) => {

        data.forEach(d => {
            d.year = +d.year
            d.temp = +d.temp
        }) 

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => { return d.year }))
            .range([0, width])
        
        let c = d3.scaleSequential()
            .domain(d3.extent(data, d => { return d.temp }).reverse())
            // .domain([-2,2].reverse())
            .interpolator(d3.interpolateRdBu)
        
        // c = d3.scaleLinear()
        //     .domain(d3.extent(data, d => { return d.temp }))
        //     .range(['blue', 'red'])

        const barWidth = (width / data.length)

        const stripes = svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('id', (d, i) => { return i })
            .attr('fill', (d) => { return c(d.temp) })
            .attr('width', barWidth + 1)
            .attr('height', 0)
            .attr('x', (d, i) => { return barWidth * i })
            .attr('y', height / 2)
            .on('mouseover', handleMouseOverDesktop)
            .on('mouseout', handleMouseOutDesktop)
            .transition()
                .duration(2000)
                .delay((d, i) => { return i * 100})
                .attr('height', height)
                .attr('y', height / 0)

        const stripeYears = svg.selectAll('text.falling-years')
            .data(data)
            .enter()
            .append('text')
            .attr('id', 'falling-years')
            .text(d => { return d.year })
            .attr('x', (d, i) => { return (barWidth * i) + barWidth + (barWidth * 0.5)})
            .attr('y', 0)
            .style('fill', (d) => { return c(d.temp) })
            .style('opacity', 1)
            .transition()
                .duration(2000)
                .delay((d, i) => { return i * 100 })
                .attr('y', (d, i) => { return (d.year % 10 == 0) ? height - 100 : height })
                .style('opacity', (d, i) => { return (d.year % 10 == 0) ? 1 : 0 })
                .style('fill', (d, i) => { return (d.year % 10 == 0) ? 'white' : c(d.temp) })
                
        d3.select('.title')
            .transition().duration(300)
            .attr('opacity', 0.5)
        
        // const timeline = svg.selectAll('text.timeline')
        //     .data(data)
        //     .enter()
        //     .append('text')
        //     .attr('id', 'label-date')
        //     .text((d, i) => { return (d.year % 10 == 0) ? d.year : null })
        //     .attr('x', (d, i) => { return barWidth * i })
        //     .attr('y', height - 100)
        
        svg.append('line')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', height - 120)
            .attr('y2', height - 120)
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .attr('opacity', 0.9)

        // const button = d3.select('body').append('div')
        //     .attr('class', 'disable-button')
        //     .on('mouseover', console.log('hello'))

        function handleMouseOverDesktop(d, i) {
            let bar = this
            // d3.select(bar)
            //     .transition()
            //     .duration(0)
            //     .attr('fill', 'black')

            svg.append('rect')
                .attr('id', 'tool-tip-bar')
                .attr('fill', 'black')
                .attr('width', barWidth)
                .attr('height', barWidth)
                .attr('rx', barWidth / 2)
                .attr('x', +bar.getAttribute('x'))
                .attr('y', height - 130 - barWidth)

            if (+bar.getAttribute('x') < 60) {
                // if the tooltip goes out of bounds left
                const tooltipTemp = svg.append('text')
                    .text(data[bar.id].year)
                    .attr('class', 'tooltip')
                    .attr('id', 'label-temp')
                    .attr('x', +bar.getAttribute('x') + (barWidth * 1.5))
                    .attr('y', height - 130)
                    .attr('text-anchor', 'start')
                const tooltipYear = svg.append('text')
                    .text(data[bar.id].temp + '°c') 
                    .attr('class', 'tooltip')
                    .attr('id', 'label-year')
                    .attr('x', +bar.getAttribute('x') + (barWidth * 1.5))
                    .attr('y', height - 150)
                    .attr('text-anchor', 'start')
            } else if (+bar.getAttribute('x') > (width - 70)) {
                // if the tooltip goes out of bounds right
                const tooltipTemp = svg.append('text')
                    .text(data[bar.id].year)
                    .attr('class', 'tooltip')
                    .attr('id', 'label-temp')
                    .attr('x', +bar.getAttribute('x') - (barWidth * 0.5))
                    .attr('y', height - 150)
                    .attr('text-anchor', 'end')
                const tooltipYear = svg.append('text')
                    .text(data[bar.id].temp + '°c') 
                    .attr('class', 'tooltip')
                    .attr('id', 'label-year')
                    .attr('x', +bar.getAttribute('x') - (barWidth * 0.5))
                    .attr('y', height - 130)
                    .attr('text-anchor', 'end')
            } else {
                const tooltipTemp = svg.append('text')
                    .text(data[bar.id].year)
                    .attr('class', 'tooltip')
                    .attr('id', 'label-temp')
                    .attr('x', +bar.getAttribute('x') + (barWidth * 1.5))
                    .attr('y', height - 130)
                    .attr('text-anchor', 'start')
                const tooltipYear = svg.append('text')
                    .text(data[bar.id].temp + '°c') 
                    .attr('class', 'tooltip')
                    .attr('id', 'label-year')
                    .attr('x', +bar.getAttribute('x') - (barWidth * 0.5))
                    .attr('y', height - 130)
                    .attr('text-anchor', 'end')
            }
        }
        function handleMouseOutDesktop(d, i) {
            // d3.select(this)
            //     .transition()
            //     .duration(0)
            //     .attr('fill', (d) => { return c(d.temp) })
            d3.select('#tool-tip-bar')
                .remove()
            d3.select('#label-temp')
                .remove()
            d3.select('#label-year')
                .remove()
        }    

    })

})
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const svgRef = useRef();
  const pieChartRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5058/api/Dashboard', {
          method: 'GET',
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const data = dashboardData.map(item => ({
      name: `${item.customerName} ${item.customerSurname}`,
      totalUsage: item.usedProductsList.reduce((total, product) => total + product.totalUsed, 0),
    }));

    const w = 600;
    const h = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };


const pieChart = () => {
    const radius = Math.min(w, h) / 3;
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    const svg = d3.select(pieChartRef.current)
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', `translate(${w / 2}, ${h / 1.5})`);
  
    const pie = d3.pie().value(d => d.totalUsage);
    const dataForPie = pie(data);
  
    const arc = d3.arc().outerRadius(radius).innerRadius(0);
  
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
  
    svg.selectAll('path')
      .data(dataForPie)
      .join('path')
      .attr('d', arc)
      .attr('fill', (_, i) => d3.color(color(i)).darker()) // Renkleri daha hafif tonlarda yapmak için
      .attr('stroke', 'white') // Çemberin kenarını belirginleştirmek için
      .attr('stroke-width', 1)
      .on('mouseover', (event, d) => {
        // Elma dilimine gelindiğinde tooltip göster
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`${d.data.name}<br>${d.data.totalUsage}`)
          .style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 28) + 'px');
  
        // Oku ismin ve kullanım miktarının olduğu yere çekin
        const [x, y] = arc.centroid(d);
        const endX = x + Math.cos(d.endAngle - Math.PI / 2) * (radius + 20); // 20 piksel uzatma
        const endY = y + Math.sin(d.endAngle - Math.PI / 2) * (radius + 20); // 20 piksel uzatma
  
        svg.append('line')
          .attr('x1', x)
          .attr('y1', y)
          .attr('x2', endX)
          .attr('y2', endY)
          .attr('stroke', 'black')
          .attr('marker-end', 'url(#arrowhead)');
  
        svg.append('text')
          .attr('class', 'label-text')
          .attr('x', endX)
          .attr('y', endY)
          .attr('dy', -8) 
          .attr('text-anchor', 'end')
          .text(`${d.data.name}\n${d.data.totalUsage}`);
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
        svg.selectAll('.label-text').remove();
        svg.selectAll('line').remove(); 
      });
  };
  const barChart = () => {
    const svg = d3.select(svgRef.current)
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, w])
      .padding(0.2);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.totalUsage)])
      .range([h, 0]);
  
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5);
  
    svg.append('g').call(xAxis).attr('transform', `translate(0, ${h})`);
    svg.append('g').call(yAxis);
  
    svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(d.totalUsage))
      .attr('width', xScale.bandwidth())
      .attr('height', d => h - yScale(d.totalUsage))
      .on('mouseover', (event, d) => {
        svg.append('text')
          .attr('class', 'value-text')
          .attr('x', xScale(d.name) + xScale.bandwidth() / 2)
          .attr('y', yScale(d.totalUsage) - 5)
          .attr('text-anchor', 'middle')
          .text(d.totalUsage);
      })
      .on('mouseout', () => {
        svg.select('.value-text').remove();
      });
  };
  pieChart();
    barChart();
   

  }, [dashboardData]);

  return (
    <div>
      <h2>Dashboard</h2>
      <div className='App'>
        <svg ref={pieChartRef}></svg>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default Dashboard;

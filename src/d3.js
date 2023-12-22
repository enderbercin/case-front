import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3BarChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!data || !data.length) return;

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', 400)
      .attr('height', 200);

    const xScale = d3
      .scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, 400])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, 200]);

    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (_, i) => xScale(i))
      .attr('y', (d) => 200 - yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(d))
      .attr('fill', 'blue');
  }, [data]);

  return <div ref={chartRef}></div>;
};

export default D3BarChart;

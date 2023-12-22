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

    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 80)
      .attr('y', (d) => 200 - d * 10)
      .attr('width', 70)
      .attr('height', (d) => d * 10)
      .attr('fill', 'blue');
  }, [data]);

  return <div ref={chartRef}></div>;
};

export default D3BarChart;

<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { scaleLinear, scaleOrdinal } from 'd3-scale';
  import * as d3 from 'd3';

  export let data;

  const dispatch = createEventDispatcher(); // Define a dispatcher for custom events

  // Create a scale for x-axis (months)
  const monthScale = scaleLinear().domain([0, 60]).range([50, 400]);
  const leadScale = scaleLinear().domain([0, 80]).range([5, 20]);

  // Create a scale for y-axis (quantity) - vice versa
  const quantityScale = scaleLinear().domain([0, 36000]).range([0, 400]);

  // Create a scale for color
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const handleLegendClick = (type) => {
    dispatch('toggleLegend', { type });
  };

  let hoverInfo = null;

  function showPopup(event, item) {
    const xOffset = -600; 
    const yOffset = -100; 
    hoverInfo = {
      quantity: item.quantity,
      month: item.date,
      leadTime: item.leadTime,
      x: event.clientX + xOffset,
      y: event.clientY + yOffset ,
    };
  }

  function hidePopup() {
    hoverInfo = null;
  }
</script>

<div class="bubble-chart">
  <svg class="svg-container" width="800" height="500">
    <!-- Arrows and titles -->
    <text x="10" y="220" transform="rotate(-90 10,220)" class="axis-title">Quantity</text>
    <text x="200" y="440" class="axis-title">Month Number</text>
    <!-- Arrow-like lines for x and y axes -->
    <line x1="50" y1="400" x2="400" y2="400" stroke="black" />
    <line x1="50" y1="400" x2="50" y2="0" stroke="black" />
    <!-- Arrowheads for x and y axes -->
    <polygon points="400,400 390,390 410,400 390,410" fill="black" />
    <polygon points="50,0 40,10 60,10 50,0" fill="black" />
    <!-- Title for legends -->
    <text x="490" y="20" class="legend-title">Product Type Filter</text>
    <!-- Legends -->
    {#each Array.from(new Set(data.map(item => item.type))) as type, index}
      <g transform="translate(460, {index * 20 + 30})">
        <rect x="0" y="0" width="200" height="17" fill={colorScale(type)} rx="7" ry="7" on:click={() => handleLegendClick(type)} />
        <text x="5" y="12" class="legend-text" stroke = 'white' stroke-width="0.25" on:click={() => handleLegendClick(type)}>{type}</text>
      </g>
    {/each}
    <!-- Circles -->
    {#each data as item}
      <circle
        class="bubble"
        cx={monthScale(item.month_num)}
        cy={400 - quantityScale(item.quantity)}
        r={leadScale(item.leadTime)}
        fill={colorScale(item.type)}
        stroke="black"
        stroke-width="1.5"
        on:click={() => handleLegendClick(item.type)}
        on:mouseover={(event) => showPopup(event, item)}
        on:mouseout={hidePopup}
      />
    {/each}
    <!-- Popup -->
    {#if hoverInfo !== null}
      <g transform={`translate(${hoverInfo.x},${hoverInfo.y})`}>
        <rect x="10" y="10" width="155" height="70" fill="white" stroke="black" />
        <text x="15" y="25">Quantity: {hoverInfo.quantity}</text>
        <text x="15" y="45">Date: {hoverInfo.month}</text>
        <text x="15" y="65">LeadTime: {hoverInfo.leadTime}</text>
      </g>
    {/if}
  </svg>
</div>

<style>
  .bubble-chart {
    position: relative;
    width: 800px;
    height: 500px; 
  }

  .svg-container {
    width: 100%;
    height: 100%;
  }

  .bubble {
    cursor: pointer;
    opacity: 0.65;
  }

  .axis-title {
    font-size: 12px;
    font-weight: bold;
  }

  .legend-title {
    font-size: 14px;
    font-weight: bold; /* Make the legend title bold */
  }

  .legend-text {
    font-size: 12px;
    font-weight: bold; /* Make the legend text bold */
    cursor: pointer;
    dominant-baseline: middle;
  }
  
</style>

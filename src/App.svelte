<script>
  import { loadCSVData, parseCSVData } from './DataLoad.js';
  import BubbleChart from './BubbleChart.svelte';
  import { onMount } from 'svelte';

  const filePath = 'src/data/Bubble_df.csv';
  let data = [];
  let filteredData = []; // Declare filteredData here
  let startYear = null; // Variable to store start year
  let endYear = null; // Variable to store end year
  let currentFilter = null; // Track the currently selected legend item
  let monthFilter = 60; // Initial value for the month filter
  let month_id = null
  let minLeadTime = 100.00;


  async function loadData() {
    try {
      const csvData = await loadCSVData(filePath);
      data = parseCSVData(csvData);
      // Set filtered data initially to all data
      filteredData = data;
    } catch (error) {
      console.error('Error loading or parsing CSV data:', error);
    }
  }

  onMount(loadData);

  function handleToggleLegend(event) {
    const { type } = event?.detail; // Safely access event.detail
    $: {
      if (type === currentFilter) {
        // If the same legend item is clicked again, toggle the filter
        currentFilter = null; // Reset the currently selected legend item
      } else {
        // Otherwise, set the filter to the clicked type
        currentFilter = type;
      }
      filterData();
    }
  }

  function updateFilter(event) {
    monthFilter = parseInt(event?.target?.value);
    filterData();
  }

  function filterData() {
    if (currentFilter && month_id === null) {
        // Filter based on type and month
        filteredData = data.filter(d => d.type === currentFilter && d.month_num <= monthFilter && d.leadTime <= minLeadTime && filterByYear(d.year));
    } else if (currentFilter && month_id !== null) {
        // Filter based on type, month, and year
        filteredData = data.filter(d => d.type === currentFilter && d.month_num <= monthFilter && d.leadTime <= minLeadTime && parseInt(d.month, 10) === parseInt(month_id, 10) && filterByYear(d.year));
    } else if (month_id !== null) {
        // Filter based on month and year
        filteredData = data.filter(d => parseInt(d.month, 10) === parseInt(month_id, 10) && d.month_num <= monthFilter  && d.leadTime <= minLeadTime&& filterByYear(d.year));
        console.log(filteredData)
    } else {
        // Filter only based on month
        filteredData = data.filter(d => d.month_num <= monthFilter && d.leadTime <= minLeadTime && filterByYear(d.year));
    }
}

function filterByYear(year) {
    if (!startYear || !endYear) return true; // Return true if start or end year is not entered
    return year >= startYear && year <= endYear;
  }

function updateMinLeadTime(event) {
  minLeadTime = parseInt(event?.target?.value);
  filterData();
}

  function filterByMonth(monthToFilter) {
    if (month_id === monthToFilter) {
        // If the same month filter is clicked again, reset the filter
        month_id = null;
    } else {
        // Otherwise, set the month filter to the clicked month
        month_id = monthToFilter;
    }
    filterData();
}

</script>

<main>
<h1 class="header">Effect of lead-time on orders quantity</h1> 
  <div class="container">
    <div class="sidebar">
      <div class="filter-box">
        <div><h3>Date Filters</h3></div>
        <input type="number" placeholder="Start Year" bind:value={startYear} on:input={filterData} />
      </div>
      <div class="filter-box">
        <input type="number" placeholder="End Year" bind:value={endYear} on:input={filterData} />
      </div>
      <div class="slider-container">
        <input type="range" min="1" max="60" bind:value={monthFilter} on:input={updateFilter} />
        <span style="font-weight: bold;">Month: {monthFilter}</span>
      </div>
      <div class="month-filter-container">
        {#each Array.from({ length: 12 }, (_, i) => i + 1) as month}
        <div class="month-filter-box" class:active={month == month_id} on:click={() => filterByMonth(month)}>
      {month}
    </div>
    
  {/each}
</div>

      </div>
  
    <div class="chart-container">
      <BubbleChart data={filteredData} on:toggleLegend={handleToggleLegend} />
    </div>
    <!-- <div class="ordered-list">
      <h2>Filtered Data List</h2>
      <ol>
        {#each filteredData as item}
          <li>{item.month}</li> <!-- Replace 'propertyName' with the property you want to display -->
        <!-- {/each}
      </ol>
    </div> --> 
  </div>
</main>
<div class="filter-box-Lead">
  <h3>Max Lead Time</h3>
  <input type="number" placeholder="Min Lead Time" step="0.1" bind:value={minLeadTime} on:input={updateMinLeadTime} />
</div>
<footer class="footer">
  <p>Bubble size shows the LeadTime</p>
</footer>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 1em;
    max-width: 800px;
    margin: 0 auto;
  }
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .sidebar {
    display: flex;
    flex-direction: column;
    padding-right: 10px;
  }
  .filter-box {
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .filter-box input {
    width: 100px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
  }
  .slider-container {
    margin-top: 20px;
  }
  .slider-container input {
    width: 110%;
    margin-right: 10px;
    margin-left: -10px;
    height: 20px;
    background-color: #377d75;
    border-radius: 10px;
    outline: none;
  }
  .month-filter-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    margin-top: 20px;
  }
  .month-filter-box {
    width: 50px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
  }
  .month-filter-box.active {
  background-color: #377d75; /* Sage green */
}
.filter-box-Lead {
  margin-bottom: 10px;
  position: absolute; /* Change position to absolute */
  top: 350px; /* Adjust the top position as needed */
  left: 1105px; /* Adjust the left position as needed */
  padding: 15px;
  background-color: #7DF5CB; /* Optional: Add a background color */
  border: 2px solid #ccc;
  border-radius: 5px;
}

.filter-box-Lead h3 {
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: bold;
}

.filter-box-Lead input[type="number"] {
  width: 100px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
}
.header {
  text-align: center; /* Center the text horizontally */
  margin-top: 40px; /* Adjust the top margin as needed */
  margin-right: 50px;
  font-size: 44px ;
  width: 100%;
  wrap: normal;
  padding: 100px
}


</style>

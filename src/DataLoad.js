import Papa from 'papaparse';

// Function to load CSV data from a file using Papa Parse
export async function loadCSVData(filePath) {
  const response = await fetch(filePath);
  const csvData = await response.text();
  return csvData;
}

// Function to parse CSV data into array of objects using Papa Parse
export function parseCSVData(csvData) {
  const parsedData = Papa.parse(csvData, { header: true, delimiter: ',' });
  
  // Iterate over each row and round the leadTime column to two decimal points
  const roundedData = parsedData.data.map(row => {
    if (!isNaN(row['leadTime'])) {
      row['leadTime'] = parseFloat(row['leadTime']).toFixed(2); // Round to 2 decimal points
    }
    return row;
  });
  
  return roundedData;
}

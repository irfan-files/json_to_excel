import React, { useState, useEffect } from 'react';
import { utils, writeFile } from 'xlsx';

function ProductDataToExcel() {
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    // Read JSON file
    fetch('../excel-to-json.json')
      .then(response => response.json())
      .then(data => setJsonData(data))
      .catch(error => console.error('Error fetching JSON:', error));
  }, []);

  const extractData = (data) => {
    let extractedData = [];
    data.scraped_product.forEach(product => {
      Object.keys(product).forEach(key => {
        if (key.startsWith('item_image')) {
          extractedData.push({
            Product_Name: product.Product_Name,
            item_image: product[key]
          });
        }
      });
    });
    return extractedData;
  };

  const handleExport = () => {
    if (!jsonData) {
      console.error('No data to export');
      return;
    }

    // Process data
    const processedData = extractData(jsonData);

    // Convert JSON data to worksheet
    const ws = utils.json_to_sheet(processedData);

    // Create a new workbook and append the worksheet
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Products');

    // Write the workbook to a file
    writeFile(wb, 'products.xlsx');

    console.log('Excel file was written successfully');
  };

  return (
    <div>
      <h2>Product Data to Excel</h2>
      <button onClick={handleExport}>Export to Excel</button>
    </div>
  );
}

export default ProductDataToExcel;

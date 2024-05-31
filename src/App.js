import React, { useState } from 'react';
import * as xlsx from 'xlsx';

function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const convertToJson = () => {
    if (file) {
      const reader = new FileReader();

      reader.onload = function(event) {
        const jsonData = JSON.parse(event.target.result);
        const processedData = extractData(jsonData);
        const ws = xlsx.utils.json_to_sheet(processedData);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Products');
        xlsx.writeFile(wb, 'products.xlsx');
      };

      reader.readAsText(file);
    } else {
      alert('Please select a JSON file.');
    }
  };

  const extractData = (data) => {
    let extractedData = [];
    let uniqueImages = new Set();

    data.scraped_product.forEach(product => {
      let productName = product.Product_Name;
      Object.keys(product).forEach(key => {
        if (key.startsWith('item_image')) {
          let imageUrl = product[key];
          
          if (!uniqueImages.has(imageUrl)) {
            uniqueImages.add(imageUrl);
            
            extractedData.push({
              Product_Name: productName,
              item_image: imageUrl
            });
          }
        }
      });
    });
    return extractedData;
  };

  return (
    <div>
      <h1>JSON to Excel Converter</h1>
      <input type="file" onChange={handleFileChange} accept=".json" />
      <button onClick={convertToJson}>Convert to Excel</button>
    </div>
  );
}

export default App;

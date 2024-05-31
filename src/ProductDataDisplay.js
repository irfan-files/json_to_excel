import React, { useState, useEffect } from 'react';

function ProductDataDisplay() {
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    // Read JSON file
    fetch('../excel-to-json.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
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

  return (
    <div>
      <h2>Product Data Display</h2>
      {jsonData && (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {extractData(jsonData).map((product, index) => (
              <tr key={index}>
                <td>{product.Product_Name}</td>
                <td><img src={product.item_image} alt={product.Product_Name} style={{ width: '100px', height: 'auto' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductDataDisplay;

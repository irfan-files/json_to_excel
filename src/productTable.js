import React, { useState, useEffect } from 'react';
import './App.css';

// Function to extract and flatten data
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

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Replace this URL with your actual API endpoint
    const apiUrl = 'https://your-api-endpoint.com/products';

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const processedData = extractData(data);
        setProducts(processedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Product Table</h1>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Item Image</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.Product_Name}</td>
              <td><img src={product.item_image} alt={product.Product_Name} style={{width: '100px'}}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <ProductTable />
    </div>
  );
}

export default App;

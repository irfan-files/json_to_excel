import React, { useState } from "react";
import * as xlsx from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    setFile(selectedFile);
  };

  const convertToJson = () => {
    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const jsonData = JSON.parse(event.target.result);
        const processedData = extractData(jsonData);
        const ws = xlsx.utils.json_to_sheet(processedData);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "Products");
        xlsx.writeFile(wb, "products.xlsx");
      };

      reader.readAsText(file);
    } else {
      alert("Please select a JSON file.");
    }
  };

  const extractData = (data) => {
    let extractedData = [];
    let uniqueImages = new Set();

    data.scraped_product.forEach((product) => {
      let productName = product.Product_Name;
      Object.keys(product).forEach((key) => {
        if (key.startsWith("item_image")) {
          let imageUrl = product[key];

          if (!uniqueImages.has(imageUrl)) {
            uniqueImages.add(imageUrl);

            extractedData.push({
              Product_Name: productName,
              item_image: imageUrl,
            });
          }
        }
      });
    });
    return extractedData;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <h1 className="mt-4">JSON to Excel Converter</h1>
      <div className="input-group mb-3">
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          accept=".json"
        />
        <label className="input-group-text" htmlFor="inputGroupFile02">
          Choose file
        </label>
      </div>
      <div
        className={file ? "alert alert-info" : "alert alert-warning"}
        role="alert"
      >
        {file ? `File selected: ${file.name}` : "No file selected"}
      </div>
      <button className="btn btn-primary" onClick={convertToJson}>
        Convert to Excel
      </button>
    </div>
  );
}

export default App;

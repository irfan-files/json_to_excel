const fs = require('fs');
const xlsx = require('xlsx');

// Memuat data JSON dari file terpisah
const jsonData = require('../excel-to-json.json');

// Fungsi untuk mengekstrak dan meratakan data
const extractData = (data) => {
  let extractedData = [];
  let uniqueImages = new Set(); // Set untuk melacak gambar yang unik

  data.scraped_product.forEach(product => {
    let productName = product.Product_Name;
    Object.keys(product).forEach(key => {
      if (key.startsWith('item_image')) {
        let imageUrl = product[key];
        
        // Jika gambar belum pernah ditemukan sebelumnya
        if (!uniqueImages.has(imageUrl)) {
          uniqueImages.add(imageUrl); // Tandai gambar sebagai sudah ditemukan
          
          // Tambahkan data ke extractedData
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

const processedData = extractData(jsonData);

// Convert JSON data to worksheet
const ws = xlsx.utils.json_to_sheet(processedData);

// Create a new workbook and append the worksheet
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, 'Products');

// Write the workbook to a file
xlsx.writeFile(wb, 'products.xlsx');

console.log('Excel file was written successfully');

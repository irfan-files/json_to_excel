import React, { useState } from 'react';
import * as xlsx from 'xlsx';
import jsonfile from 'jsonfile';

function ExcelToJsonConverter() {
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = xlsx.read(binaryString, { type: 'binary' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      setJsonData(data);
    };

    reader.readAsBinaryString(file);
  };

  const handleConvertToJson = () => {
    if (jsonData) {
      jsonfile.writeFile('data.json', jsonData, (err) => {
        if (err) {
          console.error('Error writing JSON file:', err);
        } else {
          console.log('JSON file successfully written!');
        }
      });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleConvertToJson}>Convert to JSON</button>
    </div>
  );
}

export default ExcelToJsonConverter;
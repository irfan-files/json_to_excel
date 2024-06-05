// ImageDownloader.js
import React, { useState } from "react";
import axios from "axios";

const ImageDownloader = () => {
  const [downloadStatus, setDownloadStatus] = useState("");

  const downloadImages = async () => {
    try {
      const response = await axios.get("../src/json/excel-to-json.json"); // Replace with your JSON file path
      const products = response.data.Products;

      for (let i = 0; i < products.length; i++) {
        const imageUrl = products[i].item_image;
        const imageName = `${i + 1}.jpeg`;

        await axios.post("../server/downloaded_images", {
          url: imageUrl,
          name: imageName,
        });
      }

      setDownloadStatus("Download completed successfully!");
    } catch (error) {
      setDownloadStatus("An error occurred during download.");
    }
  };

  return (
    <div>
      <button onClick={downloadImages}>Download Images</button>
      {downloadStatus && <p>{downloadStatus}</p>}
    </div>
  );
};

export default ImageDownloader;

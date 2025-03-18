# Temperature Heatmap Visualization - for CSCE679
# By Manuel Moran Cavero - UIN 3355007151

This project visualizes temperature data using D3.js. The heatmap represents monthly temperature variations across multiple years, with each square showing temperature trends for a specific month and year. The visualization includes a discrete color legend and temperature ogives.

## **Requirements**
- A modern web browser (Chrome, Firefox, Edge)
- A local HTTP server (Python recommended)
- D3.js (included via CDN)

 ## **How to Run**
Since D3.js cannot load local CSV files directly due to browser security restrictions, a local HTTP server is required.

### **Using Python (Recommended)**
1. Open a terminal and navigate to the project folder: cd path/to/temperature-heatmap
2. Start a local server (Example with Python): python -m http.server 8000
3. Open a browser and go to: http://localhost:8000
4. Open a browser and go to the provided URL. 

## **Usage**
- The heatmap displays temperature variations by month and year.
- Hover over each square to view detailed temperature information.
- The color legend on the right indicates temperature ranges.
- Ogives within each square represent daily max and min temperatures for that month.

## **Notes**
- Ensure `temperature_daily.csv` is inside the `data/` folder.
- If the visualization does not load, check the browser console (`F12` → Console) for errors.
- For best performance, use Google Chrome.
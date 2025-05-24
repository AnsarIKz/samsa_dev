-- SQLite
SELECT 
    "Product Name", 
    SUM(quantity) AS total_quantity_sold, 
    SUM("Total Amount") AS total_sales
FROM sales
GROUP BY "product name"
ORDER BY total_quantity_sold DESC
LIMIT 5;

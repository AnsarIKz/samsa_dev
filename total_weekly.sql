SELECT 
    strftime('%Y-%W', date) AS week, 
    "product name", 
    SUM(quantity) AS "total quantity"
FROM sales
GROUP BY week, "product name"
ORDER BY week DESC, "total quantity" DESC;

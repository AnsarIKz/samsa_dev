SELECT 
    "sale id", 
    date, 
    "customer name", 
    "product_name", 
    "total amount"
FROM sales
WHERE "total amount" >= 300
ORDER BY date DESC;

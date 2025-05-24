SELECT 
    strftime('%Y-%W', date) AS week, 
    SUM("total amount") AS weekly_sales
FROM sales
GROUP BY week
ORDER BY week DESC;

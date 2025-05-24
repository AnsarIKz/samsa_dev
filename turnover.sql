SELECT 
    i."product name",
    SUM(s.quantity) AS total_sold,
    i."stock quantity",
    ROUND(CAST(SUM(s.quantity) AS REAL) / (i."stock quantity" + 1), 2) AS turnover_ratio
FROM inventory i
LEFT JOIN sales s ON i."product name" = s."product name"
GROUP BY i."product name"
ORDER BY turnover_ratio DESC;

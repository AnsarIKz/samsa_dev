SELECT 
    strftime('%Y-%m', date) AS month, 
    category, 
    SUM(amount) AS total_expense
FROM expenses
GROUP BY month, category
ORDER BY month DESC, total_expense DESC;

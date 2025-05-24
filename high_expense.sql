SELECT 
    "expense id", 
    date, 
    category, 
    description, 
    amount
FROM expenses
WHERE amount >= 1000
ORDER BY date DESC;

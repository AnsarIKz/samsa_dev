-- Total sales per month
WITH sales_summary AS (
    SELECT 
        strftime('%Y-%m', date) AS month, 
        SUM("Total Amount") AS total_sales
    FROM sales
    GROUP BY month
),

-- Total expenses per month
expenses_summary AS (
    SELECT 
        strftime('%Y-%m', date) AS month, 
        SUM(amount) AS total_expenses
    FROM expenses
    GROUP BY month
)

-- Combine them
SELECT 
    s.month,
    IFNULL(s.total_sales, 0) AS total_sales,
    IFNULL(e.total_expenses, 0) AS total_expenses,
    (IFNULL(s.total_sales, 0) - IFNULL(e.total_expenses, 0)) AS profit
FROM sales_summary s
LEFT JOIN expenses_summary e ON s.month = e.month
UNION
SELECT 
    e.month,
    IFNULL(s.total_sales, 0) AS total_sales,
    IFNULL(e.total_expenses, 0) AS total_expenses,
    (IFNULL(s.total_sales, 0) - IFNULL(e.total_expenses, 0)) AS profit
FROM expenses_summary e
LEFT JOIN sales_summary s ON s.month = e.month
ORDER BY e.month DESC;

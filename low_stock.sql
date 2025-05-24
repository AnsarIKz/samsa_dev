SELECT 
    "product name", 
    "stock quantity", 
    "restock threshold"
FROM inventory
WHERE "stock quantity" <= "restock threshold"
ORDER BY "stock quantity" ASC;

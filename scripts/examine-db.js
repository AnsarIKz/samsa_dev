import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "business.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    return;
  }
  console.log("Connected to the SQLite database.");
});

// Get all table names
db.all(
  "SELECT name FROM sqlite_master WHERE type='table';",
  [],
  (err, tables) => {
    if (err) {
      console.error("Error getting tables:", err.message);
      return;
    }

    console.log("\n=== DATABASE TABLES ===");
    tables.forEach((table) => {
      console.log(`- ${table.name}`);
    });

    // For each table, get its schema and sample data
    let processedTables = 0;
    tables.forEach((table) => {
      const tableName = table.name;

      // Get table schema
      db.all(`PRAGMA table_info(${tableName});`, [], (err, columns) => {
        if (err) {
          console.error(`Error getting schema for ${tableName}:`, err.message);
          return;
        }

        console.log(`\n=== TABLE: ${tableName.toUpperCase()} ===`);
        console.log("Schema:");
        columns.forEach((col) => {
          console.log(
            `  ${col.name}: ${col.type}${col.pk ? " (PRIMARY KEY)" : ""}${
              col.notnull ? " NOT NULL" : ""
            }`
          );
        });

        // Get sample data (first 5 rows)
        db.all(`SELECT * FROM ${tableName} LIMIT 5;`, [], (err, rows) => {
          if (err) {
            console.error(`Error getting data from ${tableName}:`, err.message);
            return;
          }

          console.log(`\nSample data (${rows.length} rows):`);
          if (rows.length > 0) {
            console.table(rows);
          } else {
            console.log("  No data found");
          }

          // Get total count
          db.get(
            `SELECT COUNT(*) as count FROM ${tableName};`,
            [],
            (err, result) => {
              if (err) {
                console.error(
                  `Error counting rows in ${tableName}:`,
                  err.message
                );
              } else {
                console.log(`Total rows: ${result.count}`);
              }

              processedTables++;
              if (processedTables === tables.length) {
                db.close((err) => {
                  if (err) {
                    console.error("Error closing database:", err.message);
                  } else {
                    console.log("\nDatabase examination complete.");
                  }
                });
              }
            }
          );
        });
      });
    });
  }
);

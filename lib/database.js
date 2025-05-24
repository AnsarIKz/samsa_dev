import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseService {
  constructor() {
    this.dbPath = path.join(process.cwd(), "business.db");
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // Generic query method
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get a single row
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Sales data methods
  async getAllSales() {
    return this.query("SELECT * FROM sales ORDER BY Date DESC");
  }

  async getSalesStats() {
    const totalSales = await this.get(
      'SELECT COUNT(*) as count, SUM("Total Amount") as total FROM sales'
    );
    const monthlyData = await this.query(`
      SELECT 
        strftime('%Y-%m', Date) as month,
        SUM("Total Amount") as revenue,
        COUNT(*) as transactions
      FROM sales 
      GROUP BY strftime('%Y-%m', Date)
      ORDER BY month DESC
      LIMIT 12
    `);

    return {
      totalSales: totalSales.count || 0,
      totalRevenue: totalSales.total || 0,
      monthlyData: monthlyData || [],
    };
  }

  // Orders data methods
  async getAllOrders() {
    return this.query("SELECT * FROM orders ORDER BY Date DESC");
  }

  async getOrdersStats() {
    const totalOrders = await this.get("SELECT COUNT(*) as count FROM orders");
    const pendingOrders = await this.get(
      'SELECT COUNT(*) as count FROM orders WHERE Status = "Pending"'
    );
    const completedOrders = await this.get(
      'SELECT COUNT(*) as count FROM orders WHERE Status = "Completed"'
    );

    return {
      total: totalOrders.count || 0,
      pending: pendingOrders.count || 0,
      completed: completedOrders.count || 0,
    };
  }

  // Inventory data methods
  async getAllInventory() {
    return this.query('SELECT * FROM inventory ORDER BY "Product Name"');
  }

  async getInventoryStats() {
    const totalProducts = await this.get(
      "SELECT COUNT(*) as count FROM inventory"
    );
    const lowStockItems = await this.query(
      'SELECT * FROM inventory WHERE "Stock Quantity" <= "Restock Threshold"'
    );
    const totalValue = await this.get(
      'SELECT SUM("Stock Quantity" * "Unit Price") as value FROM inventory'
    );

    return {
      totalProducts: totalProducts.count || 0,
      lowStockItems: lowStockItems || [],
      totalValue: totalValue.value || 0,
    };
  }

  // Expenses data methods
  async getAllExpenses() {
    return this.query("SELECT * FROM expenses ORDER BY Date DESC");
  }

  async getExpensesStats() {
    const totalExpenses = await this.get(
      "SELECT SUM(Amount) as total FROM expenses"
    );
    const monthlyExpenses = await this.query(`
      SELECT 
        Category,
        SUM(Amount) as total
      FROM expenses 
      GROUP BY Category
      ORDER BY total DESC
    `);

    return {
      totalExpenses: totalExpenses.total || 0,
      byCategory: monthlyExpenses || [],
    };
  }

  // Dashboard analytics
  async getDashboardStats() {
    const sales = await this.getSalesStats();
    const orders = await this.getOrdersStats();
    const inventory = await this.getInventoryStats();
    const expenses = await this.getExpensesStats();

    const profit = sales.totalRevenue - expenses.totalExpenses;
    const profitMargin =
      sales.totalRevenue > 0 ? (profit / sales.totalRevenue) * 100 : 0;

    // Add new analytics data
    const lowStock = await this.getLowStockItems();
    const topProducts = await this.getTopProducts();
    const weeklySales = await this.getWeeklySales();
    const weeklyProductSales = await this.getWeeklyProductSales();

    return {
      revenue: {
        total: sales.totalRevenue,
        change: 0, // Would need historical data to calculate
        data: sales.monthlyData,
      },
      orders: {
        total: orders.total,
        pending: orders.pending,
        completed: orders.completed,
      },
      inventory: {
        totalProducts: inventory.totalProducts,
        lowStock: inventory.lowStockItems.length,
        totalValue: inventory.totalValue,
        lowStockItems: lowStock,
      },
      expenses: {
        total: expenses.totalExpenses,
        byCategory: expenses.byCategory,
      },
      profit: {
        amount: profit,
        margin: profitMargin,
      },
      analytics: {
        topProducts,
        weeklySales,
        weeklyProductSales,
        lowStockAlert: lowStock.length,
      },
    };
  }

  // New analytics methods based on provided SQL queries

  // Low stock items query
  async getLowStockItems() {
    return this.query(`
      SELECT 
        "Product Name" as productName, 
        "Stock Quantity" as stockQuantity, 
        "Restock Threshold" as restockThreshold
      FROM inventory
      WHERE "Stock Quantity" <= "Restock Threshold"
      ORDER BY "Stock Quantity" ASC
    `);
  }

  // Top selling products query
  async getTopProducts() {
    return this.query(`
      SELECT 
        "Product Name" as productName, 
        SUM(quantity) AS totalQuantity, 
        SUM("Total Amount") AS totalSales
      FROM sales
      GROUP BY "Product Name"
      ORDER BY totalQuantity DESC
      LIMIT 5
    `);
  }

  // Weekly sales query
  async getWeeklySales() {
    return this.query(`
      SELECT 
        strftime('%Y-%W', date) AS week, 
        SUM("Total Amount") AS weeklySales
      FROM sales
      GROUP BY week
      ORDER BY week DESC
      LIMIT 12
    `);
  }

  // Weekly product sales query
  async getWeeklyProductSales() {
    return this.query(`
      SELECT 
        strftime('%Y-%W', date) AS week, 
        "Product Name" as productName, 
        SUM(quantity) AS totalQuantity
      FROM sales
      GROUP BY week, "Product Name"
      ORDER BY week DESC, totalQuantity DESC
      LIMIT 20
    `);
  }

  // Enhanced sales analytics
  async getSalesAnalytics() {
    const topProducts = await this.getTopProducts();
    const weeklySales = await this.getWeeklySales();
    const weeklyProductSales = await this.getWeeklyProductSales();

    return {
      topProducts,
      weeklySales,
      weeklyProductSales,
    };
  }

  // Enhanced inventory analytics
  async getInventoryAnalytics() {
    const lowStock = await this.getLowStockItems();
    const allInventory = await this.getAllInventory();

    return {
      lowStock,
      allInventory,
      totalItems: allInventory.length,
      lowStockCount: lowStock.length,
    };
  }

  // Recent activity
  async getRecentActivity() {
    const recentSales = await this.query(
      "SELECT * FROM sales ORDER BY Date DESC LIMIT 5"
    );
    const recentOrders = await this.query(
      "SELECT * FROM orders ORDER BY Date DESC LIMIT 5"
    );
    const recentExpenses = await this.query(
      "SELECT * FROM expenses ORDER BY Date DESC LIMIT 5"
    );

    return {
      sales: recentSales,
      orders: recentOrders,
      expenses: recentExpenses,
    };
  }
}

export default new DatabaseService();

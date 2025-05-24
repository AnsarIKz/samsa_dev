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
      if (this.db) {
        resolve();
        return;
      }

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
            this.db = null;
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  async executeWithConnection(operation) {
    try {
      await this.connect();
      const result = await operation();
      return result;
    } catch (error) {
      throw error;
    }
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not connected"));
        return;
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not connected"));
        return;
      }

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
    return this.executeWithConnection(() =>
      this.query("SELECT * FROM sales ORDER BY Date DESC")
    );
  }

  async getSalesStats() {
    return this.executeWithConnection(async () => {
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
    });
  }

  // Orders data methods
  async getAllOrders() {
    return this.executeWithConnection(() =>
      this.query("SELECT * FROM orders ORDER BY Date DESC")
    );
  }

  async getOrdersStats() {
    return this.executeWithConnection(async () => {
      const totalOrders = await this.get(
        "SELECT COUNT(*) as count FROM orders"
      );
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
    });
  }

  // Inventory data methods
  async getAllInventory() {
    return this.executeWithConnection(() =>
      this.query('SELECT * FROM inventory ORDER BY "Product Name"')
    );
  }

  async getInventoryStats() {
    return this.executeWithConnection(async () => {
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
    });
  }

  // Expenses data methods
  async getAllExpenses() {
    return this.executeWithConnection(() =>
      this.query("SELECT * FROM expenses ORDER BY Date DESC")
    );
  }

  async getExpensesStats() {
    return this.executeWithConnection(async () => {
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
    });
  }

  // NEW SQL QUERIES WITH CORRECT COLUMN NAMES

  // low_stock.sql
  async getLowStockItems() {
    return this.executeWithConnection(() =>
      this.query(`
        SELECT 
          "Product Name" as productName, 
          "Stock Quantity" as stockQuantity, 
          "Restock Threshold" as restockThreshold
        FROM inventory
        WHERE "Stock Quantity" <= "Restock Threshold"
        ORDER BY "Stock Quantity" ASC
      `)
    );
  }

  // total_sales.sql
  async getTopProducts() {
    return this.executeWithConnection(() =>
      this.query(`
        SELECT 
          "Product Name" as productName, 
          SUM(quantity) AS totalQuantity, 
          SUM("Total Amount") AS totalSales
        FROM sales
        GROUP BY "Product Name"
        ORDER BY totalQuantity DESC
        LIMIT 5
      `)
    );
  }

  // weekly_sales.sql
  async getWeeklySales() {
    return this.executeWithConnection(() =>
      this.query(`
        SELECT 
          strftime('%Y-%W', Date) AS week, 
          SUM("Total Amount") AS weeklySales
        FROM sales
        GROUP BY week
        ORDER BY week DESC
        LIMIT 12
      `)
    );
  }

  // total_weekly.sql
  async getWeeklyProductSales() {
    return this.executeWithConnection(() =>
      this.query(`
        SELECT 
          strftime('%Y-%W', Date) AS week, 
          "Product Name" as productName, 
          SUM(Quantity) AS totalQuantity
        FROM sales
        GROUP BY week, "Product Name"
        ORDER BY week DESC, totalQuantity DESC
        LIMIT 20
      `)
    );
  }

  // turnover.sql
  async getTurnoverAnalysis() {
    return this.executeWithConnection(() =>
      this.query(`
        SELECT 
          i."Product Name" as productName,
          COALESCE(SUM(s.Quantity), 0) AS totalSold,
          i."Stock Quantity" as stockQuantity,
          ROUND(CAST(COALESCE(SUM(s.Quantity), 0) AS REAL) / (i."Stock Quantity" + 1), 2) AS turnoverRatio
        FROM inventory i
        LEFT JOIN sales s ON i."Product Name" = s."Product Name"
        GROUP BY i."Product Name"
        ORDER BY turnoverRatio DESC
      `)
    );
  }

  // profit_expense.sql
  async getProfitExpenseAnalysis() {
    return this.executeWithConnection(() =>
      this.query(`
        WITH sales_summary AS (
          SELECT 
            strftime('%Y-%m', Date) AS month, 
            SUM("Total Amount") AS total_sales
          FROM sales
          GROUP BY month
        ),
        expenses_summary AS (
          SELECT 
            strftime('%Y-%m', Date) AS month, 
            SUM(Amount) AS total_expenses
          FROM expenses
          GROUP BY month
        )
        SELECT 
          COALESCE(s.month, e.month) as month,
          IFNULL(s.total_sales, 0) AS totalSales,
          IFNULL(e.total_expenses, 0) AS totalExpenses,
          (IFNULL(s.total_sales, 0) - IFNULL(e.total_expenses, 0)) AS profit
        FROM sales_summary s
        LEFT JOIN expenses_summary e ON s.month = e.month
        UNION
        SELECT 
          e.month,
          IFNULL(s.total_sales, 0) AS totalSales,
          IFNULL(e.total_expenses, 0) AS totalExpenses,
          (IFNULL(s.total_sales, 0) - IFNULL(e.total_expenses, 0)) AS profit
        FROM expenses_summary e
        LEFT JOIN sales_summary s ON s.month = e.month
        WHERE s.month IS NULL
        ORDER BY month DESC
        LIMIT 12
      `)
    );
  }

  // monthly_expense.sql
  async getMonthlyExpensesByCategory() {
    return this.executeWithConnection(() =>
      this.query(`
        SELECT 
          strftime('%Y-%m', Date) AS month, 
          Category as category, 
          SUM(Amount) AS totalExpense
        FROM expenses
        GROUP BY month, category
        ORDER BY month DESC, totalExpense DESC
      `)
    );
  }

  // high_expense.sql
  async getHighExpenses() {
    return this.executeWithConnection(() =>
      this.query(`
        SELECT 
          "Expense ID" as expenseId, 
          Date as date, 
          Category as category, 
          Description as description, 
          Amount as amount
        FROM expenses
        WHERE Amount >= 1000
        ORDER BY Date DESC
      `)
    );
  }

  // Analytics aggregation methods
  async getSalesAnalytics() {
    return this.executeWithConnection(async () => {
      const topProducts = await this.getTopProducts();
      const weeklySales = await this.getWeeklySales();
      const weeklyProductSales = await this.getWeeklyProductSales();
      const turnoverAnalysis = await this.getTurnoverAnalysis();
      const profitExpenseAnalysis = await this.getProfitExpenseAnalysis();

      return {
        topProducts,
        weeklySales,
        weeklyProductSales,
        turnoverAnalysis,
        profitExpenseAnalysis,
      };
    });
  }

  async getInventoryAnalytics() {
    return this.executeWithConnection(async () => {
      const lowStock = await this.getLowStockItems();
      const allInventory = await this.getAllInventory();
      const turnoverAnalysis = await this.getTurnoverAnalysis();

      return {
        lowStock,
        allInventory,
        turnoverAnalysis,
        totalItems: allInventory.length,
        lowStockCount: lowStock.length,
      };
    });
  }

  // Main dashboard analytics
  async getDashboardStats() {
    return this.executeWithConnection(async () => {
      const sales = await this.getSalesStats();
      const orders = await this.getOrdersStats();
      const inventory = await this.getInventoryStats();
      const expenses = await this.getExpensesStats();

      const profit = sales.totalRevenue - expenses.totalExpenses;
      const profitMargin =
        sales.totalRevenue > 0 ? (profit / sales.totalRevenue) * 100 : 0;

      // Get all new analytics data
      const lowStock = await this.getLowStockItems();
      const topProducts = await this.getTopProducts();
      const weeklySales = await this.getWeeklySales();
      const weeklyProductSales = await this.getWeeklyProductSales();
      const turnoverAnalysis = await this.getTurnoverAnalysis();
      const profitExpenseAnalysis = await this.getProfitExpenseAnalysis();
      const monthlyExpensesByCategory =
        await this.getMonthlyExpensesByCategory();
      const highExpenses = await this.getHighExpenses();

      return {
        revenue: {
          total: sales.totalRevenue,
          change: 0,
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
          turnoverAnalysis,
          profitExpenseAnalysis,
          monthlyExpensesByCategory,
          lowStockAlert: lowStock.length,
          highExpensesAlert: highExpenses.length,
        },
        alerts: {
          lowStock,
          highExpenses,
          lowTurnoverProducts: turnoverAnalysis.filter(
            (item) => item.turnoverRatio < 0.1
          ),
        },
      };
    });
  }

  // Recent activity
  async getRecentActivity() {
    return this.executeWithConnection(async () => {
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
    });
  }
}

// Create a singleton instance
export default new DatabaseService();

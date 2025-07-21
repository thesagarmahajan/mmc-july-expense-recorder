import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Expense {
  _id: string;
  amount: number;
  categoryId: string;
  date: string;
  description?: string;
  categoryTitle?: string;
  [key: string]: any;
}

interface Category {
  _id: string;
  title: string;
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch categories for filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;
        const res = await fetch(`http://localhost:8888/categories/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (e) {
        // ignore category errors for now
      }
    };
    fetchCategories();
  }, []);

  // Fetch expenses (last 10 or filtered)
  const fetchExpenses = async (params?: {from?: string, to?: string, categoryId?: string}) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please sign in.");
        setLoading(false);
        return;
      }
      console.log("Dashboard Token:", token);
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;
      console.log("Dashboard Decoded userId:", userId);
      let url = "http://localhost:8888/expenses";
      if (params && params.from && params.to && params.categoryId) {
        url = `http://localhost:8888/expenses/${params.from}/${params.to}/${params.categoryId}`;
      }
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await res.json();
      setExpenses(data);
    } catch (e: any) {
      setError(e.message || "Error fetching expenses");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch (last 10)
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle filter submit
  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) {
      setError("Please select both from and to dates.");
      return;
    }
    fetchExpenses({ from, to, categoryId });
  };

  // Delete expense
  const handleDelete = async (expenseId: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please sign in.");
        return;
      }
      const res = await fetch(`http://localhost:8888/expenses/${expenseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete expense");
      }
      // Refresh the list (keep current filter)
      if (from && to) {
        fetchExpenses({ from, to, categoryId });
      } else {
        fetchExpenses();
      }
    } catch (e: any) {
      setError(e.message || "Error deleting expense");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center py-10">
      <header className="w-full max-w-2xl px-4 py-4 mb-8 bg-card shadow-md rounded-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          {/* SVG Money Icon */}
          <svg className="text-primary" width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="currentColor" fillOpacity="0.1"/><path d="M7 10.5V9.75C7 8.50736 8.00736 7.5 9.25 7.5H14.75C15.9926 7.5 17 8.50736 17 9.75V10.5M7 10.5H17M7 10.5V14.25C7 15.4926 8.00736 16.5 9.25 16.5H14.75C15.9926 16.5 17 15.4926 17 14.25V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Expense Tracker
        </h1>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/add-expense")}>Add Expense</Button>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
          <Button variant="outline" onClick={() => navigate("/manage-categories")}>Manage Categories</Button>
        </div>
      </header>

      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col items-start pb-4">
          <CardTitle className="text-2xl">Your Expenses</CardTitle>
          <p className="text-muted-foreground text-sm">View and manage your recorded expenses.</p>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <form
            onSubmit={handleFilter}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end mb-6 p-4 border rounded-lg bg-background shadow-inner"
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="from" className="text-sm">From</Label>
              <Input id="from" type="date" value={from} onChange={e => setFrom(e.target.value)} required className="h-9 text-base" />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="to" className="text-sm">To</Label>
              <Input id="to" type="date" value={to} onChange={e => setTo(e.target.value)} required className="h-9 text-base" />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="category" className="text-sm">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category" className="w-full h-9 text-base">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat._id} value={cat._id}>{cat.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="h-9 w-full sm:col-span-2 md:col-span-1">Apply Filters</Button>
          </form>

          {loading && <p className="text-muted-foreground text-center py-8">Loading expenses...</p>}
          {error && <p className="text-destructive text-center py-8">{error}</p>}
          {!loading && !error && (
            <div className="space-y-4">
              {expenses.length === 0 ? (
                <div className="text-muted-foreground text-center py-10 border rounded-lg bg-card/50">
                  <p className="mb-2">No expenses found for the selected criteria.</p>
                  <p>Try adjusting your filters or add a new expense!</p>
                </div>
              ) : (
                expenses.map((expense) => (
                  <div
                    key={expense._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card/70 border rounded-lg px-5 py-4 shadow-sm hover:bg-accent hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col mb-2 sm:mb-0">
                      <span className="font-semibold text-lg text-foreground">{expense.description || "No description"}</span>
                      <span className="text-sm text-muted-foreground">
                        <span className="font-medium text-base">₹{expense.amount}</span> on {new Date(expense.date).toLocaleDateString()}{expense.categoryTitle ? ` • ${expense.categoryTitle}` : ""}
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(expense._id)}
                      className="mt-2 sm:mt-0 ml-0 sm:ml-4"
                      title="Delete expense"
                    >
                      Delete
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

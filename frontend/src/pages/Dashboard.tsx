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

  return (
    <div className="flex justify-center items-start min-h-screen bg-muted py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-2xl">Expenses</CardTitle>
          <Button onClick={() => navigate("/add-expense")}>Add Expense</Button>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <form
            onSubmit={handleFilter}
            className="flex flex-wrap gap-4 items-end mb-6"
          >
            <div className="flex flex-col gap-1 w-36">
              <Label htmlFor="from">From</Label>
              <Input id="from" type="date" value={from} onChange={e => setFrom(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1 w-36">
              <Label htmlFor="to">To</Label>
              <Input id="to" type="date" value={to} onChange={e => setTo(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1 w-44">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category" className="w-full">
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
            <Button type="submit" className="h-9">Filter</Button>
          </form>

          {loading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive mb-4">{error}</p>}
          {!loading && !error && (
            <div className="space-y-3">
              {expenses.length === 0 ? (
                <div className="text-muted-foreground text-center py-8">No expenses found.</div>
              ) : (
                expenses.map((expense) => (
                  <div
                    key={expense._id}
                    className="flex items-center justify-between bg-card/70 border rounded-lg px-4 py-3 shadow-sm hover:bg-accent transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-base">{expense.description || "No description"}</span>
                      <span className="text-sm text-muted-foreground">
                        ₹{expense.amount} on {new Date(expense.date).toLocaleDateString()} {expense.categoryTitle ? `(${expense.categoryTitle})` : ""}
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(expense._id)}
                      className="ml-4"
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

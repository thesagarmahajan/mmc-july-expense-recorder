import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Category {
  _id: string;
  title: string;
}

export default function AddExpense() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryTitle, setCategoryTitle] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please sign in.");
          setLoading(false);
          return;
        }
        // Decode userId from token (assuming JWT)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;
        const res = await fetch(`http://localhost:8888/categories/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await res.json();
        setCategories(data);
      } catch (e: any) {
        setError(e.message || "Error fetching categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please sign in.");
        return;
      }
      const res = await fetch("http://localhost:8888/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          amount: Number(amount),
          categoryTitle,
          date,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to add expense");
      }
      navigate("/dashboard");
    } catch (e: any) {
      setError(e.message || "Error adding expense");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-muted-foreground">Loading categories...</p>}
          {error && <p className="text-destructive mb-4">{error}</p>}
          {!loading && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-1">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  placeholder="Enter expense description"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                  placeholder="Enter amount"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  list="categories-list"
                  value={categoryTitle}
                  onChange={e => setCategoryTitle(e.target.value)}
                  required
                  placeholder="Type or select category"
                />
                <datalist id="categories-list">
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.title} />
                  ))}
                </datalist>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add Expense</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
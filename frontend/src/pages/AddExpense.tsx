import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {categoriesUrl, expensesUrl} from "../globals"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";

interface Category {
  _id: string;
  title: string;
}

export default function AddExpense() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // Changed from categoryTitle
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
        console.log("Token:", token);
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;
        console.log("Decoded userId:", userId);
        const res = await fetch(`${categoriesUrl}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategoryId(data[0]._id); // Set default selected category
        }
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
      const res = await fetch(expensesUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          amount: Number(amount),
          categoryId: selectedCategoryId, // Changed from categoryTitle
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-black py-10 px-4">
      <Card className="w-full max-w-md p-6 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="-ml-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <CardTitle className="text-3xl font-bold text-center flex-grow">Add New Expense</CardTitle>
          <div className="w-10"></div>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-muted-foreground text-center py-8">Loading categories...</p>}
          {error && <p className="text-destructive text-center mb-4">{error}</p>}
          {!loading && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="description" className="font-semibold">Description</Label>
                <Input
                  id="description"
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  placeholder="e.g., Groceries, Rent, Utilities"
                  className="focus:ring-2 focus:ring-primary h-11 text-base"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount" className="font-semibold">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                  placeholder="e.g., 500.00"
                  className="focus:ring-2 focus:ring-primary h-11 text-base"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="font-semibold">Category</Label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger id="category" className="w-full h-11 text-base">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="font-semibold">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-primary h-11 text-base"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-lg font-bold shadow-md hover:shadow-lg transition-shadow duration-200">Add Expense</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
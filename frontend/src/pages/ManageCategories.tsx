import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { categoriesUrl } from "@/globals";

interface Category {
  _id: string;
  title: string;
}

export default function ManageCategories() {
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

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
    } catch (e: any) {
      setError(e.message || "Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError("Category title cannot be empty.");
      return;
    }
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please sign in.");
        return;
      }
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;
      const res = await fetch(`${categoriesUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newCategory, userId }),
      });
      if (!res.ok) {
        throw new Error("Failed to add category");
      }
      setNewCategory("");
      fetchCategories(); // Refresh list
    } catch (e: any) {
      setError(e.message || "Error adding category");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this category? Expenses associated with this category might be affected.")) return;
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please sign in.");
        return;
      }
      const res = await fetch(`${categoriesUrl}/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete category");
      }
      fetchCategories(); // Refresh list
    } catch (e: any) {
      setError(e.message || "Error deleting category");
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
          <CardTitle className="text-3xl font-bold text-center flex-grow">Manage Categories</CardTitle>
          <div className="w-10"></div>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-muted-foreground text-center py-8">Loading categories...</p>}
          {error && <p className="text-destructive text-center mb-4">{error}</p>}
          {!loading && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="new-category" className="font-semibold">New Category Title</Label>
                <Input
                  id="new-category"
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g., Food, Transport, Entertainment"
                  className="focus:ring-2 focus:ring-primary h-11 text-base"
                />
              </div>
              <Button onClick={handleAddCategory} className="w-full h-11 text-lg font-bold shadow-md hover:shadow-lg transition-shadow duration-200">Add Category</Button>

              <h3 className="text-xl font-semibold mt-6 mb-2">Existing Categories</h3>
              {categories.length === 0 ? (
                <p className="text-muted-foreground text-center py-4 border rounded-lg bg-card/50">No categories added yet.</p>
              ) : (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between bg-card/70 border rounded-lg px-4 py-3 shadow-sm"
                    >
                      <span className="text-lg font-medium text-foreground">{category.title}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
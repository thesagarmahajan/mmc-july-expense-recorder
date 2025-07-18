import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Handle case when the user is not authenticated
          navigate("/signin");
          return;
        }

        // Fetch expenses
        const response = await fetch("http://localhost:8888/expenses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setExpenses(data);

        // Fetch categories
        const categoryResponse = await fetch("http://localhost:8888/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await fetch(`http://localhost:8888/expenses/${expenseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setExpenses(expenses.filter((expense) => expense._id !== expenseId));
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleCategoryChange = async () => {
    // Handle filtering by category
  };

  const handleDateFilter = async () => {
    // Handle filtering by date range
  };

  return (
    <div className="h-screen flex flex-col items-center">
      <div className="w-full max-w-7xl p-4">
        {/* Filter Section */}
        <div className="flex flex-wrap gap-4 justify-between mb-8">
          <div className="flex items-center gap-2">
            <Label htmlFor="category">Category:</Label>
            <Select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="startDate">Start Date:</Label>
            <Input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="endDate">End Date:</Label>
            <Input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <Button onClick={handleDateFilter}>Filter</Button>
        </div>

        {/* Expense Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Expense Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div>Total Expenses: $X</div>
              {/* Add other summary details here */}
            </div>
          </CardContent>
        </Card>

        {/* Expense Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td className="border px-4 py-2">{expense.description}</td>
                    <td className="border px-4 py-2">{expense.categoryName}</td>
                    <td className="border px-4 py-2">${expense.amount}</td>
                    <td className="border px-4 py-2">{expense.date}</td>
                    <td className="border px-4 py-2">
                      <Button onClick={() => handleDeleteExpense(expense._id)} variant="destructive">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/add-expense")}>Add Expense</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

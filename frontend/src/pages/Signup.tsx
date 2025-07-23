import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authUrl } from "@/globals"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function Signup() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate()

    // Add useEffect to check for token on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]); // navigate should be in dependency array

    function handleSignInRedirect() {
        navigate("/signin");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // prevent page reload
        setError(null); // Clear previous errors

        try {
            const response = await fetch(authUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.errors && errorData.errors.name) {
                    setError(errorData.errors.name);
                } else {
                    throw new Error(`Server error: ${response.status}`);
                }
                return; // Stop execution if there's a server error
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);

            // Redirect to dashboard page or show success message
            navigate("/dashboard");
        } catch (err) {
            console.error("Signup error:", err);
            setError("An unexpected error occurred. Please try again.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-muted px-4">
            <Card className="w-full max-w-sm shadow-xl animate-fade-in">
                <CardHeader className="items-center">
                    {/* SVG Money Icon */}
                    <svg className="text-primary mb-2" width="36" height="36" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="currentColor" fillOpacity="0.1"/><path d="M7 10.5V9.75C7 8.50736 8.00736 7.5 9.25 7.5H14.75C15.9926 7.5 17 8.50736 17 9.75V10.5M7 10.5H17M7 10.5V14.25C7 15.4926 8.00736 16.5 9.25 16.5H14.75C15.9926 16.5 17 15.4926 17 14.25V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password below to create your account
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" onClick={handleSignInRedirect} className="text-xs px-0">Sign In</Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                onChange={(e) => setName(e.target.value)}
                                className="focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className="focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className="focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <CardFooter className="flex-col gap-2 mt-4 p-0">
                            <Button type="submit" className="w-full">
                                Sign Up
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

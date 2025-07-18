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
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function Signup() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    function handleSignInRedirect() {
        navigate("/signin");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // prevent page reload

        try {
            const response = await fetch("http://localhost:8888/users/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);

            console.log("User created successfully:", data);

            // Redirect to dashboard page or show success message
            navigate("/dashboard");
        } catch (err) {
            console.error("Signup failed:", err);
            // You could show an error toast or message here
        }
    }


    return (
        <div className="h-screen flex justify-center items-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Enter your email and password below to create your account
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" onClick={handleSignInRedirect}>Sign In</Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit button moved inside form */}
                        <CardFooter className="flex-col gap-2 mt-6">
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

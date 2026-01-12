"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth/actions";
import { Eye, EyeClosed, LucidePersonStanding } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";


export default function Login(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const [isShowPassword, setShowPassword] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const handleLogin = (e: FormEvent) => {
        e.preventDefault()  
        if(email.trim() === '' || password.trim() === ''){
            toast.error("Please provide email and password", {
                style: {
                    color: "red"
                }
            })
            return
        }

        setLoading(true)

        login(email, password)
            .then(()=> {
                toast.success("Signed in successfully", {
                    style: {
                        color: "green"
                    }
                });
                router.push("/")
            })
            .catch(error=> {
                console.log(error);
                
                toast.error(error.message, {
                    style: {
                        color: "red"
                    }
                })
            })
            .finally(()=> {
                setLoading(false)
            })
    }


    return (
        <div className="h-screen grid place-items-center px-4">
            <Card className="w-full max-w-[500px] m-auto border-none shadow-none">
                <CardHeader className="text-center">

                    <h1 className="font-bold text-xl">Login to your account</h1>
                    <p className="text-black/60 text-sm">Enter your email below to login to your account</p>

                </CardHeader>
                
                <CardContent>
                    <form className="space-y-4" onSubmit={handleLogin}>
                        
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium">Email</label>

                            <Input
                                id="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={e=> setEmail(e.target.value)} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium">Password</label>

                            <Input
                                id="password"
                                type={isShowPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                icon={isShowPassword ? EyeClosed : Eye}
                                iconPosition={"right"}
                                onIconClick={() => setShowPassword(prev => !prev)}
                                onChange={e=> setPassword(e.target.value)}/>
                        </div>

                        <Button 
                            className="w-full cursor-pointer" 
                            isLoading={isLoading}
                            type="submit"
                            loadingText="Signing">Sign in</Button>

                        <div>
                            <span className="text-sm text-black/60">Don't have an account ? <Link className="underline hover:text-black" href="/signup">Create Account</Link></span>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
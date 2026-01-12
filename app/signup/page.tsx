"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signup } from "@/lib/auth/actions";
import { Eye, EyeClosed, LucidePersonStanding } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";



export default function Signup(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const [isShowPassword, setShowPassword] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const handleSignUp = (e: FormEvent) => {
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

        signup(email, password)
            .then(()=> {
                toast.success("Account created successfully", {
                    style: {
                        color: "green"
                    }
                });
                router.push("/")
            })
            .catch(error=> {
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
                <CardHeader className="text-center space-y- ">

                    <div className="text-center">
                        <h1 className="font-bold text-xl">Create an account</h1>
                        <p className="text-black/60 text-sm">Enter your email below to create your account</p>
                    </div>
                </CardHeader>
                
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSignUp}>
                        <div className="flex flex-col gap-2">
                            <label
                                className="text-sm font-medium"
                                htmlFor="email">
                                    Email
                            </label>
                            
                            <Input
                                id="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={e=> setEmail(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                className="text-sm font-medium"
                                htmlFor="password">
                                    Password
                            </label>
                            
                            <Input
                                id="password"
                                type={isShowPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                icon={isShowPassword ? EyeClosed : Eye}
                                iconPosition={"right"}
                                onIconClick={() => setShowPassword(prev => !prev)}
                                onChange={e=> setPassword(e.target.value)}
                            />
                        </div>

                        <Button
                            className="w-full cursor-pointer"
                            type="submit"
                            isLoading={isLoading}
                            loadingText="Signing"
                        >Sign up</Button>

                        <div>
                            <span className="text-sm text-black/60">Already a member ? <Link href="/login" className="underline hover:text-black">Sign in</Link></span>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
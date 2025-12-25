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
                toast.error(error.message, {
                style: {
                    color: "red"
                }
            })
            })
    }


    return (
        <div className="h-screen grid place-items-center px-4">
            <Card className="w-full max-w-[500px] m-auto">
                <CardHeader className="text-center space-y-4">

                    <div className="flex w-full  justify-center">
                        <LucidePersonStanding/>
                        <h1 className="font-bold text-xl">Auth Studio</h1>
                    </div>

                    <div>
                        <p>Please enter your details to sign in</p>
                    </div>
                </CardHeader>
                
                <CardContent>
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <label className="text-sm" htmlFor="email">Email address*</label>
                            <Input
                                id="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={e=> setEmail(e.target.value)} />
                        </div>

                        <div>
                            <label className="text-sm" htmlFor="password">Password*</label>
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

                        <Button className="w-full">Sign in</Button>

                        <div>
                            <span className="text-sm">New on our platform ? <Link className="hover:underline" href="/signup">Create Account</Link></span>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
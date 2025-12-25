"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signup } from "@/lib/auth/actions";
import { Eye, EyeClosed, LucidePersonStanding } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";



export default function Signup(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const [isShowPassword, setShowPassword] = useState(false)

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
                    <form className="space-y-4" onSubmit={handleSignUp}>
                        <div>
                            <label className="text-sm" htmlFor="email">Email address*</label>
                            <Input
                                id="email"
                                placeholder="Enter an email address"
                                value={email}
                                onChange={e=> setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm" htmlFor="password">Password*</label>
                            <Input
                                id="password"
                                type={isShowPassword ? "text" : "password"}
                                placeholder="Enter a password"
                                value={password}
                                icon={isShowPassword ? EyeClosed : Eye}
                                iconPosition={"right"}
                                onIconClick={() => setShowPassword(prev => !prev)}
                                onChange={e=> setPassword(e.target.value)}
                            />
                        </div>

                        <Button
                            className="w-full"
                            type="submit"
                        >Sign up</Button>

                        <div>
                            <span className="text-sm">Already a member ? <Link href="/login" className="hover:underline cursor-pointer">Sign in</Link></span>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
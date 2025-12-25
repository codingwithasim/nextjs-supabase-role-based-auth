
import { supabase } from "@/lib/supabase/client";


async function login(email: string, password: string) {

    const credentials = {
        email, password
    }
    
    const { error } = await supabase.auth.signInWithPassword(credentials)

    if(error) {
        throw new Error(error.message)
    }
} 

async function signup(email: string, password: string) {
    
    const { error, data } = await supabase.auth.signUp({ email, password })

    if(error) throw new Error(error.message)
    
    const userId = data.user?.id
    if(!userId){
        throw new Error("User not returned from Supabase")
    }

    try{
        await assignRole(userId)
    }catch(err){
        console.log(err)
    }

    return data.user
}



async function signout(){

    const { error } = await supabase.auth.signOut()

    if(error){
        throw new Error(error.message)
    }
}

async function assignRole(id: any){

    const profile = {
        id: id,
        role: "user"
    }
    const { error } = await supabase.from("profiles").insert(profile) 

    if(error){
        console.log(error)
    }
}

export {
    login,
    signup,
    signout
}
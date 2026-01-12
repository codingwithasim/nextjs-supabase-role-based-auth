"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"
import { ArrowUpRightIcon, FolderArchive, Info } from "lucide-react"
import { signout } from "@/lib/auth/actions"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export default function Home() {

  const [role, setRole] = useState(null)
  
  const menuItems = [
    "Home",
    "Components",
    "Docs",
    "List",
    "Simple",
  ]

  const router = useRouter()

  const handleSignOut = () => {
    signout().then(() => {
      toast.success("Signed out successfully")
      router.push("/login")
    }).catch(err => toast.error(err))
  }


  useEffect(()=> {
    supabase.auth.getUser().then(response => {
      const userId = response.data.user?.id

      if(userId){
        supabase
          .from("profiles")
          .select("role")
          .then(res => {
            const object = res?.data

            if(object){
              const row = object[0]
              setRole(row?.role ?? "user")
            }
          })
      }
    })
    .catch(error => console.log(error))
  }, [])



  return (
    <SidebarProvider defaultOpen>

      <AppSidebar isAdmin={role === "admin"}/>


      <div className="flex flex-col w-full h-screen">

        <div className="py-2">

          <NavigationMenu className="min-w-full *:w-full">

            <NavigationMenuList className="px-4">
              <NavigationMenuItem>  
                <SidebarTrigger/>
              </NavigationMenuItem>
              {
                menuItems.map(item => {
                  return (
                    <NavigationMenuItem key={item} className="hidden lg:block">
                      <NavigationMenuTrigger>{item}</NavigationMenuTrigger>
                    </NavigationMenuItem>
                  )
                })
            }

              <NavigationMenuItem className="ml-auto">
                <Button onClick={handleSignOut}>Logout</Button>
              </NavigationMenuItem>
            </NavigationMenuList>
            
          </NavigationMenu>
        </div>

        {
          role &&
          <div className="bg-indigo-500 flex  items-center gap-2 text-sm text-white rounded-md p-4 m-4">
          <Info size={15}/>
            {
              role === "admin" ?
              "You are browsing this page as an admin"
              :
              "You are browsing this page as a user"
            }
        </div>
        }

        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <FolderArchive/>
            </EmptyMedia>

            <EmptyTitle>
              No Projects yet
            </EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any projects yet. Get started by creating
              your first project.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <div className="flex gap-2">
              <Button>Create Project</Button>
              <Button variant="outline">Import Project</Button>
            </div>
          </EmptyContent>

          <Button
            variant="link"
            
            className="text-muted-foreground"
            size="sm"
          >
            <a href="#" className="flex items-center gap-2">
              Learn More <ArrowUpRightIcon />
            </a>
          </Button>

        </Empty>

        

        
        
      </div>
    </SidebarProvider>
    
  );
}

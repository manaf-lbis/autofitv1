import React from 'react'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import { Link } from 'react-router-dom'
  import Dropdown from "./DropDownMenu";


const NavMenu:React.FC = () => {
    const userState = useSelector((state:RootState)=>state.auth)
    
    

  return (
  
    <div>
        {
            userState.isAuthenticated ?
            <Dropdown>

                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>
                        {
                            userState.user?.name.slice(0,2).toLocaleUpperCase()
                        }
                    </AvatarFallback>
                </Avatar>
                
            </Dropdown>

            
         
            :

            <Link to={"/login"} className="text-white hidden md:block hover:text-btn_color transition-hover duration-300">
                Get Started
            </Link>
        }
        
        
    </div>
  )
}

export default NavMenu
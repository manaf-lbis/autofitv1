import React from 'react'
import AnimatedLogo from './components/Logo'
import DesktopNav from './components/DesktopNav.'
import { Button } from '@/components/ui/button'
import { BadgeHelp } from 'lucide-react'
import NavMenu from './components/NavMenu'
import BottomNav from './components/BottomNav'


const Navbar = () => {
  return (
    <>
        <nav className="w-full top-0 left-0 right-0 z-50 h-16 bg-af_darkBlue flex items-center fided shadow-md md:px-8 lg:px-12">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <AnimatedLogo />
                <DesktopNav />
                <div className="flex items-center gap-4">
                    <Button className="bg-btn_color hover:bg-btn_hover">
                        <BadgeHelp />Stuck On Road
                    </Button>
                    <NavMenu />
                </div>
            </div>
         </nav>

         <BottomNav />
   </>



  )
}

export default Navbar
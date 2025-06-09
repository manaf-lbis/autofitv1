import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'
import React from 'react'


const Notification = () => {

  return (
    <>
        <Button variant="ghost" size="icon" className="relative hover:bg-gray-50" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
            </span>
        </Button>
    
    </>
  )
}

export default Notification
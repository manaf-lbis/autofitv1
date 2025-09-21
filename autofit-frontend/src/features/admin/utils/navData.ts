import {
  Wrench,
  Users,
  Settings2,
  LayoutDashboard,
  Handshake
} from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "mss@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
   
    {
      title: "User",
      url: "",
      icon: Users,
      items: [
        {
          title: "Users",
          url: "/admin/users",
        },
      ],
    },
    {
      title: "Mechanic",
      url: "",
      icon: Wrench,
      items: [
        {
          title: "New Application",
          url: "/admin/new-application",
        },
         {
          title: "Mechanics",
          url: "/admin/mechanics",
        },
      ],
    },
    {
      title: "Services",
      url: "#",
      icon: Handshake,
      items: [
         {
          title: "Pretrip Plans",
          url: "/admin/pretrip-plans",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Change Password",
          url: "/admin/change-password",
        },
      ],
    },
  ],
}


export default data
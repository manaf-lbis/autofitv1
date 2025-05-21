import {
  Wrench,
  Users,
  Settings2,
  MessageSquare,
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
      title: "Messages",
      url: "/admin/messages",
      icon: MessageSquare,
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
          url: "/admin/mechanic/new-application",
        },
         {
          title: "Mechanics",
          url: "/admin/mechanic/mechanics",
        },
         {
          title: "Update Requests",
          url: "/admin/mechanic/update-requests",
        },
      ],
    },
    {
      title: "Services",
      url: "#",
      icon: Handshake,
      items: [
        {
          title: "All Services",
          url: "#",
        },
         {
          title: "Plans",
          url: "#",
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
          title: "General",
          url: "/admin/settings",
        },
      ],
    },
  ],
}


export default data
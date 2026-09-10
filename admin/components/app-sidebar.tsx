import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Icon } from "@iconify/react"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: "lucide:layout-dashboard",
  },
  {
    title: "Properties",
    url: "/properties",
    icon: "lucide:building-2",
  },
  {
    title: "Users",
    url: "/users",
    icon: "lucide:users",
  },
  {
    title: "Testimonials",
    url: "/testimonials",
    icon: "lucide:message-square-quote",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: "lucide:settings",
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center py-6">
        <div className="flex items-center gap-2 px-4 w-full">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icon icon="lucide:tent" className="h-5 w-5" />
          </div>
          <span className="truncate font-semibold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
            Addis Hunt
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <Icon icon={item.icon} className="h-4 w-4 text-muted-foreground" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 group-data-[collapsible=icon]:hidden border border-border/50">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
             <Icon icon="lucide:user" className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-muted-foreground">admin@addishunt.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

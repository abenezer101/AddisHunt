import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Icon } from "@iconify/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const recentActivity = [
  {
    id: "1",
    user: "Alice Johnson",
    email: "alice@example.com",
    action: "Posted a new Property",
    target: "Luxury Villa in Bole",
    status: "Published",
    time: "2 hours ago",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: "2",
    user: "Bob Smith",
    email: "bob@example.com",
    action: "Updated Testimonial",
    target: "Service Review",
    status: "Pending",
    time: "5 hours ago",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
  },
  {
    id: "3",
    user: "Charlie Davis",
    email: "charlie@example.com",
    action: "Deleted Listing",
    target: "Apartment in CMC",
    status: "Removed",
    time: "1 day ago",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
]

export default function DashboardPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64 max-w-sm">
              <Icon icon="lucide:search" className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search across admin..."
                className="w-full rounded-lg bg-muted/50 pl-9 shadow-none border-border/50 focus-visible:ring-primary/50"
              />
            </div>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Icon icon="lucide:bell" className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 md:p-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
              <Icon icon="lucide:building-2" className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500 font-medium inline-flex items-center gap-1">
                  <Icon icon="lucide:trending-up" className="h-3 w-3" /> +12%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
              <Icon icon="lucide:users" className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,549</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500 font-medium inline-flex items-center gap-1">
                  <Icon icon="lucide:trending-up" className="h-3 w-3" /> +4.5%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
              <Icon icon="lucide:file-clock" className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground text-amber-500/80">
                Requires attention
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Page Views</CardTitle>
              <Icon icon="lucide:activity" className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+54,231</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500 font-medium inline-flex items-center gap-1">
                  <Icon icon="lucide:trending-up" className="h-3 w-3" /> +19%
                </span>{" "}
                from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-7 lg:col-span-4 xl:col-span-5 bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Content Activity</CardTitle>
                <CardDescription>
                  Latest updates on the Addis Hunt landing page.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex border-border/50 bg-background/50">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/50 bg-background/50">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.map((activity) => (
                      <TableRow key={activity.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-border/50">
                              <AvatarImage src={activity.avatar} alt={activity.user} />
                              <AvatarFallback>{activity.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm">{activity.user}</span>
                              <span className="text-xs text-muted-foreground hidden md:inline-block">{activity.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{activity.action}</TableCell>
                        <TableCell>{activity.target}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={
                              activity.status === "Published" 
                                ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20" 
                                : activity.status === "Pending"
                                ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
                                : "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"
                            }
                          >
                            {activity.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">{activity.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-7 lg:col-span-3 xl:col-span-2 bg-card/50 backdrop-blur border-border/50 flex flex-col">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current health of the platform services.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-6 justify-start mt-2">
               <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                      <Icon icon="lucide:database" className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Database</p>
                      <p className="text-xs text-muted-foreground">Operational</p>
                    </div>
                  </div>
                  <div className="text-emerald-500">
                    <Icon icon="lucide:check-circle-2" className="h-5 w-5" />
                  </div>
               </div>
               <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                      <Icon icon="lucide:globe" className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Landing Page</p>
                      <p className="text-xs text-muted-foreground">99.9% Uptime</p>
                    </div>
                  </div>
                  <div className="text-emerald-500">
                    <Icon icon="lucide:check-circle-2" className="h-5 w-5" />
                  </div>
               </div>
               <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20 transition-colors border border-amber-500/20">
                      <Icon icon="lucide:mail" className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Email Service</p>
                      <p className="text-xs text-amber-500/80">High Latency</p>
                    </div>
                  </div>
                  <div className="text-amber-500">
                    <Icon icon="lucide:alert-circle" className="h-5 w-5" />
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

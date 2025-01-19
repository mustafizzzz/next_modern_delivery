"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  type LucideIcon,
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Partners",
    href: "/partners",
    icon: Users
  },
  {
    title: "Orders",
    href: "/orders",
    icon: Package
  },
  {
    title: "Assignments",
    href: "/assignments",
    icon: ClipboardList
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r min-h-screen">
      <SidebarHeader className="border-b px-6 py-8">
        <Link href="/dashboard" className="flex items-center">
          <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Smart Delivery</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href} className="mb-2">
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className={`w-full px-4 py-3 rounded-lg transition-colors ${pathname === item.href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-gray-900'
                  }`}
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className="mr-4 h-5 w-5" />
                  <span className="text-base font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>


      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <p className="text-xs text-gray-500">© 2024 Smart Delivery Inc.</p>
      </SidebarFooter>
    </Sidebar>
  )
}
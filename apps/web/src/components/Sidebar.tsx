"use client";

import { useState } from "react";
import { LayoutDashboard, Package, Settings, LogOut, CreditCard, PackagePlus, ClipboardList, FileText, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "Produk", href: "/dashboard/products" },
  { icon: CreditCard, label: "Kasir (POS)", href: "/dashboard/pos" },
  { icon: PackagePlus, label: "Restock", href: "/dashboard/restock" },
  { icon: ClipboardList, label: "Riwayat Transaksi", href: "/dashboard/transactions" },
  { icon: FileText, label: "Laporan", href: "/dashboard/reports" },
  { icon: Settings, label: "Pengaturan", href: "/dashboard/settings" },
];

// Desktop Sidebar
export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-sm z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Warungku
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                  : "text-gray-600 hover:bg-violet-50 hover:text-violet-600"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-violet-600")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => logoutAction()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

// Mobile Header with Hamburger Menu
export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm z-40 flex items-center justify-between px-4">
      <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
        Warungku
      </h1>
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
}

// Mobile Sidebar Drawer
export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Warungku
          </h1>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                    : "text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-violet-600")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => {
              onClose();
              logoutAction();
            }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

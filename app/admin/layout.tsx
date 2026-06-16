"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// usePathname gives us the current URL path 

const adminLinks = [
  { name: "DASHBOARD", path: "/admin" },
  { name: "CATEGORIES", path: "/admin/categories" },
  { name: "PRODUCTS", path: "/admin/products" },
  { name: "EVENTS", path: "/admin/events" },
  { name: "ORDERS", path: "/admin/orders" },
];

// Admin Layout component 
// Next.js automatically wraps ALL routes under /admin with this layout.
// `children` is automatically provided by Next.js
// Everything inside /app/admin is a child of admin/layout.tsx.
// In our case: /admin, /admin/events, /admin/products, /admin/categories, /admin/orders are children 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">

      {/* Sidebar navigation */}
      {/* Fixed width so layout is consistent */}
      <aside className="fixed top-16 left-0 h-screen w-48 border-r p-4 overflow-y-auto bg-kilodarkgrey">

        <nav>
          <ul className="text-lg pt-8 space-y-4">

            {/* Loop over adminLinks to generate navigation items */}
            {adminLinks.map((link) => {

              const isActive = pathname === link.path;

              return (             
                <li key={link.path}>
                  <Link 
                    href={link.path}
                    className={`block px-2 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? "bg-white/10 font-semibold text-white"
                        : "text-kilotextlight hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      {/* `{children}` is where the CURRENT admin page is injected */}
      {/* This content changes when the route changes */}
      <main className="ml-48 flex-1 p-10">{children}</main>
    </div>
  );
}

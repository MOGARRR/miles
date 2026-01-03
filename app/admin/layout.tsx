import Link from "next/link";

const adminLinks = [
  { name: "Dashboard", path: "/admin" },
  { name: "Categories", path: "/admin/categories" },
  { name: "Products", path: "/admin/products" },
  { name: "Events", path: "/admin/events" },
  { name: "Orders", path: "/admin/orders" },
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

  return (
    <div className="flex min-h-screen">

      {/* Sidebar navigation */}
      {/* Fixed width so layout is consistent */}
      <aside className="w-48 border-r p-4">

        <nav>
          <ul className="space-y-2">

            {/* Loop over adminLinks to generate navigation items */}
            {adminLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path}
                  className="hover:underline"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      {/* `{children}` is where the CURRENT admin page is injected */}
      {/* This content changes when the route changes */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

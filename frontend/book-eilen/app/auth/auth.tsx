"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/global-components/header";
import Footer from "@/global-components/footer";

interface AuthProps {
  children: React.ReactNode;
}

export default function Auth({ children }: AuthProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Public routes (no login required)
  const publicRoutes = ["/login", "/signup"];

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);

      // Save user session
      fetch("/api/save-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      }).catch((err) => console.error("Error saving session:", err));

      // 🚀 Optional: If logged-in user visits login/signup, redirect to dashboard
      if (publicRoutes.includes(pathname)) {
        router.push("/dashboard");
      }
    } else {
      setIsLoggedIn(false);

      // Redirect to login if not on a public route
    //   if (!publicRoutes.includes(pathname)) {
    //     router.push("/login");
    //   }
    }
  }, [pathname, router]);

  if (isLoggedIn === null) {
    return <p>Loading...</p>;
  }

  const isPublicPage = publicRoutes.includes(pathname);

  return (
    <>
      {isLoggedIn && !isPublicPage && <Header />}
      <main>{children}</main>
      {isLoggedIn && !isPublicPage && <Footer />}
    </>
  );
}

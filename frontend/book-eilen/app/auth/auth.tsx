"use client";

import { useEffect, useState } from "react";
import Header from "@/global-components/header";
import Footer from "@/global-components/footer";

interface AuthProps {
  children: React.ReactNode;
}

export default function Auth({ children }: AuthProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // or however you store login
    if (token) {
      setIsLoggedIn(true);

      // Save user session to DB (API call)
      fetch("/api/save-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      }).catch((err) => console.error("Error saving session:", err));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  if (isLoggedIn === null) {
    return <p>Loading...</p>; // you can replace with spinner
  }

  return (
    <>
      {isLoggedIn && <Header />}
      <main>{children}</main>
      {isLoggedIn && <Footer />}
    </>
  );
}

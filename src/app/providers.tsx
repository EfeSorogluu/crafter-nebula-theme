'use client';

import { AuthProvider } from "@/lib/context/AuthContext";
import { CartProvider } from "@/lib/context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import SmoothScroll from "@/components/smooth-scroll";

export default function Providers({
  children,
  logo,
  websiteId,
}: {
  children: React.ReactNode;
  logo: string;
  websiteId?: string;
}) {
  useEffect(() => {
    // websiteId'yi localStorage'a kaydet
    if (websiteId) {
      localStorage.setItem('websiteId', websiteId);
    }
  }, [websiteId]);

  return (
    <AuthProvider logo={logo}>
      <CartProvider>
        <SmoothScroll />
        {children}
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}

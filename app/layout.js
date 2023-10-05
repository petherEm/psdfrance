import "./globals.css";
import { Inter } from "next/font/google";
import NavBar from "@/components/Navbar";
import GoogleAnalytics from "@/components/GoogleAnalytics";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Analytics testing",
  description: "Analytics testing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <GoogleAnalytics GA_MEASUREMENT_ID="G-J46EGV9SRV" />
      <body className={inter.className}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}

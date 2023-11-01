import "./globals.css";
import { Raleway } from "next/font/google";

import Footer from "./components/footer";
import Header from "./components/header";
import { UserProvider } from "./userContext";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata = {
  title: "E-commerce",
  description: "E-commerce App created by Gamattowicz",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="business">
      <UserProvider>
        <body className={raleway.className}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 grid place-items-center">{children}</main>
            <Footer />
          </div>
        </body>
      </UserProvider>
    </html>
  );
}

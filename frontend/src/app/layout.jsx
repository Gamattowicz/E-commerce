import "./globals.css";
import { Roboto_Slab } from "next/font/google";

import Footer from "./components/footer";
import Header from "./components/header";
import { UserProvider } from "./userContext";

const roboto_slab = Roboto_Slab({
  subsets: ["latin"],
});

export const metadata = {
  title: "E-commerce",
  description: "E-commerce App created by Gamattowicz",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="night">
      <UserProvider>
        <body className={roboto_slab.className}>
          <div className="flex flex-col min-h-screen max-h-full">
            <Header />
            <main className="flex-1 grid place-items-center">{children}</main>
            <Footer />
          </div>
        </body>
      </UserProvider>
    </html>
  );
}

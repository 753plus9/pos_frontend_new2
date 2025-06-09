import "../styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "POSアプリ",
  description: "iPhone 15 向け POS UI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

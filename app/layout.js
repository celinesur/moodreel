import "./globals.css";

export const metadata = {
  title: "MoodReel",
  description: "Discover movies by vibe",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#faf7f4] antialiased">{children}</body>
    </html>
  );
}

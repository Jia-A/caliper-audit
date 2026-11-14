export const metadata = {
  title: "Caliper",
  description: "Measures what your AI interface makes users wait for.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f9f9f7", color: "#0b0b0b" }}>{children}</body>
    </html>
  );
}

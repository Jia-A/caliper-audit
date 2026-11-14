import "./theme.css";
import "./site.css";

export const metadata = {
  title: "Caliper",
  description: "Measures what your AI interface makes users wait for.",
};

// Runs before the first paint, so a saved light theme never flashes dark. Storage can throw
// (private mode, blocked site data): then it stays dark.
const THEME_SCRIPT = `try{if(localStorage.getItem("caliper-theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

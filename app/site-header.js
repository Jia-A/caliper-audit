// The top bar on every page: brand, Demo, Report, GitHub and the theme toggle.
import ThemeToggle from "./theme-toggle.js";

export default function SiteHeader({ current }) {
  const link = (href, label, id) => (
    <a href={href} aria-current={current === id ? "page" : undefined}>{label}</a>
  );
  return (
    <header className="site-top">
      <div className="bar">
        <a className="brand" href="/">Caliper</a>
        <nav>
          {link("/demo", "Demo", "demo")}
          {link("/report", "Report", "report")}
          {link("https://github.com/Jia-A/caliper", "GitHub")}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

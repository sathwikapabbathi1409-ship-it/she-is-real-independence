import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></span>
            <span className="font-display text-xl font-semibold">SHRI</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            She Has Real Independence — a home for India's women entrepreneurs to start, sell and scale.
          </p>
        </div>
        <FooterCol title="Platform" links={[["Marketplace", "/marketplace"], ["Dashboard", "/dashboard"], ["Sign in", "/auth"]]} />
        <FooterCol title="Coming soon" links={[["Mentorship", "/"], ["Funding", "/"], ["Learning", "/"]]} />
        <FooterCol title="Company" links={[["About", "/"], ["Contact", "/"], ["Privacy", "/"]]} />
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SHRI. Made with care for women entrepreneurs across India.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold tracking-wide text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map(([label, to]) => (
          <li key={label}><Link to={to} className="hover:text-foreground">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

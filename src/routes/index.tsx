import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Heart, Compass, GraduationCap, BadgeCheck, Quote } from "lucide-react";
import heroImage from "@/assets/hero-entrepreneurs.jpg";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SHRI — A home for India's women entrepreneurs" },
      { name: "description", content: "Start, sell, and scale your business with SHRI. Marketplace, mentorship, funding and learning — built for women entrepreneurs across India." },
      { property: "og:title", content: "SHRI — A home for India's women entrepreneurs" },
      { property: "og:description", content: "Marketplace, mentorship, funding and learning — built for women entrepreneurs across India." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const stats = [
  { value: "12,400+", label: "Women entrepreneurs" },
  { value: "3,800+", label: "Businesses listed" },
  { value: "₹4.6 Cr", label: "Trade enabled" },
  { value: "28", label: "States & UTs" },
];

const pillars = [
  { icon: Heart, title: "Marketplace", body: "Sell handlooms, jewelry, food, services — your store, your terms." },
  { icon: Compass, title: "Mentorship", body: "Get guidance from women leaders, founders and domain experts." },
  { icon: BadgeCheck, title: "Funding", body: "Discover grants, government schemes, angel investors and loans." },
  { icon: GraduationCap, title: "Learning", body: "Courses on branding, finance, exports and digital growth." },
];

const stories = [
  { name: "Priya, Jaipur", quote: "I went from selling at local fairs to shipping block prints to 9 states in four months.", tag: "Handlooms" },
  { name: "Asha, Coimbatore", quote: "SHRI's mentor matched me with a CA who fixed my GST in a single call.", tag: "Food" },
  { name: "Meera, Guwahati", quote: "The funding portal helped me find a state grant I had no idea existed.", tag: "Crafts" },
];

function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <Pillars />
      <FeaturedStrip />
      <Stories />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="gradient-hero relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 md:grid-cols-2 md:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> She Has Real Independence
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            India's women, <span className="gradient-text">building forward.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            SHRI is the one-stop platform where women entrepreneurs start businesses,
            reach customers, find mentors, unlock funding and learn together.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full px-6 shadow-elegant">
              <Link to="/auth">Start your business <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-6">
              <Link to="/marketplace">Explore marketplace</Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground">
            <BadgeCheck className="h-4 w-4 text-primary" /> Verified businesses
            <span className="h-1 w-1 rounded-full bg-border" />
            Free to join · Pan-India
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-accent/40 via-blush/40 to-primary-glow/30 blur-2xl" />
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-elegant">
            <img
              src={heroImage}
              alt="Indian women entrepreneurs at work — weaver, boutique owner, jeweler"
              width={1600}
              height={1200}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <FloatingCard className="absolute -bottom-6 -left-4 hidden md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Heart className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Today on SHRI</div>
              <div className="font-medium">142 new orders</div>
            </div>
          </FloatingCard>
          <FloatingCard className="absolute -right-3 -top-5 hidden md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <BadgeCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Verified</div>
              <div className="font-medium">3,812 businesses</div>
            </div>
          </FloatingCard>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border border-border bg-background/90 px-4 py-3 shadow-elegant backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="grid gap-6 rounded-3xl border border-border bg-card p-8 shadow-soft md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-3xl font-semibold md:text-4xl">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-2xl">
        <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
          Everything to run a business, in one place.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Skip the patchwork of tools. SHRI brings the entire entrepreneurship
          journey together — beautifully.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map(({ icon: Icon, title, body }) => (
          <div key={title} className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elegant">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedStrip() {
  const tags = ["Handlooms", "Jewelry", "Home decor", "Food & spices", "Beauty", "Services", "Sustainability", "Crafts"];
  return (
    <section className="border-y border-border bg-secondary/40 py-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-6">
        {tags.map((t) => (
          <span key={t} className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground">
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

function Stories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-4xl font-semibold md:text-5xl">Real stories. Real independence.</h2>
        <Link to="/marketplace" className="text-sm font-medium text-primary hover:underline">See all businesses →</Link>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {stories.map((s) => (
          <article key={s.name} className="relative rounded-3xl border border-border bg-card p-7 shadow-soft">
            <Quote className="absolute right-6 top-6 h-6 w-6 text-accent" />
            <p className="font-display text-lg leading-snug">"{s.quote}"</p>
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="font-medium">{s.name}</span>
              <span className="rounded-full bg-blush px-3 py-1 text-xs text-blush-foreground">{s.tag}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="overflow-hidden rounded-3xl border border-border bg-primary p-10 text-primary-foreground shadow-elegant md:p-14">
        <div className="grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
              Your business has a place here.
            </h2>
            <p className="mt-3 max-w-xl text-primary-foreground/80">
              Create your free profile, list your products, and join thousands of women already building on SHRI.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild size="lg" variant="secondary" className="rounded-full px-6">
              <Link to="/auth">Create account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/30 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/marketplace">Browse marketplace</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

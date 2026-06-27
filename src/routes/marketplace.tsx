import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, MapPin, Package } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace · SHRI" },
      { name: "description", content: "Discover products and services from verified women-owned businesses across India." },
      { property: "og:title", content: "Marketplace · SHRI" },
      { property: "og:description", content: "Discover products and services from verified women-owned businesses across India." },
      { property: "og:url", content: "/marketplace" },
    ],
    links: [{ rel: "canonical", href: "/marketplace" }],
  }),
  component: Marketplace,
});

const CATEGORIES = ["All", "Handlooms", "Jewelry", "Home decor", "Food & spices", "Beauty", "Services", "Crafts"];

function Marketplace() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, title, description, category, price_inr, image_url, in_stock, businesses(name, city, state)")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchCat = cat === "All" || p.category === cat;
      const haystack = `${p.title} ${p.description ?? ""} ${(p.businesses as { name?: string } | null)?.name ?? ""}`.toLowerCase();
      const matchQ = q === "" || haystack.includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [products, q, cat]);

  return (
    <div className="min-h-screen">
      <Header />
      <section className="gradient-hero">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h1 className="font-display text-4xl font-semibold md:text-5xl">Marketplace</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Handpicked products from women-led businesses across India. Every purchase helps an entrepreneur grow.
          </p>
          <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-background p-2 shadow-soft md:max-w-xl">
            <Search className="ml-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, categories, businesses…"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  cat === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-secondary" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

type ProductRow = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price_inr: number;
  image_url: string | null;
  in_stock: boolean;
  businesses: { name?: string; city?: string | null; state?: string | null } | null;
};

function ProductCard({ p }: { p: ProductRow }) {
  const biz = p.businesses;
  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-elegant">
      <div className="aspect-[4/3] overflow-hidden bg-secondary">
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Package className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="rounded-full bg-blush px-2.5 py-0.5 text-blush-foreground">{p.category}</span>
          {!p.in_stock && <span className="text-destructive">Out of stock</span>}
        </div>
        <h3 className="mt-2 line-clamp-1 font-display text-lg font-semibold">{p.title}</h3>
        {biz?.name && (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {biz.name}{biz.city ? ` · ${biz.city}` : ""}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="font-display text-lg font-semibold">₹{Number(p.price_inr).toLocaleString("en-IN")}</div>
          <Button size="sm" variant="outline" className="rounded-full">View</Button>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
      <Package className="mx-auto h-10 w-10 text-muted-foreground" />
      <h2 className="mt-4 font-display text-2xl font-semibold">No products yet</h2>
      <p className="mt-2 text-muted-foreground">
        Be the first to list. Create your business and add products from your dashboard.
      </p>
      <Button asChild className="mt-5 rounded-full"><Link to="/dashboard">Go to dashboard</Link></Button>
    </div>
  );
}

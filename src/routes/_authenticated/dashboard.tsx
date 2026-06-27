import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Store, Package, BadgeCheck, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-hooks";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · SHRI" }] }),
  component: Dashboard,
});

const CATEGORIES = ["Handlooms", "Jewelry", "Home decor", "Food & spices", "Beauty", "Services", "Crafts", "Other"];

function Dashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: businesses, isLoading: bizLoading } = useQuery({
    queryKey: ["my-businesses", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: products } = useQuery({
    queryKey: ["my-products", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*, businesses(name)")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product removed");
      qc.invalidateQueries({ queryKey: ["my-products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const stats = [
    { label: "Businesses", value: businesses?.length ?? 0, icon: Store },
    { label: "Products", value: products?.length ?? 0, icon: Package },
    { label: "Verified", value: businesses?.filter((b) => b.verified).length ?? 0, icon: BadgeCheck },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <section className="gradient-hero">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Dashboard</p>
              <h1 className="mt-1 font-display text-4xl font-semibold md:text-5xl">
                Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
              </h1>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Manage your businesses, add products, and grow with SHRI.
              </p>
            </div>
            <NewBusinessDialog />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary"><Icon className="h-5 w-5" /></div>
                <div>
                  <div className="font-display text-2xl font-semibold">{value}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="font-display text-2xl font-semibold">Your businesses</h2>
        {bizLoading ? (
          <div className="mt-4 h-32 animate-pulse rounded-3xl bg-secondary" />
        ) : businesses && businesses.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((b) => (
              <article key={b.id} className="rounded-3xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{b.name}</h3>
                    <p className="text-xs text-muted-foreground">{b.category}{b.city ? ` · ${b.city}` : ""}</p>
                  </div>
                  {b.verified && <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Verified</span>}
                </div>
                {b.tagline && <p className="mt-3 text-sm text-muted-foreground">{b.tagline}</p>}
                <div className="mt-4">
                  <NewProductDialog businessId={b.id} businessName={b.name} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
            <Store className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-3 font-display text-xl font-semibold">Start your first business</h3>
            <p className="mt-1 text-sm text-muted-foreground">It only takes a minute.</p>
            <div className="mt-4 inline-block"><NewBusinessDialog /></div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="font-display text-2xl font-semibold">Your products</h2>
        {products && products.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <article key={p.id} className="overflow-hidden rounded-3xl border border-border bg-card">
                <div className="aspect-[4/3] bg-secondary">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground"><Package className="h-8 w-8" /></div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground">{p.category}</div>
                  <h3 className="mt-1 line-clamp-1 font-medium">{p.title}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="font-display text-lg font-semibold">₹{Number(p.price_inr).toLocaleString("en-IN")}</div>
                    <Button size="icon" variant="ghost" onClick={() => deleteProduct.mutate(p.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No products yet — add one from a business above.</p>
        )}
      </section>

      <Footer />
    </div>
  );
}

function NewBusinessDialog() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("Handlooms");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const create = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("businesses").insert({
        owner_id: user.id, name, tagline, category, city, state,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Business created");
      qc.invalidateQueries({ queryKey: ["my-businesses"] });
      setOpen(false);
      setName(""); setTagline(""); setCity(""); setState("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full"><Plus className="mr-1 h-4 w-4" /> New business</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create a business</DialogTitle></DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); create.mutate(); }}
          className="space-y-3"
        >
          <div><Label>Name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Tagline</Label><Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Short pitch" /></div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
            <div><Label>State</Label><Input value={state} onChange={(e) => setState(e.target.value)} /></div>
          </div>
          <Button type="submit" disabled={create.isPending} className="w-full rounded-full">
            {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NewProductDialog({ businessId, businessName }: { businessId: string; businessName: string }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Handlooms");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const create = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("products").insert({
        owner_id: user.id,
        business_id: businessId,
        title,
        description,
        category,
        price_inr: Number(price),
        image_url: imageUrl || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product added");
      qc.invalidateQueries({ queryKey: ["my-products"] });
      setOpen(false);
      setTitle(""); setDescription(""); setPrice(""); setImageUrl("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full rounded-full"><Plus className="mr-1 h-3.5 w-3.5" /> Add product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add product to {businessName}</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="space-y-3">
          <div><Label>Title</Label><Input required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Price (₹)</Label><Input required type="number" min="0" step="1" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
          </div>
          <div><Label>Image URL (optional)</Label><Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" /></div>
          <Button type="submit" disabled={create.isPending} className="w-full rounded-full">
            {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

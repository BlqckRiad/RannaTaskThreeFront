"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AllRestaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const cached = localStorage.getItem("restaurantsCache");
    if (cached) {
      const parsed = JSON.parse(cached);
      const all = parsed.allRestaurants || Object.values(parsed.restaurantsByCategory || {}).flat();
      setRestaurants(all);
      setCategories(["Hepsi", ...(parsed.categories || [])]);
    }
  }, []);

  const filtered = restaurants.filter(r =>
    (selectedCategory === "Hepsi" || r.categoryName === selectedCategory) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.categoryName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#111', fontSize: '1.6rem', fontWeight: 600 }}>Tüm Restoranlar</h2>
        <input
          type="text"
          placeholder="Ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 8, borderRadius: 7, border: '1px solid #ddd', minWidth: 180 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              background: selectedCategory === cat ? '#009688' : '#fff',
              color: selectedCategory === cat ? '#fff' : '#111',
              border: '1.5px solid #009688',
              borderRadius: 8,
              padding: '8px 22px',
              fontWeight: 600,
              fontSize: '1.08rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '28px',
        justifyContent: 'center',
        minHeight: 420,
      }}>
        {filtered.map(r => (
          <div key={r.id} onClick={() => router.push(`/detail?id=${r.id}`)} style={{
            background: '#fff',
            borderRadius: '18px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            minHeight: 180,
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
          }}>
            <img src={r.imageURL || "/no-image.png"} alt={r.name} style={{width: '100%', height: 140, objectFit: 'cover'}} />
            <span style={{margin: '16px 0 12px 0', fontWeight: 600, fontSize: '1.08rem', color: '#222'}}>{r.name}</span>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div style={{marginTop: 32, color: '#888'}}>Hiç restoran bulunamadı.</div>}
    </div>
  );
} 
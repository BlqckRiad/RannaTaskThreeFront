"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      fetch("https://localhost:7181/api/Restaurant/GetAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Yetkisiz veya sunucu hatası.");
          }
          return await res.json();
        })
        .then((data) => {
          setRestaurants(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Bir hata oluştu.");
          setLoading(false);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleDetail = (id) => {
    router.push(`/admindetail?id=${id}`);
  };

  const handleAdd = () => {
    router.push("/adminadd");
  };

  return (
    <div style={{ minHeight: "60vh", padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h2 style={{ color: '#111' }}>Admin Paneli - Restoranlar</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleAdd} style={{ padding: "8px 20px", background: "#e6b23a", color: "#111", border: "none", borderRadius: 7, fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
            Panele Ekle
          </button>
          <button onClick={handleLogout} style={{ padding: "8px 20px", background: "#009688", color: "#fff", border: "none", borderRadius: 7, fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
            Çıkış Yap
          </button>
        </div>
      </div>
      {loading && <div>Yükleniyor...</div>}
      {error && <div style={{ color: "#d32f2f", marginBottom: 16 }}>{error}</div>}
      {!loading && !error && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {restaurants.length === 0 && <div>Hiç restoran bulunamadı.</div>}
          {restaurants.map((r) => (
            <div key={r.id} style={{ width: 260, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: 16, display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }} onClick={() => handleDetail(r.id)}>
              <img src={r.imageURL || "/no-image.png"} alt={r.name} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginBottom: 12 }} />
              <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 4, color: '#111' }}>{r.name}</div>
              <div style={{ color: "#222", fontSize: "0.98rem" }}>{r.categoryName}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
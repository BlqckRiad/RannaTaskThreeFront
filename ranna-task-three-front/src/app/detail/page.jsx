"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Detail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("ID bulunamadı.");
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetch(`https://localhost:7181/api/Restaurant/GetDetail?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Detay alınamadı.");
        return await res.json();
      })
      .then((data) => {
        setDetail(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Bir hata oluştu.");
        setLoading(false);
      });
  }, [id]);

  return (
    <div style={{ minHeight: "60vh", padding: 24, maxWidth: 700, margin: "0 auto" }}>
      {loading && <div>Yükleniyor...</div>}
      {error && <div style={{ color: "#d32f2f", marginBottom: 16 }}>{error}</div>}
      {detail && (
        <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px rgba(0,0,0,0.09)", padding: 0, overflow: 'hidden' }}>
          <div style={{ width: '100%', height: 320, background: '#eee', position: 'relative' }}>
            <img src={detail.imageURL || "/no-image.png"} alt={detail.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ padding: 32 }}>
            <h2 style={{ fontSize: "2.1rem", fontWeight: 700, marginBottom: 8, color: '#111' }}>{detail.name}</h2>
            <div style={{ color: "#222", fontSize: "1.1rem", marginBottom: 12, fontWeight: 500 }}>{detail.categoryName}</div>
            <div style={{ marginBottom: 16, color: '#111' }}><b>Adres:</b> {detail.address}</div>
            <div style={{ marginBottom: 18, color: '#111' }}><b>Açıklama:</b> {detail.description}</div>
            <div style={{ marginBottom: 18 }}>
              <b style={{ color: '#e6b23a' }}>Beğeni:</b> <span style={{ color: '#e6b23a', fontWeight: 600 }}>{detail.numberOfLikes}</span> |
              <b style={{ color: '#e6b23a', marginLeft: 8 }}>Paylaşım:</b> <span style={{ color: '#e6b23a', fontWeight: 600 }}>{detail.numberOfShares}</span>
            </div>
            <button onClick={() => router.back()} style={{ marginTop: 8, padding: "10px 28px", background: "#009688", color: "#fff", border: "none", borderRadius: 8, fontSize: "1.08rem", fontWeight: 600, cursor: "pointer" }}>
              Geri Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
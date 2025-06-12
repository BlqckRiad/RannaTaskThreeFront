"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const placeholderStyle = { color: '#111', opacity: 1 };

export default function AdminAdd() {
  const [form, setForm] = useState({
    name: "",
    imageURL: "",
    categoryName: "",
    description: "",
    address: "",
    numberOfLikes: 0,
    numberOfShares: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      const res = await fetch("https://localhost:7181/api/Restaurant/Add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          ...form,
          numberOfLikes: Number(form.numberOfLikes),
          numberOfShares: Number(form.numberOfShares),
        }),
      });
      if (!res.ok) throw new Error("Ekleme başarısız.");
      const result = await res.json();
      if (result === true) {
        router.push("/admin");
      } else {
        setError("Ekleme başarısız.");
      }
    } catch (err) {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "60vh", padding: 32, maxWidth: 500, margin: "0 auto" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 style={{ color: "#111", textAlign: "center", marginBottom: 8 }}>Yeni Restoran Ekle</h2>
        <input name="name" placeholder="Restoran Adı" value={form.name} onChange={handleChange} required style={{ padding: 10, borderRadius: 7, border: "1px solid #ddd", ...placeholderStyle }} />
        <input name="imageURL" placeholder="Görsel URL" value={form.imageURL} onChange={handleChange} required style={{ padding: 10, borderRadius: 7, border: "1px solid #ddd", ...placeholderStyle }} />
        <input name="categoryName" placeholder="Kategori" value={form.categoryName} onChange={handleChange} required style={{ padding: 10, borderRadius: 7, border: "1px solid #ddd", ...placeholderStyle }} />
        <input name="address" placeholder="Adres" value={form.address} onChange={handleChange} required style={{ padding: 10, borderRadius: 7, border: "1px solid #ddd", ...placeholderStyle }} />
        <textarea name="description" placeholder="Açıklama" value={form.description} onChange={handleChange} required style={{ padding: 10, borderRadius: 7, border: "1px solid #ddd", minHeight: 60, ...placeholderStyle }} />
        <input name="numberOfLikes" type="number" placeholder="Beğeni Sayısı" value={form.numberOfLikes} onChange={handleChange} min={0} style={{ padding: 10, borderRadius: 7, border: "1px solid #ddd", ...placeholderStyle }} />
        <input name="numberOfShares" type="number" placeholder="Paylaşım Sayısı" value={form.numberOfShares} onChange={handleChange} min={0} style={{ padding: 10, borderRadius: 7, border: "1px solid #ddd", ...placeholderStyle }} />
        {error && <div style={{ color: "#d32f2f", background: "#ffeaea", borderRadius: 6, padding: "7px 10px", fontSize: "0.98rem", textAlign: "center" }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ padding: "10px 0", background: "#009688", color: "#fff", border: "none", borderRadius: 7, fontSize: "1.1rem", fontWeight: 600, cursor: "pointer", marginTop: 8 }}>
          {loading ? "Ekleniyor..." : "Ekle"}
        </button>
      </form>
    </div>
  );
} 
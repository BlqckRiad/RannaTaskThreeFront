"use client";
import Image from "next/image";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import MembershipCategories from "./components/MembershipCategories";
import MembershipShowcase from "./components/MembershipShowcase";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const filterIcon = (
  <svg width="24" height="24" fill="none" stroke="#009688" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
);

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [restaurantsByCategory, setRestaurantsByCategory] = useState({});
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const router = useRouter();

  // Token alma işlemi
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        fetch("https://localhost:7181/api/Authentication", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "admin", password: "admin" }),
        })
          .then((res) => res.text())
          .then((token) => {
            if (token && token.length > 0) {
              localStorage.setItem("token", token);
              window.location.reload();
            }
          });
      }
    }
  }, []);

  // Restoranları çek ve kategorilere ayır
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) return;
    // Cache kontrolü
    const cached = localStorage.getItem("restaurantsCache");
    if (cached) {
      const parsed = JSON.parse(cached);
      setRestaurantsByCategory(parsed.restaurantsByCategory);
      // Eğer allRestaurants yoksa, tüm restoranları kategorilerden topla
      if (parsed.allRestaurants && parsed.allRestaurants.length > 0) {
        setAllRestaurants(parsed.allRestaurants);
      } else {
        // Kategorilerdeki tüm restoranları birleştir
        const all = Object.values(parsed.restaurantsByCategory || {}).flat();
        setAllRestaurants(all);
      }
      setCategories(["Hepsi", ...(parsed.categories || [])]);
      setSelectedCategory("Hepsi");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("https://localhost:7181/api/Restaurant/GetAll", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Restoranlar alınamadı.");
        return await res.json();
      })
      .then((data) => {
        // Kategorilere göre grupla
        const byCat = {};
        data.forEach((r) => {
          if (!byCat[r.categoryName]) byCat[r.categoryName] = [];
          byCat[r.categoryName].push(r);
        });
        const cats = Object.keys(byCat);
        setRestaurantsByCategory(byCat);
        setAllRestaurants(data);
        setCategories(["Hepsi", ...cats]);
        setSelectedCategory("Hepsi");
        // Cachele
        localStorage.setItem(
          "restaurantsCache",
          JSON.stringify({ restaurantsByCategory: byCat, categories: cats, allRestaurants: data })
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Seçili kategorideki ilk 6 restoran
  const visibleRestaurants = selectedCategory === "Hepsi"
    ? allRestaurants.slice(0, 6)
    : (restaurantsByCategory[selectedCategory] || []).slice(0, 6);

  return (
    <>
      <Header />
      <HeroSection />
      <MembershipCategories />
    
      <main>
        {/* Dining Alanı */}
        <section style={{padding: '32px 0 0 0', maxWidth: 900, margin: '0 auto', position: 'relative'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18}}>
            <h2 style={{color: '#111', fontSize: '1.6rem', fontWeight: 600}}>{selectedCategory || "Dining"}</h2>
            <button onClick={() => setShowFilter(true)} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}} title="Filtrele">
              {filterIcon}
            </button>
          </div>
          {/* Filtre popup */}
          {showFilter && (
            <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => setShowFilter(false)}>
              <div style={{background: '#fff', borderRadius: 14, padding: 28, minWidth: 260, boxShadow: '0 2px 16px rgba(0,0,0,0.13)'}} onClick={e => e.stopPropagation()}>
                <h3 style={{marginBottom: 16, color: '#111'}}>Kategori Seç</h3>
                {categories.map((cat) => (
                  <div key={cat} style={{marginBottom: 10}}>
                    <button
                      onClick={() => { setSelectedCategory(cat); setShowFilter(false); }}
                      style={{
                        background: selectedCategory === cat ? '#009688' : '#f7f7f7',
                        color: selectedCategory === cat ? '#fff' : '#111',
                        border: '1.5px solid #009688',
                        borderRadius: 8,
                        padding: '8px 22px',
                        fontWeight: 600,
                        fontSize: '1.08rem',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'all 0.2s',
                      }}
                    >
                      {cat}
                    </button>
                  </div>
                ))}
                <button onClick={() => setShowFilter(false)} style={{marginTop: 10, background: '#eee', color: '#111', border: 'none', borderRadius: 7, padding: '8px 0', width: '100%', fontWeight: 500, cursor: 'pointer'}}>Kapat</button>
              </div>
            </div>
          )}
          {/* Grid */}
          {loading ? (
            <div>Yükleniyor...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '28px',
              justifyContent: 'center',
              minHeight: 420,
            }}>
              {visibleRestaurants.map((r) => (
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
          )}
          {/* See All butonu */}
          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 18}}>
            <button onClick={() => router.push('/allrestaurant')} style={{background: 'none', border: 'none', color: '#222', fontWeight: 500, fontSize: '1.08rem', cursor: 'pointer', textDecoration: 'underline'}}>See All</button>
          </div>
        </section>
        <MembershipShowcase />
        {/* Nasıl Çalışır? */}
        <br></br>
        <section style={{background: 'blue url(https://www.transparenttextures.com/patterns/geometry2.png)', backgroundSize: '340px', padding: '48px 0', borderRadius: '0', margin: '0 0 0 0', textAlign: 'left', display: 'flex', justifyContent: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', maxWidth: 1100, width: '100%', gap: 48, padding: '0 32px'}}>
            <div style={{flex: 1.2, color: '#fff'}}>
              <h2 style={{fontSize: '1.7rem', fontWeight: 'bold', marginBottom: 12}}>How Does it Work?</h2>
              <p style={{fontSize: '1.08rem', color: '#e0f7fa', marginBottom: 0}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
            </div>
            <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
              <div style={{width: 360, maxWidth: '100%', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', overflow: 'hidden', position: 'relative'}}>
                <img src="https://img.icons8.com/ios-filled/500/cccccc/play--v1.png" alt="Video" style={{width: '100%', height: 200, objectFit: 'cover', background: '#bbb'}} />
                <div style={{position: 'absolute', bottom: 0, left: 0, width: '100%', height: 36, background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', padding: '0 12px', color: '#222', fontSize: 13}}>
                  <span style={{marginRight: 8}}>00:07 / 25:04</span>
                  <div style={{flex: 1, height: 4, background: '#e0e0e0', borderRadius: 2, margin: '0 8px'}}>
                    <div style={{width: '20%', height: '100%', background: '#009688', borderRadius: 2}}></div>
                  </div>
                  <span style={{marginLeft: 8}}><img src="https://img.icons8.com/ios-glyphs/30/cccccc/volume.png" alt="Volume" style={{width: 18, verticalAlign: 'middle'}} /></span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Mobil App Tanıtımı */}
        <section style={{padding: '48px 0', background: '#fff', textAlign: 'left', display: 'flex', justifyContent: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', maxWidth: 1100, width: '100%', gap: 48, padding: '0 32px'}}>
            <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
              <img src="https://mockuphone.com/static/images/devices/iphone13mini--blue.png" alt="App Mockup" style={{width: 160, height: 320, objectFit: 'contain', background: '#eee', borderRadius: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.10)'}} />
            </div>
            <div style={{flex: 1.2}}>
              <h2 style={{fontSize: '1.4rem', fontWeight: 'bold', marginBottom: 12}}>Explore Türkiye Mobil Uygulaması</h2>
              <p style={{fontSize: '1.08rem', color: '#222', marginBottom: 18}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
              <div style={{display: 'flex', gap: 16, marginTop: 8}}>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{height: 44}} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" style={{height: 44}} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

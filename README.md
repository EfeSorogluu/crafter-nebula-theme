<div align="center">

# 🌌 Crafter Nebula Theme

**Minecraft sunucuları için modern, güçlü ve özelleştirilebilir web teması.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)

</div>

---

## ✨ Özellikler

| Özellik | Açıklama |
|---|---|
| 🏪 **Mağaza** | Kategori bazlı ürün listeleme, ürün karşılaştırma tablosu, sepet, kupon & toplu indirim |
| 🗳️ **Oy Sistemi** | Birden fazla vote provider desteği ile oy verme ve ödül kazanma |
| 💰 **Cüzdan** | Kredi yükleme, çoklu ödeme sağlayıcı (PayTR, Shopier, Papara, İyzico) |
| 🎁 **Hediye & Sandık** | Hediye gönderme ve sandık açma sistemi |
| 📰 **Haberler** | Lexical editör ile zengin içerikli haber/duyuru yönetimi |
| 🎫 **Destek** | Kategori bazlı ticket destek sistemi |
| 📋 **Staff Başvuru** | Özelleştirilebilir personel başvuru formları |
| ❓ **Yardım Merkezi** | SSS ve yardım dokümanları |
| ⚖️ **Yasal Sayfalar** | Kurallar, gizlilik politikası, kullanım şartları |
| 🔍 **Ceza Sorgulama** | Oyuncu ceza geçmişi sorgulama |
| 🎟️ **Kod Kullanma** | Redeem code sistemi |
| 👤 **Profil** | Kullanıcı profili ve ayarlar |

## 🛠️ Teknolojiler

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **UI:** [Tailwind CSS 4](https://tailwindcss.com), [Radix UI](https://radix-ui.com), [shadcn/ui](https://ui.shadcn.com)
- **Animasyon:** [Motion](https://motion.dev), [Lenis](https://lenis.darkroom.engineering) (smooth scroll)
- **Editör:** [Lexical](https://lexical.dev) (zengin metin editörü)
- **İkonlar:** [Lucide](https://lucide.dev), [React Icons](https://react-icons.github.io/react-icons)
- **Form:** [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- **Tema:** Dark / Light mod desteği ([next-themes](https://github.com/pacocoursey/next-themes))
- **PWA:** Service Worker, manifest.json, kurulum butonu

## 🚀 Kurulum

### Gereksinimler

- [Node.js](https://nodejs.org) 18+
- [npm](https://npmjs.com), [yarn](https://yarnpkg.com) veya [pnpm](https://pnpm.io)

### Adımlar

```bash
# 1. Repoyu klonlayın
git clone https://github.com/Rynix01/crafter-nebula-theme.git
cd crafter-nebula-theme

# 2. Bağımlılıkları yükleyin
npm install

# 3. Ortam değişkenlerini ayarlayın
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.crafter.net.tr
NEXT_PUBLIC_WEBSITE_ID=your-website-id
```

```bash
# 4. Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📜 Scriptler

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu (Turbopack) |
| `npm run build` | Production build (Webpack) |
| `npm run start` | Production sunucusu |
| `npm run lint` | ESLint kod kontrolü |

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── (main)/              # Ana sayfa rotaları
│   │   ├── home/            # Anasayfa
│   │   ├── store/           # Mağaza
│   │   ├── vote/            # Oy verme
│   │   ├── wallet/          # Cüzdan
│   │   ├── profile/         # Profil
│   │   ├── support/         # Destek
│   │   ├── chest/           # Sandık
│   │   ├── gifts/           # Hediyeler
│   │   ├── posts/           # Haberler
│   │   └── ...
│   ├── auth/                # Giriş / Kayıt
│   └── api/                 # API rotaları
├── components/
│   ├── layouts/             # Navbar, Footer, Hero
│   ├── ui/                  # shadcn/ui bileşenleri
│   ├── home/                # Anasayfa bileşenleri
│   ├── editor/              # Lexical editör
│   └── ...
└── lib/
    ├── api/services/        # API servisleri
    ├── context/             # Auth, Cart context
    ├── types/               # TypeScript tipleri
    ├── helpers/             # Yardımcı fonksiyonlar
    └── constants/           # Sabitler
```

## 🌐 Entegrasyonlar

- **Discord** — Sunucu widget'ı, çevrimiçi üye sayısı, webhook desteği
- **Tawk.to** — Canlı destek chat widget'ı
- **Minecraft** — Gerçek zamanlı sunucu durumu ve oyuncu sayısı
- **Cloudflare Turnstile** — Bot koruması

## 📄 Lisans

Bu proje [Crafter](https://crafter.net.tr) altyapısı için geliştirilmiştir.

# 📊 Efloud Trade Analyzer

Yapay zekâ (Google Gemini Vision API) destekli otomatik grafik ve trade analiz platformu. 

@Efloud ve lider analistlerin Twitter/X üzerinde paylaştığı teknik grafik görsellerini, destek/direnç bölgelerini, trend yapılarını ve yazılı yorumlarını inceleyerek; otomatik olarak yön eğilimi (bias), kritik fiyat seviyeleri, alım/satım sinyalleri ve yeni başlayanlar için sade eğitmen açıklamaları üretir.

---

## ✨ Özellikler

- 🤖 **Gemini 2.5 Flash Vision Entegrasyonu:** Grafik görsellerindeki fiyat seviyelerini, formasyonları ve yazılı notları okur.
- 👨‍🏫 **İki Aşamalı AI Analizi:** 
  1. *Trader Rolü:* Teknik verileri, destek/direnç seviyelerini ve risk/ödül oranlı Long/Short sinyallerini çıkarır.
  2. *Öğretmen Rolü:* Teknik analizi herkesin anlayabileceği sade ve samimi bir dille açıklar.
- 🌐 **Çoklu Enstrüman Desteği:** EURUSD, DXY, GBPUSD, XAUUSD, BTCUSD, ETHUSD, US30 ve daha fazlası.
- 👨‍💻 **Çoklu Trader Desteği:** @Efloud ile başlar, admin panelinden yeni trader'lar eklenebilir.
- ⚡ **Tamamen Ücretsiz Altyapı:** Next.js App Router + Vercel Hobby + Gemini Free Tier.
- 💎 **Premium Dark Theme UI:** Glassmorphism tasarım, canlı sinyal göstergeleri ve interaktif grafik görüntüleyici.

---

## 🛠️ Yerel Geliştirme (Local Setup)

1. Depoyu klonlayın veya indirin:
   ```bash
   cd efloud-trade-analyzer
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. `.env.example` dosyasından `.env.local` oluşturun ve Google AI Studio'dan aldığınız **ücretsiz** Gemini API Key'i ekleyin:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ADMIN_PASSWORD=your_secure_password
   ```

4. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
   Tarayıcınızda `http://localhost:3000` adresini açın.

---

## 🚀 Vercel'e Deploy Etme

1. Kodlarınızı GitHub reponuza push edin:
   ```bash
   git add .
   git commit -m "feat: complete trade analyzer platform"
   git push origin main
   ```

2. [Vercel Dashboard](https://vercel.com) üzerinden **Import Project** seçeneği ile GitHub reponuzu bağlayın.

3. Vercel **Environment Variables** bölümüne `GEMINI_API_KEY` ve `ADMIN_PASSWORD` değerlerinizi ekleyin.

4. **Deploy** butonuna tıklayın! 🚀

---

## ⚠️ Yasal Uyarı

Bu platformda sunulan analizler ve AI çıktıları yalnızca bilgilendirme ve eğitim amaçlıdır. Kesinlikle yatırım tavsiyesi değildir.

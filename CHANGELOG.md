# Changelog

Tüm önemli değişiklikler ve güncellemeler bu dosyada belgelenecektir.

## [1.0.0] - 2026-07-30

### Eklendi
- 🚀 Next.js App Router & TypeScript tabanlı tam web uygulaması kuruldu.
- 🤖 `@google/genai` SDK kullanılarak 2 aşamalı Gemini Vision AI analiz boru hattı kuruldu.
- 🎨 Vanilla CSS ile premium dark-theme glassmorphism tasarım sistemi ve responsive layout geliştirildi.
- 📊 Grafik görüntüleyici (`ChartViewer`), destek/direnç tablosu (`KeyLevels`), yön göstergeleri (`BiasIndicator`) ve trade stratejisi kartları (`TradingSignals`) oluşturuldu.
- ⚙️ Manuel tweet ve grafik URL'si eklemek için Admin Panel (`AdminForm`) ve korumalı API endpoint (`/api/tweets/submit`) eklendi.
- 💾 Veri kalıcılığı için serverless uyumlu JSON storage katmanı (`storage.ts`) geliştirildi.
- 🌐 DXY, EURUSD, GBPUSD, XAUUSD, BTCUSD dahil tüm finansal enstrümanlar için filtreleme yapısı tamamlandı.
- 📝 İlk örnek veri olarak @Efloud'un DXY & EURUSD Fed analizi yüklendi.

import { AdminForm } from '@/components/AdminForm';

export default function AdminPage() {
  return (
    <div className="app-container" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
          ⚙️ Admin Paneli — Tweet Analiz Oluşturucu
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.375rem' }}>
          Trader'ın paylaştığı grafik görsellerini ve tweet açıklamasını buraya ekleyin. Gemini Vision AI görselleri inceleyip otomatik analiz üretecektir.
        </p>
      </div>

      <AdminForm />
    </div>
  );
}

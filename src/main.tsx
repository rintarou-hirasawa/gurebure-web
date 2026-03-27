import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

function showMissingEnvMessage() {
  const el = document.getElementById('root');
  if (!el) return;
  el.innerHTML = `
    <div style="box-sizing:border-box;min-height:100vh;margin:0;padding:2rem;font-family:'Noto Sans JP',system-ui,sans-serif;line-height:1.6;color:#1e293b;background:#f8fafc;">
      <h1 style="font-size:1.25rem;margin:0 0 1rem">Supabase の設定がビルドに含まれていません</h1>
      <p style="margin:0 0 0.75rem">Netlify の <strong>Environment variables</strong> に次の 2 つを追加し、<strong>再デプロイ</strong>（Trigger deploy）してください。</p>
      <ul style="margin:0 0 1rem;padding-left:1.25rem">
        <li><code style="background:#e2e8f0;padding:0.15rem 0.4rem;border-radius:4px">VITE_SUPABASE_URL</code>（Supabase の Project URL）</li>
        <li><code style="background:#e2e8f0;padding:0.15rem 0.4rem;border-radius:4px">VITE_SUPABASE_ANON_KEY</code>（anon public キー）</li>
      </ul>
      <p style="margin:0;font-size:0.875rem;color:#64748b">変数を追加した<strong>あと</strong>にデプロイし直さないと、本番サイトに反映されません。</p>
    </div>
  `;
}

if (!url || !key) {
  showMissingEnvMessage();
} else {
  void import('./App').then(({ default: App }) => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FtpServer {
  id: string;
  name: string;
  category: string;
  logo_url: string | null;
  link: string;
  sort_order: number;
}

interface PageSettings {
  notice_text: string;
  helpline: string;
}

const categoryLabels: Record<string, string> = {
  ftp: "📁 FTP / Movie Servers",
  ott: "🎬 OTT Servers",
  livetv: "📺 Live TV Servers",
};

export default function FtpServers() {
  const [servers, setServers] = useState<FtpServer[]>([]);
  const [settings, setSettings] = useState<PageSettings>({ notice_text: "", helpline: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: srv }, { data: stg }] = await Promise.all([
        supabase.from("ftp_servers").select("*").eq("visible", true).order("sort_order"),
        supabase.from("ftp_page_settings").select("*"),
      ]);
      setServers((srv as FtpServer[]) ?? []);
      const map: Record<string, string> = {};
      (stg ?? []).forEach((s: any) => { map[s.key] = s.value ?? ""; });
      setSettings({ notice_text: map.notice_text ?? "", helpline: map.helpline ?? "" });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f0f4f8", fontFamily: "Arial, sans-serif" }}>
        <p style={{ fontSize: "18px", color: "#555" }}>Loading...</p>
      </div>
    );
  }

  const categories = ["ftp", "ott", "livetv"];
  const grouped = categories.map(cat => ({
    cat,
    label: categoryLabels[cat],
    items: servers.filter(s => s.category === cat),
  })).filter(g => g.items.length > 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "Arial, Helvetica, sans-serif", margin: 0, padding: 0 }}>
      {/* Notice Banner */}
      {settings.notice_text && (
        <div style={{ background: "#1e3a5f", color: "#fff", textAlign: "center", padding: "12px 16px", fontSize: "15px", letterSpacing: "0.3px" }}>
          {settings.notice_text}
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: "center", padding: "30px 16px 10px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#1e3a5f", margin: "0 0 6px" }}>
          Galaxy Net Server Links
        </h1>
        <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
          শুধুমাত্র Galaxy Net ব্যবহারকারীদের জন্য
        </p>
      </div>

      {/* Server Categories */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px 40px" }}>
        {grouped.map(group => (
          <div key={group.cat} style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1e3a5f", marginBottom: "16px", borderBottom: "2px solid #cbd5e1", paddingBottom: "8px" }}>
              {group.label}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "14px" }}>
              {group.items.map(server => (
                <a
                  key={server.id}
                  href={server.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "16px 10px",
                    textAlign: "center",
                    textDecoration: "none",
                    color: "#333",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {server.logo_url ? (
                    <img
                      src={server.logo_url}
                      alt={server.name}
                      style={{ width: "56px", height: "56px", objectFit: "contain", margin: "0 auto 10px", display: "block", borderRadius: "8px" }}
                    />
                  ) : (
                    <div style={{ width: "56px", height: "56px", margin: "0 auto 10px", background: "#e2e8f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: "#94a3b8" }}>
                      📁
                    </div>
                  )}
                  <p style={{ fontSize: "13px", fontWeight: "600", margin: 0, lineHeight: "1.3", wordBreak: "break-word" }}>
                    {server.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ))}

        {grouped.length === 0 && (
          <p style={{ textAlign: "center", color: "#888", fontSize: "16px", padding: "40px 0" }}>
            কোনো সার্ভার যোগ করা হয়নি
          </p>
        )}
      </div>

      {/* Footer / Helpline */}
      {settings.helpline && (
        <div style={{ background: "#1e3a5f", color: "#fff", textAlign: "center", padding: "16px", fontSize: "15px" }}>
          📞 Helpline: <strong>{settings.helpline}</strong>
        </div>
      )}
    </div>
  );
}

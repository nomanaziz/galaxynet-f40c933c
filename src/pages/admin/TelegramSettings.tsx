import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Send, Users, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Recipient = { label: string; chat_id: string; type: "personal" | "group" };

const TelegramSettings = () => {
  const [enabled, setEnabled] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [form, setForm] = useState<Recipient>({ label: "", chat_id: "", type: "personal" });
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", ["telegram_enabled", "telegram_chat_ids"]);
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => { map[r.key] = r.value ?? ""; });
      setEnabled(map.telegram_enabled === "true");
      try {
        const arr = JSON.parse(map.telegram_chat_ids || "[]");
        if (Array.isArray(arr)) setRecipients(arr);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  const persist = async (next: { enabled?: boolean; recipients?: Recipient[] }) => {
    setSaving(true);
    const en = next.enabled ?? enabled;
    const list = next.recipients ?? recipients;
    await supabase.from("site_settings").upsert(
      [
        { key: "telegram_enabled", value: en ? "true" : "false" },
        { key: "telegram_chat_ids", value: JSON.stringify(list) },
      ],
      { onConflict: "key" }
    );
    setSaving(false);
  };

  const toggleEnabled = async (v: boolean) => {
    setEnabled(v);
    await persist({ enabled: v });
    toast({ title: v ? "Telegram চালু হলো" : "Telegram বন্ধ হলো" });
  };

  const addRecipient = async () => {
    if (!form.label.trim() || !form.chat_id.trim()) {
      toast({ title: "Label এবং Chat ID দিন", variant: "destructive" });
      return;
    }
    const next = [...recipients, { ...form, label: form.label.trim(), chat_id: form.chat_id.trim() }];
    setRecipients(next);
    setForm({ label: "", chat_id: "", type: "personal" });
    await persist({ recipients: next });
    toast({ title: "Recipient যোগ হয়েছে" });
  };

  const removeRecipient = async (chat_id: string) => {
    const next = recipients.filter(r => r.chat_id !== chat_id);
    setRecipients(next);
    await persist({ recipients: next });
    toast({ title: "Recipient মুছে ফেলা হয়েছে" });
  };

  const sendTest = async (r: Recipient) => {
    setTestingId(r.chat_id);
    try {
      const { data, error } = await supabase.functions.invoke("notify-order-telegram", {
        body: { test: true, chatId: r.chat_id, label: r.label },
      });
      if (error) throw error;
      const result = (data as any)?.results?.[0];
      if (result && result.status >= 200 && result.status < 300) {
        toast({ title: "✅ Test message পাঠানো হয়েছে", description: `${r.label} (${r.chat_id})` });
      } else {
        toast({
          title: "❌ পাঠাতে পারিনি",
          description: result?.error || "Bot কে chat-এ add/start করেছেন তো?",
          variant: "destructive",
        });
      }
    } catch (e: any) {
      toast({ title: "Test failed", description: e.message ?? String(e), variant: "destructive" });
    } finally {
      setTestingId(null);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">Telegram Notifications</h2>
        <p className="text-sm text-muted-foreground mt-1">
          নতুন connection order এলে এখানে যোগ করা সব Telegram chat-এ notification যাবে।
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle>Master Switch</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="font-medium">Telegram notifications</p>
            <p className="text-sm text-muted-foreground">বন্ধ থাকলে কোনো message যাবে না</p>
          </div>
          <Switch checked={enabled} onCheckedChange={toggleEnabled} disabled={saving} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>নতুন Recipient যোগ করুন</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Label</Label>
              <Input
                placeholder="যেমন: Admin, Sales Group"
                value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Chat ID</Label>
              <Input
                placeholder="123456789 বা -1001234567890"
                value={form.chat_id}
                onChange={e => setForm(f => ({ ...f, chat_id: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v: "personal" | "group") => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="group">Group / Channel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addRecipient} disabled={saving}>
            <Plus className="mr-2 h-4 w-4" /> Add Recipient
          </Button>

          <div className="rounded-md bg-muted/50 p-3 text-xs space-y-1.5">
            <p className="font-semibold">Chat ID কোথা থেকে পাবেন?</p>
            <p>• <b>Personal</b>: Telegram-এ আমাদের bot-এ গিয়ে আগে <code>/start</code> চাপুন। তারপর <code>@userinfobot</code>-এ গিয়ে আপনার numeric ID নিন।</p>
            <p>• <b>Group / Channel</b>: প্রথমে আমাদের bot-কে group-এ <b>member</b> হিসেবে add করুন (channel হলে admin)। তারপর group-এ <code>@RawDataBot</code> add করে chat ID নিন (নেগেটিভ সংখ্যা, যেমন <code>-1001234567890</code>)।</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recipients ({recipients.length})</CardTitle></CardHeader>
        <CardContent>
          {recipients.length === 0 ? (
            <p className="text-sm text-muted-foreground">কোনো recipient নেই। উপরে থেকে যোগ করুন।</p>
          ) : (
            <div className="space-y-2">
              {recipients.map(r => (
                <div key={r.chat_id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {r.type === "group" ? <Users className="h-4 w-4 text-muted-foreground shrink-0" /> : <User className="h-4 w-4 text-muted-foreground shrink-0" />}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{r.label}</p>
                        <Badge variant="secondary" className="text-xs">{r.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono truncate">{r.chat_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => sendTest(r)} disabled={testingId === r.chat_id}>
                      {testingId === r.chat_id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                      <span className="ml-1">Test</span>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => removeRecipient(r.chat_id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramSettings;

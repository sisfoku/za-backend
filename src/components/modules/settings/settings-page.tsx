"use client";

import * as React from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User as UserIcon, Camera, KeyRound, Bot, Mail, Bell, BellRing,
  Volume2, Globe, ShieldCheck, Lock, Check, X, Plug, QrCode,
  Power, Wifi, Smartphone, AlertCircle, Save, Moon, MessageCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth-store";
import { useAppStore } from "@/lib/app-store";
import { WA_SESSIONS } from "@/lib/mock-data";
import {
  ROLES, ROLE_LABELS, ROLE_THEME, MENU_ITEMS, menuForRole,
} from "@/lib/rbac";
import { cn } from "@/lib/utils";
import type { Role, WhatsAppSession } from "@/lib/types";

export function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          Pengaturan
        </h2>
        <p className="text-sm text-muted-foreground">
          Kelola profil, integrasi WhatsApp (Waha), hak akses (RBAC), dan preferensi aplikasi.
        </p>
      </div>

      <Tabs defaultValue="profil" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="profil" className="text-xs sm:text-sm">
            <UserIcon className="h-4 w-4 mr-1.5" /> Profil
          </TabsTrigger>
          <TabsTrigger value="waha" className="text-xs sm:text-sm">
            <MessageCircle className="h-4 w-4 mr-1.5" /> WhatsApp
          </TabsTrigger>
          <TabsTrigger value="rbac" className="text-xs sm:text-sm">
            <Lock className="h-4 w-4 mr-1.5" /> RBAC
          </TabsTrigger>
          <TabsTrigger value="pref" className="text-xs sm:text-sm">
            <Globe className="h-4 w-4 mr-1.5" /> Preferensi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="space-y-4">
          <ProfilTab />
        </TabsContent>
        <TabsContent value="waha" className="space-y-4">
          <WahaTab />
        </TabsContent>
        <TabsContent value="rbac" className="space-y-4">
          <RbacTab role={user?.role ?? "operator"} />
        </TabsContent>
        <TabsContent value="pref" className="space-y-4">
          <PreferensiTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============ Tab: Profil ============

function ProfilTab() {
  const { toast } = useToast();
  const { user } = useAuthStore();

  const [form, setForm] = React.useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [pwd, setPwd] = React.useState({ current: "", next: "", confirm: "" });

  const role = user?.role ?? "operator";
  const theme = ROLE_THEME[role];

  function handleSaveProfile() {
    if (!form.name.trim() || !form.email.trim()) {
      toast({ title: "Validasi gagal", description: "Nama dan email wajib diisi.", variant: "destructive" });
      return;
    }
    toast({
      title: "Profil disimpan",
      description: "Perubahan profil Anda berhasil disimpan.",
    });
  }

  function handleChangePassword() {
    if (!pwd.current || !pwd.next || !pwd.confirm) {
      toast({ title: "Validasi gagal", description: "Lengkapi seluruh kolom password.", variant: "destructive" });
      return;
    }
    if (pwd.next.length < 6) {
      toast({ title: "Password terlalu pendek", description: "Minimal 6 karakter.", variant: "destructive" });
      return;
    }
    if (pwd.next !== pwd.confirm) {
      toast({ title: "Konfirmasi tidak cocok", description: "Password baru & konfirmasi tidak sama.", variant: "destructive" });
      return;
    }
    toast({ title: "Password diperbarui", description: "Password Anda berhasil diubah." });
    setPwd({ current: "", next: "", confirm: "" });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Identity card */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Identitas</CardTitle>
          <CardDescription>Foto & role Anda</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center gap-3">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarFallback className={cn("text-2xl font-semibold", theme.bg, theme.color)}>
                {form.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-emerald-600 text-white grid place-items-center ring-2 ring-background hover:bg-emerald-700"
              onClick={() => toast({ title: "Unggah foto", description: "Fitur unggah foto segera hadir." })}
              aria-label="Ganti foto"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ title: "Ganti foto", description: "Fitur unggah foto segera hadir." })}
          >
            <Camera className="h-4 w-4" /> Ganti Foto
          </Button>
          <div className="w-full pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Role</span>
              <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1", theme.bg, theme.color, theme.ring)}>
                {ROLE_LABELS[role]}
              </span>
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" /> Aktif
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile form */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Data Profil</CardTitle>
          <CardDescription>Perbarui informasi pribadi Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Nama Lengkap</Label>
              <Input id="p-name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-email">Email</Label>
              <Input id="p-email" type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-phone">Telepon</Label>
              <Input id="p-phone" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} placeholder="0812-xxxx-xxxx" />
            </div>
            <div className="space-y-1.5">
              <Label>Role (read-only)</Label>
              <Input
                value={ROLE_LABELS[role]}
                disabled
                className="bg-muted/40"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveProfile}>
              <Save className="h-4 w-4" /> Simpan Profil
            </Button>
          </div>

          <Separator />

          {/* Password change */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-emerald-600" />
              <h4 className="text-sm font-semibold">Ubah Password</h4>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="pwd-curr">Password Saat Ini</Label>
                <Input id="pwd-curr" type="password" value={pwd.current} onChange={(e) => setPwd((s) => ({ ...s, current: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pwd-new">Password Baru</Label>
                <Input id="pwd-new" type="password" value={pwd.next} onChange={(e) => setPwd((s) => ({ ...s, next: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pwd-conf">Konfirmasi</Label>
                <Input id="pwd-conf" type="password" value={pwd.confirm} onChange={(e) => setPwd((s) => ({ ...s, confirm: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleChangePassword}>
                <KeyRound className="h-4 w-4" /> Perbarui Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ Tab: Integrasi WhatsApp (Waha) ============

function WahaTab() {
  const { toast } = useToast();
  const [config, setConfig] = React.useState({
    apiUrl: "http://waha.local:3000",
    apiKey: "waha-prod-key-2025",
    defaultSession: "agent-sales-1",
  });
  const [testing, setTesting] = React.useState(false);

  function handleTestConnection() {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      toast({
        title: "Tersambung",
        description: `Berhasil terhubung ke Waha API di ${config.apiUrl}.`,
      });
    }, 900);
  }

  function handleSaveConfig() {
    toast({ title: "Konfigurasi disimpan", description: "Pengaturan Waha berhasil diperbarui." });
  }

  function handleScanQR(s: WhatsAppSession) {
    toast({
      title: "QR Code dibuat",
      description: `Scan QR untuk sesi "${s.name}" (muncul di perangkat).`,
    });
  }

  function handleToggleSession(s: WhatsAppSession) {
    const willConnect = s.status !== "connected";
    toast({
      title: willConnect ? "Menyambungkan sesi…" : "Memutuskan sesi…",
      description: `${s.name} ${willConnect ? "sedang disambungkan" : "telah diputus"}.`,
      variant: willConnect ? "default" : "destructive",
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Connection config */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 grid place-items-center">
              <Plug className="h-4.5 w-4.5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-base">Koneksi Waha API</CardTitle>
              <CardDescription>WAHA HTTP API gateway</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="waha-url">Waha API URL</Label>
            <Input
              id="waha-url"
              value={config.apiUrl}
              onChange={(e) => setConfig((s) => ({ ...s, apiUrl: e.target.value }))}
              placeholder="http://waha.local:3000"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="waha-key">API Key</Label>
            <Input
              id="waha-key"
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig((s) => ({ ...s, apiKey: e.target.value }))}
              placeholder="••••••••••••"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="waha-session">Default Session</Label>
            <Input
              id="waha-session"
              value={config.defaultSession}
              onChange={(e) => setConfig((s) => ({ ...s, defaultSession: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={testing}
            >
              <Wifi className={cn("h-4 w-4", testing && "animate-pulse")} />
              {testing ? "Menguji…" : "Test Koneksi"}
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveConfig}>
              <Save className="h-4 w-4" /> Simpan Konfigurasi
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* WA Sessions list */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Sesi WhatsApp</CardTitle>
              <CardDescription>Daftar sesi agent yang terhubung ke Waha</CardDescription>
            </div>
            <Badge variant="outline" className="text-emerald-600 border-emerald-200">
              {WA_SESSIONS.filter((s) => s.status === "connected").length}/{WA_SESSIONS.length} online
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[460px]">
            <div className="divide-y">
              {WA_SESSIONS.map((s) => (
                <SessionRow
                  key={s.id}
                  session={s}
                  onScan={() => handleScanQR(s)}
                  onToggle={() => handleToggleSession(s)}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-3">
          <Button variant="outline" size="sm" className="w-full" onClick={() => toast({ title: "Tambah sesi", description: "Form tambah sesi WhatsApp segera hadir." })}>
            <Smartphone className="h-4 w-4" /> Tambah Sesi Baru
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function SessionRow({
  session, onScan, onToggle,
}: {
  session: WhatsAppSession;
  onScan: () => void;
  onToggle: () => void;
}) {
  const connected = session.status === "connected";
  const connecting = session.status === "connecting";
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="relative">
        <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/40 grid place-items-center">
          <Smartphone className="h-5 w-5 text-emerald-600" />
        </div>
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-background",
            connected ? "bg-emerald-500" : connecting ? "bg-amber-500" : "bg-rose-400",
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{session.name}</p>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-1.5 py-0",
              connected
                ? "text-emerald-600 border-emerald-200"
                : connecting
                  ? "text-amber-600 border-amber-200"
                  : "text-rose-600 border-rose-200",
            )}
          >
            {connected ? "Online" : connecting ? "Menyambung" : "Offline"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">+{session.phone}</p>
        <p className="text-[11px] text-muted-foreground">
          {connected ? `${session.battery}% baterai · ${session.lastSeen}` : `Terakhir: ${session.lastSeen}`}
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Button variant="outline" size="sm" onClick={onScan} disabled={connected}>
          <QrCode className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Scan QR</span>
        </Button>
        <Button
          variant={connected ? "outline" : "default"}
          size="sm"
          onClick={onToggle}
          className={connected
            ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
            : "bg-emerald-600 hover:bg-emerald-700 text-white"}
        >
          <Power className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{connected ? "Putus" : "Sambung"}</span>
        </Button>
      </div>
    </div>
  );
}

// ============ Tab: RBAC & Hak Akses ============

function RbacTab({ role }: { role: Role }) {
  const isSuperadmin = role === "superadmin";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 flex-col sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-600" />
              Matriks Hak Akses (RBAC)
            </CardTitle>
            <CardDescription>
              Visualisasi menu yang dapat diakses oleh setiap role.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-rose-600 border-rose-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Hanya Superadmin
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!isSuperadmin && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-3 text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <Lock className="h-4 w-4 shrink-0" />
            <span>Hanya Superadmin yang dapat mengubah hak akses. Anda melihat matriks ini dalam mode read-only.</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Hanya Superadmin yang dapat mengubah hak akses. Matriks berikut menampilkan konfigurasi saat ini.
        </p>

        {/* Matrix table */}
        <div className="rounded-lg border overflow-x-auto">
          <ScrollArea className="max-h-[520px]">
            <table className="w-full text-sm min-w-[680px]">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
                <tr className="border-b">
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground w-[40%]">
                    Menu / Fitur
                  </th>
                  {ROLES.map((r) => {
                    const theme = ROLE_THEME[r.value];
                    return (
                      <th key={r.value} className="py-2.5 px-2 text-center text-xs font-medium">
                        <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5", theme.bg, theme.color)}>
                          {r.label}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {MENU_ITEMS.map((m, idx) => {
                  const rowAlt = idx % 2 === 1;
                  return (
                    <tr key={m.key} className={cn("border-b last:border-0", rowAlt && "bg-muted/20")}>
                      <td className="py-2 px-3">
                        <span className="text-sm font-medium">{m.label}</span>
                      </td>
                      {ROLES.map((r) => {
                        const has = menuForRole(r.value).some((mm) => mm.key === m.key);
                        return (
                          <td key={r.value} className="py-2 px-2 text-center">
                            {has ? (
                              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950/40">
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="sr-only">Bisa akses</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted">
                                <X className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="sr-only">Tidak bisa akses</span>
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollArea>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40">
              <Check className="h-3 w-3 text-emerald-600" />
            </span>
            Bisa diakses
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-muted">
              <X className="h-3 w-3 text-muted-foreground" />
            </span>
            Tidak bisa akses
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ Tab: Preferensi ============

function PreferensiTab() {
  const { toast } = useToast();
  const { theme, toggleTheme } = useAppStore();
  const [prefs, setPrefs] = React.useState({
    emailNotif: true,
    pushNotif: true,
    autoReply: true,
    soundNotif: false,
    language: "id",
  });

  function toggle(key: keyof typeof prefs) {
    setPrefs((s) => ({ ...s, [key]: !s[key] }));
  }

  function handleSave() {
    toast({ title: "Preferensi disimpan", description: "Pengaturan preferensi Anda telah diperbarui." });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BellRing className="h-4 w-4 text-emerald-600" />
            Notifikasi & Tampilan
          </CardTitle>
          <CardDescription>Kontrol notifikasi dan tampilan aplikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 divide-y">
          <PrefRow
            icon={Moon}
            title="Tema Gelap"
            desc="Aktifkan mode gelap untuk kenyamanan mata."
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <PrefRow
            icon={Mail}
            title="Notifikasi Email"
            desc="Terima ringkasan aktivitas via email."
            checked={prefs.emailNotif}
            onChange={() => toggle("emailNotif")}
          />
          <PrefRow
            icon={Bell}
            title="Notifikasi Push"
            desc="Notifikasi browser untuk chat baru & order."
            checked={prefs.pushNotif}
            onChange={() => toggle("pushNotif")}
          />
          <PrefRow
            icon={Bot}
            title="Auto-reply AI"
            desc="Biarkan AI membalas otomatis pesan masuk."
            checked={prefs.autoReply}
            onChange={() => toggle("autoReply")}
          />
          <PrefRow
            icon={Volume2}
            title="Suara Notifikasi"
            desc="Bunyi beep saat chat baru masuk."
            checked={prefs.soundNotif}
            onChange={() => toggle("soundNotif")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-600" />
            Bahasa & Region
          </CardTitle>
          <CardDescription>Atur bahasa antarmuka</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="lang">Bahasa</Label>
            <Select value={prefs.language} onValueChange={(v) => setPrefs((s) => ({ ...s, language: v }))}>
              <SelectTrigger id="lang"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="id">🇮🇩 Indonesia</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Bahasa default: Indonesia</p>
          </div>
          <Separator />
          <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground space-y-1.5">
            <p className="font-medium text-foreground">Pratinjau</p>
            <p>Bahasa aktif akan menerjemahkan label, menu, dan pesan sistem. Beberapa data dari server tetap menggunakan bahasa aslinya.</p>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSave}>
            <Save className="h-4 w-4" /> Simpan Preferensi
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function PrefRow({
  icon: Icon, title, desc, checked, onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 grid place-items-center shrink-0">
        <Icon className="h-4 w-4 text-emerald-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={title} />
    </div>
  );
}

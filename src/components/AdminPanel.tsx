import React from "react";
import { X, Download, RefreshCw, Users, Lock, FileSpreadsheet, ExternalLink, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import { signInWithGoogleSheets, getGoogleAccessToken, logoutGoogle } from "../lib/firebase";

interface Lead {
  brandName: string;
  brand2?: string;
  brand3?: string;
  name?: string;
  email: string;
  phone: string;
  company?: string;
  brandActivity: string;
  notes?: string;
  created_at: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return sessionStorage.getItem("admin_authenticated") === "true";
  });
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginError, setLoginError] = React.useState("");

  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [sheetsUrl, setSheetsUrl] = React.useState<string | null>(null);
  const [hasGoogleToken, setHasGoogleToken] = React.useState<boolean>(false);
  const [googleUserEmail, setGoogleUserEmail] = React.useState<string | null>(null);
  const [isConnectingGoogle, setIsConnectingGoogle] = React.useState(false);
  const [syncingSheets, setSyncingSheets] = React.useState(false);
  const [sheetsMessage, setSheetsMessage] = React.useState("");
  const [showEditSheetUrl, setShowEditSheetUrl] = React.useState(false);
  const [sheetInputUrl, setSheetInputUrl] = React.useState("");

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/leads");
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else {
        throw new Error("Erro ao buscar leads.");
      }
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os leads cadastrados.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSheetsStatus = async () => {
    try {
      const res = await fetch("/api/google-sheets/status");
      if (res.ok) {
        const data = await res.json();
        setHasGoogleToken(!!data.hasToken);
        if (data.userEmail) setGoogleUserEmail(data.userEmail);
        if (data.spreadsheetUrl) {
          setSheetsUrl(data.spreadsheetUrl);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar status do Google Sheets:", err);
    }
  };

  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true);
    setSheetsMessage("");
    try {
      const result = await signInWithGoogleSheets();
      if (result?.accessToken) {
        setSheetsMessage("Conta Google autorizada! Gravando token no servidor e sincronizando dados...");
        const saveRes = await fetch("/api/google-sheets/save-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: result.accessToken,
            userEmail: result.user?.email || null,
          }),
        });
        const saveData = await saveRes.json();
        if (saveData.isOk) {
          setHasGoogleToken(true);
          setGoogleUserEmail(result.user?.email || null);
          if (saveData.spreadsheetUrl) setSheetsUrl(saveData.spreadsheetUrl);
          setSheetsMessage(saveData.message || "Conexão com Google Sheets autorizada com sucesso!");
          await fetchLeads();
          await fetchSheetsStatus();
        } else {
          throw new Error(saveData.message);
        }
      } else {
        throw new Error("Não foi possível obter o token do Google.");
      }
    } catch (err: any) {
      console.error("Erro ao conectar conta Google:", err);
      setSheetsMessage(`Falha ao conectar com o Google: ${err.message || "Permissão negada ou popup fechado."}`);
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await logoutGoogle();
      await fetch("/api/google-sheets/disconnect", { method: "POST" });
      setHasGoogleToken(false);
      setGoogleUserEmail(null);
      setSheetsMessage("Conta Google desconectada com sucesso.");
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSaveSheetUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetInputUrl.trim()) return;
    try {
      const res = await fetch("/api/google-sheets/set-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urlOrId: sheetInputUrl.trim() }),
      });
      const data = await res.json();
      if (data.isOk) {
        setSheetsUrl(data.spreadsheetUrl);
        setShowEditSheetUrl(false);
        setSheetsMessage("Link da planilha atualizado com sucesso!");
        if (hasGoogleToken) {
          syncAllToSheets();
        }
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setSheetsMessage(`Erro ao atualizar planilha: ${err.message || "Falha ao salvar"}`);
    }
  };

  const syncAllToSheets = async (forcedToken?: string) => {
    setSyncingSheets(true);
    setSheetsMessage("");
    try {
      let token = forcedToken || getGoogleAccessToken();
      
      let res = await fetch("/api/google-sheets/sync-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token, userEmail: googleUserEmail }),
      });
      let data = await res.json();

      // If unauthorized, prompt Google login directly
      if (!data.isOk && data.message?.includes("não está autorizado")) {
        setSheetsMessage("Solicitando permissão da conta Google...");
        const loginRes = await signInWithGoogleSheets();
        if (loginRes?.accessToken) {
          token = loginRes.accessToken;
          setHasGoogleToken(true);
          setGoogleUserEmail(loginRes.user?.email || null);
          
          res = await fetch("/api/google-sheets/sync-all", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: token, userEmail: loginRes.user?.email }),
          });
          data = await res.json();
        }
      }

      if (data.isOk) {
        setSheetsUrl(data.spreadsheetUrl);
        setHasGoogleToken(true);
        setSheetsMessage(`Sincronizado com sucesso! ${data.count} leads gravados na aba "${data.tabTitle || 'da planilha'}" do Google Sheets.`);
      } else {
        throw new Error(data.message || "Erro ao sincronizar.");
      }
    } catch (err: any) {
      console.error(err);
      setSheetsMessage(`Erro na sincronização: ${err.message || "Falha ao conectar ao Google."}`);
    } finally {
      setSyncingSheets(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchLeads();
      fetchSheetsStatus();
    }
  }, [isOpen, isAuthenticated]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "fbzgrowthintelligence@gmail.com" && password === "macarraocomtaco159753") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setLoginError("");
    } else {
      setLoginError("Credenciais inválidas. Verifique o e-mail e a senha.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
    setEmail("");
    setPassword("");
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;

    // CSV headers and content
    const headers = ["Data de Envio", "Nome da Marca/Empresa", "E-mail", "Telefone", "Atuacao/Descricao"];
    const rows = leads.map(lead => [
      new Date(lead.created_at).toLocaleString("pt-BR"),
      lead.brandName,
      lead.email,
      lead.phone,
      lead.brandActivity.replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_fibizz_ip_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  // Render Login overlay if not authenticated
  if (!isAuthenticated) {
    return (
      <div id="admin-login-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div 
          id="admin-login-container"
          className="relative w-full max-w-md bg-[#121824] border border-[#1E2736] rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[#F4F7FF]/50 hover:text-[#F4F7FF] hover:bg-[#1E2736]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Acesso Restrito</h2>
            <p className="text-xs text-slate-400 mt-1 font-light">
              Entre com suas credenciais de administrador FIBIZZ
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 text-xs bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-lg">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-[#F4F7FF]/70 mb-1.5">
                E-mail Administrativo
              </label>
              <input
                type="email"
                required
                placeholder="exemplo@fbzgrowth.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#0B0F1A] border border-[#1E2736] text-[#F4F7FF] placeholder-[#F4F7FF]/30 focus:outline-none focus:border-brand-blue transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#F4F7FF]/70 mb-1.5">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#0B0F1A] border border-[#1E2736] text-[#F4F7FF] placeholder-[#F4F7FF]/30 focus:outline-none focus:border-brand-blue transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 mt-2 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-brand-blue/95 transition-all shadow-lg active:scale-[0.99]"
            >
              Confirmar Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Admin leads list if authenticated
  return (
    <div id="admin-panel-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        id="admin-panel-container"
        className="relative w-full max-w-4xl bg-[#121824] border border-[#1E2736] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2736]">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-[#F4F7FF]">Painel Administrativo - FIBIZZ Leads</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#F4F7FF]/50 hover:text-[#F4F7FF] hover:bg-[#1E2736]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 bg-[#0B0F1A]/60 flex flex-wrap items-center justify-between gap-3 border-b border-[#1E2736]">
          <p className="text-xs text-[#F4F7FF]/60 font-light">
            Total de diagnósticos enviados: <span className="font-semibold text-cyan-300">{leads.length}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={syncAllToSheets}
              disabled={syncingSheets}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
            >
              <FileSpreadsheet className={`w-3.5 h-3.5 ${syncingSheets ? "animate-spin" : ""}`} />
              <span>{syncingSheets ? "Sincronizando..." : "Sincronizar Google Sheets"}</span>
            </button>

            <button
              onClick={fetchLeads}
              disabled={loading}
              className="inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-[#1E2736] bg-[#121824] text-[#F4F7FF]/80 hover:text-[#F4F7FF] hover:bg-[#1E2736] disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Atualizar</span>
            </button>

            <button
              onClick={exportToCSV}
              disabled={leads.length === 0}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-brand-blue text-[#F4F7FF] hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Excel (CSV)</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Google Sheets Integration Card */}
          {hasGoogleToken ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 flex-shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                      <span>Google Sheets Conectado e Ativo</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </h4>
                    <p className="text-[11px] text-[#F4F7FF]/70 font-light mt-0.5">
                      {googleUserEmail ? (
                        <>Autorizado por: <span className="font-semibold text-[#F4F7FF]">{googleUserEmail}</span>. Novos diagnósticos são gravados automaticamente na planilha.</>
                      ) : (
                        "Novos diagnósticos enviados são gravados automaticamente na planilha."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSheetInputUrl(sheetsUrl || "");
                      setShowEditSheetUrl(!showEditSheetUrl);
                    }}
                    className="text-[11px] font-medium text-emerald-400 hover:underline px-2 py-1"
                  >
                    {showEditSheetUrl ? "Fechar Edição" : "Alterar Link"}
                  </button>

                  {sheetsUrl && (
                    <a
                      href={sheetsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm"
                    >
                      <span>Abrir Planilha</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleDisconnectGoogle}
                    title="Desconectar conta Google"
                    className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showEditSheetUrl && (
                <form onSubmit={handleSaveSheetUrl} className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-emerald-500/20">
                  <input
                    type="text"
                    placeholder="Cole o link ou ID da planilha do Google Sheets..."
                    value={sheetInputUrl}
                    onChange={(e) => setSheetInputUrl(e.target.value)}
                    className="flex-1 w-full bg-[#0D121F] border border-emerald-500/30 rounded-lg px-3 py-1.5 text-xs text-[#F4F7FF] focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-3 py-1.5 bg-emerald-500 text-slate-950 font-semibold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
                  >
                    Salvar
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="p-4 bg-brand-blue/10 border border-brand-blue/30 rounded-xl flex flex-col space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-brand-blue/20 rounded-lg text-cyan-400 flex-shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
                      <span>Conectar Google Sheets para Receber os Dados</span>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    </h4>
                    <p className="text-[11px] text-[#F4F7FF]/70 font-light mt-0.5">
                      Autorize sua conta do Google que tem permissão na planilha para que todos os dados sejam inseridos automaticamente.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleConnectGoogle}
                    disabled={isConnectingGoogle}
                    className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 rounded-lg font-bold text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>{isConnectingGoogle ? "Conectando..." : "Conectar Conta Google"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSheetInputUrl(sheetsUrl || "");
                      setShowEditSheetUrl(!showEditSheetUrl);
                    }}
                    className="text-[11px] font-medium text-cyan-400 hover:underline px-2 py-1"
                  >
                    {showEditSheetUrl ? "Cancelar" : "Alterar Link"}
                  </button>
                </div>
              </div>

              {showEditSheetUrl && (
                <form onSubmit={handleSaveSheetUrl} className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-brand-blue/20">
                  <input
                    type="text"
                    placeholder="Cole o link ou ID da planilha do Google Sheets..."
                    value={sheetInputUrl}
                    onChange={(e) => setSheetInputUrl(e.target.value)}
                    className="flex-1 w-full bg-[#0D121F] border border-cyan-500/30 rounded-lg px-3 py-1.5 text-xs text-[#F4F7FF] focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-3 py-1.5 bg-brand-blue text-[#F4F7FF] font-semibold text-xs rounded-lg hover:bg-brand-blue/80 transition-colors"
                  >
                    Salvar Link
                  </button>
                </form>
              )}
            </div>
          )}

          {sheetsMessage && (
            <div className="p-3 text-xs bg-brand-blue/15 border border-brand-blue/30 text-cyan-300 rounded-lg">
              {sheetsMessage}
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm rounded-xl">
              {error}
            </div>
          )}

          {loading && leads.length === 0 ? (
            <div className="py-12 text-center text-[#F4F7FF]/40 text-sm font-light">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-400 mb-3" />
              Buscando novos diagnósticos no banco de dados...
            </div>
          ) : leads.length === 0 ? (
            <div className="py-12 text-center text-[#F4F7FF]/40 text-sm font-light border border-dashed border-[#1E2736] rounded-xl">
              Nenhum diagnóstico preenchido ainda.
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#1E2736] rounded-xl bg-[#0B0F1A]/40">
              <table className="w-full text-left text-xs text-[#F4F7FF]/85 border-collapse">
                <thead>
                  <tr className="border-b border-[#1E2736] bg-[#0B0F1A]/80 text-[#F4F7FF]/50 uppercase tracking-wider text-[10px] font-semibold">
                    <th className="p-4">Data/Hora</th>
                    <th className="p-4">Marca(s)</th>
                    <th className="p-4">Solicitante / Empresa</th>
                    <th className="p-4">E-mail / Telefone</th>
                    <th className="p-4">Ramo / Observações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2736]/40 font-light">
                  {leads.map((lead, index) => (
                    <tr key={index} className="hover:bg-[#1E2736]/20 transition-colors">
                      <td className="p-4 whitespace-nowrap text-[11px] text-[#F4F7FF]/45">
                        {new Date(lead.created_at).toLocaleString("pt-BR")}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-semibold text-cyan-300">{lead.brandName}</div>
                        {(lead.brand2 || lead.brand3) && (
                          <div className="text-[10px] text-[#F4F7FF]/50 mt-0.5">
                            Adicionais: {[lead.brand2, lead.brand3].filter(Boolean).join(", ")}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-[#F4F7FF]/85 text-xs">
                        <div>{lead.name || "—"}</div>
                        {lead.company && (
                          <div className="text-[10px] text-cyan-400/80">{lead.company}</div>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap text-xs">
                        <div className="text-[#F4F7FF]/80">{lead.email}</div>
                        <div className="font-mono text-[11px] text-[#F4F7FF]/60">{lead.phone}</div>
                      </td>
                      <td className="p-4 text-xs text-[#F4F7FF]/70 min-w-[200px] max-w-[320px] break-words">
                        <div className="font-medium text-[#F4F7FF]/90">{lead.brandActivity}</div>
                        {lead.notes && (
                          <div className="text-[11px] text-[#F4F7FF]/50 mt-1 italic line-clamp-2">
                            "{lead.notes}"
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1E2736] bg-[#0B0F1A]/40 flex items-center justify-between">
          <p className="text-[10px] text-[#F4F7FF]/30 font-light">
            Os dados mostrados acima residem de forma segura na infraestrutura de servidores da FIBIZZ.
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-rose-500/30 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 transition-colors"
            >
              Sair
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1E2736] hover:bg-[#1E2736]/80 text-[#F4F7FF] transition-colors"
            >
              Fechar Painel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

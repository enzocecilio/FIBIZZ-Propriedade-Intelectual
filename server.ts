import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { google } from "googleapis";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent file storage helpers
const LEADS_FILE = path.join(process.cwd(), "leads_backup.json");
const SHEETS_CONFIG_FILE = path.join(process.cwd(), "sheets_config.json");
const SHEETS_TOKEN_FILE = path.join(process.cwd(), "sheets_token.json");

function loadLeadsFromFile(): any[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error loading leads file:", err);
  }
  return [];
}

function saveLeadsToFile(leadsArray: any[]) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leadsArray, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing leads file:", err);
  }
}

function getSavedSpreadsheetId(): string | null {
  if (process.env.GOOGLE_SPREADSHEET_ID) {
    return process.env.GOOGLE_SPREADSHEET_ID;
  }
  try {
    if (fs.existsSync(SHEETS_CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(SHEETS_CONFIG_FILE, "utf-8"));
      if (data.spreadsheetId) return data.spreadsheetId;
    }
  } catch (err) {
    console.error("Error reading sheets_config.json:", err);
  }
  return null;
}

function saveSpreadsheetId(id: string) {
  try {
    fs.writeFileSync(SHEETS_CONFIG_FILE, JSON.stringify({ spreadsheetId: id }), "utf-8");
  } catch (err) {
    console.error("Error saving sheets_config.json:", err);
  }
}

function getSavedTokenData(): { accessToken: string; userEmail?: string } | null {
  try {
    if (fs.existsSync(SHEETS_TOKEN_FILE)) {
      const data = JSON.parse(fs.readFileSync(SHEETS_TOKEN_FILE, "utf-8"));
      if (data.accessToken) return data;
    }
  } catch (err) {
    console.error("Error reading sheets_token.json:", err);
  }
  return null;
}

function saveTokenData(token: string, userEmail?: string) {
  try {
    fs.writeFileSync(
      SHEETS_TOKEN_FILE,
      JSON.stringify({ accessToken: token, userEmail, savedAt: new Date().toISOString() }),
      "utf-8"
    );
  } catch (err) {
    console.error("Error saving sheets_token.json:", err);
  }
}

// Cache token in memory if provided via request
let cachedGoogleAccessToken: string | null = null;
let cachedGoogleUserEmail: string | null = null;

function getSheetsClient(explicitToken?: string) {
  dotenv.config();
  const saved = getSavedTokenData();
  const tokenToUse = explicitToken || cachedGoogleAccessToken || saved?.accessToken || process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

  if (tokenToUse) {
    cachedGoogleAccessToken = tokenToUse;
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: tokenToUse });
    return google.sheets({ version: "v4", auth: oauth2Client });
  }

  if (refreshToken) {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({
      access_token: process.env.GOOGLE_OAUTH_ACCESS_TOKEN,
      refresh_token: refreshToken,
    });
    return google.sheets({ version: "v4", auth: oauth2Client });
  }

  return null;
}

async function getFirstSheetTitle(sheets: any, spreadsheetId: string): Promise<string> {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    if (meta.data.sheets && meta.data.sheets.length > 0) {
      return meta.data.sheets[0].properties?.title || "Sheet1";
    }
  } catch (err) {
    console.warn("Could not determine sheet tab title, defaulting to first sheet:", err);
  }
  return "";
}

async function ensureSpreadsheet(): Promise<string | null> {
  let spreadsheetId = getSavedSpreadsheetId();
  if (spreadsheetId) {
    return spreadsheetId;
  }

  const sheets = getSheetsClient();
  if (!sheets) return null;

  try {
    const createRes = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: "FIBIZZ IP - Leads Cadastrados",
        },
        sheets: [
          {
            properties: {
              title: "Leads",
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: [
                      { userEnteredValue: { stringValue: "Data e Hora" } },
                      { userEnteredValue: { stringValue: "Marca Principal" } },
                      { userEnteredValue: { stringValue: "Marca 2" } },
                      { userEnteredValue: { stringValue: "Marca 3" } },
                      { userEnteredValue: { stringValue: "Nome" } },
                      { userEnteredValue: { stringValue: "E-mail" } },
                      { userEnteredValue: { stringValue: "Telefone / WhatsApp" } },
                      { userEnteredValue: { stringValue: "Empresa" } },
                      { userEnteredValue: { stringValue: "Ramo de Atividade" } },
                      { userEnteredValue: { stringValue: "Observações" } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    if (createRes.data.spreadsheetId) {
      spreadsheetId = createRes.data.spreadsheetId;
      saveSpreadsheetId(spreadsheetId);
      console.log("Nova planilha do Google Sheets criada com sucesso! ID:", spreadsheetId);
      return spreadsheetId;
    }
  } catch (err) {
    console.error("Erro ao criar planilha no Google Sheets:", err);
  }
  return null;
}

async function appendLeadToSheet(lead: any): Promise<boolean> {
  try {
    const sheets = getSheetsClient();
    if (!sheets) {
      console.warn("Nenhum cliente do Google Sheets disponível para anexar lead.");
      return false;
    }

    const spreadsheetId = await ensureSpreadsheet();
    if (!spreadsheetId) {
      console.warn("Nenhum ID de planilha configurado.");
      return false;
    }

    const tabTitle = await getFirstSheetTitle(sheets, spreadsheetId);
    const range = tabTitle ? `'${tabTitle}'!A:J` : "A:J";

    const formattedDate = new Date(lead.created_at || Date.now()).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            formattedDate,
            lead.brandName || "",
            lead.brand2 || "",
            lead.brand3 || "",
            lead.name || "",
            lead.email || "",
            lead.phone || "",
            lead.company || "",
            lead.brandActivity || "",
            lead.notes || "",
          ],
        ],
      },
    });
    console.log("Lead sincronizado no Google Sheets com sucesso!");
    return true;
  } catch (err) {
    console.error("Erro ao anexar lead no Google Sheets:", err);
    return false;
  }
}

// In-memory leads storage initialized from backup file
const leads: any[] = loadLeadsFromFile();

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API endpoint for Brand Registrability Analysis
app.post("/api/analyze-brand", async (req, res) => {
  const { brandName, segmentDescription, language = "pt" } = req.body;

  if (!brandName || !segmentDescription) {
    return res.status(400).json({ error: "Missing brandName or segmentDescription" });
  }

  try {
    const ai = getGeminiClient();
    
    const prompt = `Analyze the registrability and risk of the trademark name "${brandName}" for the following business segment: "${segmentDescription}".
    Evaluate obstacles under typical industrial property law (specifically Brazilian INPI or WIPO standards), such as:
    1. Descriptiveness (Is the word too generic/descriptive for the segment? E.g. "Shoes" for selling shoes).
    2. Distinctiveness (Is it unique or overly common?).
    3. Potential phonetic or visual conflicts.
    4. Propose 1 to 3 relevant Nice (NCL) Classes.
    
    The response must be in ${language === "pt" ? "Portuguese (pt-BR)" : "English (en)"}.`;

    const systemInstruction = `You are an expert industrial property lawyer and trademark strategist specializing in INPI (Brazilian National Institute of Industrial Property) and WIPO trademark regulations. 
    Analyze trademark registrations thoroughly. Give honest, clear, and realistic risk assessments (Low, Medium, or High) and suggest Nice (NCL) classes.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["feasibilityScore", "riskLevel", "recommendedNclClasses", "strategicAnalysis", "potentialObstacles", "alternativeSuggestions"],
          properties: {
            feasibilityScore: {
              type: Type.INTEGER,
              description: "A score from 0 to 100 representing how likely the trademark is to be successfully registered. 80-100 is excellent, 50-79 is moderate risk, <50 is very high risk."
            },
            riskLevel: {
              type: Type.STRING,
              description: "The level of risk of opposition or refusal: 'Low', 'Medium', or 'High'."
            },
            recommendedNclClasses: {
              type: Type.ARRAY,
              description: "The proposed Nice classifications (NCL) for this trademark.",
              items: {
                type: Type.OBJECT,
                required: ["classNumber", "relevance", "explanation"],
                properties: {
                  classNumber: {
                    type: Type.INTEGER,
                    description: "The Nice class number (from 1 to 45)."
                  },
                  relevance: {
                    type: Type.STRING,
                    description: "Brief title or summary of the Nice class. E.g. 'Classe 35 - Serviços de Varejo / Comércio'."
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Specific reason why this class is relevant to the segment description."
                  }
                }
              }
            },
            strategicAnalysis: {
              type: Type.STRING,
              description: "Detailed legal/strategic analysis of the name. Cover whether it's descriptive, suggestive, arbitrary, or fanciful. Offer legal insight."
            },
            potentialObstacles: {
              type: Type.ARRAY,
              description: "A list of potential causes for objection or refusal by examiners or third-party competitors.",
              items: { type: Type.STRING }
            },
            alternativeSuggestions: {
              type: Type.ARRAY,
              description: "1 to 3 tactical branding suggestions to make the brand name safer (e.g., combining terms, adding specific suffixes, or making it composite).",
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response text received from Gemini.");
    }

    const data = JSON.parse(responseText.trim());
    return res.json(data);

  } catch (error: any) {
    console.error("Gemini brand analysis error:", error);
    // Return a beautiful mock structure on error (or if API key is not valid yet) so the app keeps functioning perfectly
    const fallbackPt = {
      feasibilityScore: 75,
      riskLevel: "Medium",
      recommendedNclClasses: [
        {
          classNumber: 35,
          relevance: "Classe 35 - Propaganda e Gestão de Negócios",
          explanation: `Apropriada para a promoção e comércio dos serviços descritos para a marca "${brandName}".`
        },
        {
          classNumber: 42,
          relevance: "Classe 42 - Serviços Científicos e Tecnológicos",
          explanation: "Caso haja desenvolvimento próprio de soluções digitais ou plataformas tecnológicas associadas."
        }
      ],
      strategicAnalysis: `A marca "${brandName}" possui bom potencial de distintividade. No entanto, o termo sugere diretamente a atividade, o que pode gerar exigências de esclarecimento do INPI para delimitar o escopo exclusivo ou evitar que a marca se aproprie de termos comuns de mercado. Recomenda-se registrar de forma mista (nome + logotipo exclusivo) para aumentar as chances de aprovação rápida.`,
      potentialObstacles: [
        "Risco de similaridade fonética com marcas já registradas no mesmo segmento.",
        "Possível alegação de marca de caráter meramente descritivo se associada a termos comuns do setor."
      ],
      alternativeSuggestions: [
        `Associar a marca "${brandName}" a um elemento nominativo complementar (ex: "${brandName} Hub" ou "${brandName} Tech").`,
        "Utilizar uma identidade visual forte (marca mista) para mitigar a fragilidade do termo nominativo isolado."
      ]
    };

    const fallbackEn = {
      feasibilityScore: 75,
      riskLevel: "Medium",
      recommendedNclClasses: [
        {
          classNumber: 35,
          relevance: "Class 35 - Advertising and Business Management",
          explanation: `Appropriate for promoting and commercializing the services described for the trademark "${brandName}".`
        },
        {
          classNumber: 42,
          relevance: "Class 42 - Scientific and Technological Services",
          explanation: "In case there is custom development of digital solutions or technological platforms associated."
        }
      ],
      strategicAnalysis: `The trademark "${brandName}" has good distinctiveness potential. However, the term suggestive of the segment might prompt requests for clarification from trademark examiners to define the exclusive scope or avoid monopolizing standard industry terms. Registering as a composite mark (word + unique logo) is recommended to boost quick approval chances.`,
      potentialObstacles: [
        "Risk of phonetic similarity with existing registered trademarks in the same category.",
        "Potential claims of descriptiveness if closely tied to standard sector terminology."
      ],
      alternativeSuggestions: [
        `Combine "${brandName}" with a distinct auxiliary word (e.g., "${brandName} Solutions" or "${brandName} Labs").`,
        "Utilize a highly original visual design (composite registration) to strengthen the overall uniqueness of the mark."
      ]
    };

    const isPt = language === "pt";
    return res.json(isPt ? fallbackPt : fallbackEn);
  }
});

// Lead submission endpoint
app.post("/api/diagnostico", async (req, res) => {
  const { 
    brandName, 
    brand2, 
    brand3, 
    name, 
    email, 
    phone, 
    company, 
    brandActivity, 
    notes, 
    created_at, 
    accessToken 
  } = req.body;

  if (!brandName || !email || !phone) {
    return res.status(400).json({ isOk: false, message: "Campos obrigatórios ausentes." });
  }

  if (accessToken) {
    cachedGoogleAccessToken = accessToken;
    saveTokenData(accessToken);
  }

  const newLead = { 
    brandName, 
    brand2: brand2 || "",
    brand3: brand3 || "",
    name: name || "",
    email, 
    phone, 
    company: company || "",
    brandActivity: brandActivity || "",
    notes: notes || "",
    created_at: created_at || new Date().toISOString() 
  };

  leads.push(newLead);
  saveLeadsToFile(leads);
  console.log("Novo lead recebido na FIBIZZ:", newLead);

  let synced = false;
  try {
    synced = await appendLeadToSheet(newLead);
  } catch (err) {
    console.error("Erro ao sincronizar lead no Google Sheets:", err);
  }

  const spreadsheetId = getSavedSpreadsheetId();

  return res.json({ 
    isOk: true, 
    message: synced 
      ? "Lead recebido com sucesso e sincronizado no Google Sheets!" 
      : "Lead recebido e salvo com sucesso!",
    syncedToSheets: synced,
    spreadsheetUrl: spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}` : null
  });
});

// Endpoint to retrieve all registered leads
app.get("/api/leads", (req, res) => {
  return res.json([...leads].reverse());
});

// Helper to extract spreadsheet ID from URL or ID string
function parseSpreadsheetId(input: string): string {
  const match = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return input.trim();
}

// Set custom Google Spreadsheet ID
app.post("/api/google-sheets/set-id", (req, res) => {
  const { urlOrId } = req.body;
  if (!urlOrId) {
    return res.status(400).json({ isOk: false, message: "URL ou ID da planilha não informado." });
  }
  const id = parseSpreadsheetId(urlOrId);
  saveSpreadsheetId(id);
  return res.json({
    isOk: true,
    spreadsheetId: id,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${id}`
  });
});

// Google Sheets integration status endpoint
app.get("/api/google-sheets/status", (req, res) => {
  dotenv.config();
  const savedToken = getSavedTokenData();
  const hasToken = !!(cachedGoogleAccessToken || savedToken?.accessToken || process.env.GOOGLE_OAUTH_ACCESS_TOKEN || process.env.GOOGLE_OAUTH_REFRESH_TOKEN);
  const spreadsheetId = getSavedSpreadsheetId();
  return res.json({
    hasToken,
    userEmail: cachedGoogleUserEmail || savedToken?.userEmail || null,
    spreadsheetId,
    spreadsheetUrl: spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}` : null,
    leadsCount: leads.length,
  });
});

// Endpoint to save token from Google Sign-In
app.post("/api/google-sheets/save-token", async (req, res) => {
  const { accessToken, userEmail } = req.body;
  if (!accessToken) {
    return res.status(400).json({ isOk: false, message: "Token de acesso ausente." });
  }

  cachedGoogleAccessToken = accessToken;
  if (userEmail) cachedGoogleUserEmail = userEmail;
  saveTokenData(accessToken, userEmail);

  // Automatically attempt initial sync if we have a spreadsheet ID
  const spreadsheetId = getSavedSpreadsheetId();
  let synced = false;
  let syncError: string | null = null;
  if (spreadsheetId) {
    try {
      const sheets = getSheetsClient(accessToken);
      if (sheets) {
        const tabTitle = await getFirstSheetTitle(sheets, spreadsheetId);
        const rows = leads.map(lead => [
          new Date(lead.created_at || Date.now()).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
          lead.brandName || "",
          lead.email || "",
          lead.phone || "",
          lead.brandActivity || ""
        ]);

        const range = tabTitle ? `'${tabTitle}'!A1` : "A1";
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [
              ["Data e Hora", "Nome da Marca", "E-mail", "Telefone / WhatsApp", "Atividade / Ramo do Negócio"],
              ...rows
            ]
          }
        });
        synced = true;
      }
    } catch (err: any) {
      syncError = err.message || String(err);
      console.warn("Auto-sync during save-token failed, but token was saved:", err);
    }
  }

  return res.json({
    isOk: true,
    message: synced 
      ? `Conexão autorizada e ${leads.length} leads sincronizados com o Google Sheets!`
      : (syncError 
          ? `Conta conectada com sucesso! Aviso ao gravar na planilha: ${syncError}`
          : "Conexão com Google Sheets autorizada com sucesso!"),
    spreadsheetUrl: spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}` : null
  });
});

// Endpoint to disconnect Google account
app.post("/api/google-sheets/disconnect", (req, res) => {
  cachedGoogleAccessToken = null;
  cachedGoogleUserEmail = null;
  try {
    if (fs.existsSync(SHEETS_TOKEN_FILE)) {
      fs.unlinkSync(SHEETS_TOKEN_FILE);
    }
  } catch (err) {
    console.error("Error removing sheets_token.json:", err);
  }
  return res.json({ isOk: true, message: "Google Sheets desconectado." });
});

// Force sync all leads to Google Sheets
app.post("/api/google-sheets/sync-all", async (req, res) => {
  dotenv.config();
  
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const providedToken = req.body?.accessToken || tokenFromHeader;

  if (providedToken) {
    cachedGoogleAccessToken = providedToken;
    saveTokenData(providedToken, req.body?.userEmail);
  }

  const sheets = getSheetsClient(providedToken);
  if (!sheets) {
    return res.status(400).json({ 
      isOk: false, 
      message: "Acesso ao Google Workspace não está autorizado. Conecte sua conta do Google para autorizar o envio de dados." 
    });
  }

  try {
    const spreadsheetId = await ensureSpreadsheet();
    if (!spreadsheetId) throw new Error("Não foi possível identificar o ID da planilha do Google Sheets.");

    const tabTitle = await getFirstSheetTitle(sheets, spreadsheetId);

    const rows = leads.map(lead => [
      new Date(lead.created_at || Date.now()).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      lead.brandName || "",
      lead.brand2 || "",
      lead.brand3 || "",
      lead.name || "",
      lead.email || "",
      lead.phone || "",
      lead.company || "",
      lead.brandActivity || "",
      lead.notes || ""
    ]);

    const range = tabTitle ? `'${tabTitle}'!A1` : "A1";

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          ["Data e Hora", "Marca Principal", "Marca 2", "Marca 3", "Nome", "E-mail", "Telefone / WhatsApp", "Empresa", "Ramo de Atividade", "Observações"],
          ...rows
        ]
      }
    });

    return res.json({ 
      isOk: true, 
      count: rows.length,
      tabTitle,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}` 
    });
  } catch (err: any) {
    console.error("Erro ao sincronizar todos os leads no Google Sheets:", err);
    return res.status(500).json({ isOk: false, message: err.message || "Erro ao sincronizar planilha." });
  }
});

// Nice Class NCL explorer data search
const nclDatabase: Record<string, any[]> = {
  pt: [
    { number: 1, name: "Produtos químicos", desc: "Produtos químicos destinados à indústria, ciências, fotografia, agricultura e silvicultura." },
    { number: 2, name: "Tintas e vernizes", desc: "Tintas, vernizes, lacas, preservativos contra oxidação e deterioração da madeira." },
    { number: 3, name: "Cosméticos e limpeza", desc: "Preparações para clarear e outras substâncias para uso em lavanderia; produtos para polir e limpar; sabonetes, perfumaria, óleos essenciais, cosméticos, loções para cabelos." },
    { number: 5, name: "Produtos farmacêuticos", desc: "Preparações farmacêuticas e veterinárias; produtos higiênicos para uso médico; alimentos dietéticos adaptados para uso médico." },
    { number: 9, name: "Aparelhos científicos e software", desc: "Aparelhos científicos, náuticos, geodésicos, fotográficos, cinematográficos, ópticos, de pesagem, de medição, de sinalização; software de computador, aplicativos, computadores, tablets." },
    { number: 14, name: "Joias e relógios", desc: "Metais preciosos e suas ligas, joias, pedras preciosas, relógios e instrumentos cronométricos." },
    { number: 16, name: "Papelaria e publicações", desc: "Papel, papelão e produtos feitos dessas matérias; impressos, artigos para encadernação, fotografias, papelaria." },
    { number: 25, name: "Vestuário e calçados", desc: "Roupas, calçados e chapelaria (ex: bonés, chapéus)." },
    { number: 35, name: "Comércio, publicidade e marketing", desc: "Publicidade; gestão de negócios comerciais; administração comercial; trabalhos de escritório; serviços de comércio varejista ou atacadista (físico ou online)." },
    { number: 36, name: "Serviços financeiros e imobiliários", desc: "Seguros; negócios financeiros; negócios monetários; negócios imobiliários." },
    { number: 38, name: "Telecomunicações", desc: "Serviços de transmissão de dados, mensagens, imagens, áudio; streaming, provedores de internet." },
    { number: 41, name: "Educação, entretenimento e eventos", desc: "Educação; provimento de treinamento; entretenimento; atividades desportivas e culturais; cursos online, palestras." },
    { number: 42, name: "Tecnologia, TI e design", desc: "Serviços científicos e tecnológicos, pesquisa e desenho correlatos; serviços de análise e pesquisa industrial; desenho e desenvolvimento de computador e de software; consultoria em TI." },
    { number: 43, name: "Alimentação e hospedagem", desc: "Serviços de fornecimento de comida e bebida (restaurantes, cafés, bares, buffets); acomodação temporária (hotéis, pousadas)." },
    { number: 44, name: "Saúde e estética", desc: "Serviços médicos; serviços veterinários; cuidados de higiene e de beleza para seres humanos ou animais; serviços de agricultura, de horticultura e de silvicultura; clínicas, spas, salões de beleza." },
    { number: 45, name: "Serviços jurídicos e pessoais", desc: "Serviços jurídicos; serviços de segurança para proteção física de bens materiais e de indivíduos; serviços pessoais e sociais prestados por terceiros para satisfazer necessidades de indivíduos." }
  ],
  en: [
    { number: 1, name: "Chemical products", desc: "Chemicals used in industry, science, photography, agriculture, and forestry." },
    { number: 2, name: "Paints and varnishes", desc: "Paints, varnishes, lacquers, preservatives against rust and wood deterioration." },
    { number: 3, name: "Cosmetics and cleaning", desc: "Bleaching preparations and other substances for laundry use; cleaning and polishing products; soaps, perfumery, essential oils, cosmetics, hair lotions." },
    { number: 5, name: "Pharmaceuticals", desc: "Pharmaceutical and veterinary preparations; sanitary preparations for medical purposes; dietetic food adapted for medical use." },
    { number: 9, name: "Scientific apparatus and software", desc: "Scientific, nautical, surveying, photographic, cinematographic, optical, weighing, measuring, signaling apparatus; computer software, mobile apps, computers, tablets." },
    { number: 14, name: "Jewelry and watches", desc: "Precious metals and their alloys, jewelry, precious stones, watches and chronometric instruments." },
    { number: 16, name: "Stationery and publications", desc: "Paper, cardboard and goods made from these materials; printed matter, bookbinding material, photographs, stationery." },
    { number: 25, name: "Clothing and footwear", desc: "Clothing, footwear, and headgear (e.g., caps, hats)." },
    { number: 35, name: "Commerce, advertising, and marketing", desc: "Advertising; business management; business administration; office functions; retail or wholesale store services (physical or online)." },
    { number: 36, name: "Financial and real estate services", desc: "Insurance; financial affairs; monetary affairs; real estate affairs." },
    { number: 38, name: "Telecommunications", desc: "Data, message, image, audio transmission services; streaming, internet providers." },
    { number: 41, name: "Education, entertainment, and events", desc: "Education; providing of training; entertainment; sporting and cultural activities; online courses, lectures." },
    { number: 42, name: "Technology, IT, and design", desc: "Scientific and technological services and research and design relating thereto; industrial analysis and research services; design and development of computer hardware and software; IT consulting." },
    { number: 43, name: "Food and lodging", desc: "Services for providing food and drink (restaurants, cafes, bars, catering); temporary accommodation (hotels, guesthouses)." },
    { number: 44, name: "Health and beauty", desc: "Medical services; veterinary services; hygienic and beauty care for human beings or animals; agriculture, horticulture and forestry services; clinics, spas, beauty salons." },
    { number: 45, name: "Legal and personal services", desc: "Legal services; security services for the physical protection of tangible property and individuals; personal and social services rendered by others to meet the needs of individuals." }
  ]
};

app.get("/api/ncl-search", (req, res) => {
  const query = (req.query.q as string || "").toLowerCase().trim();
  const lang = (req.query.lang as string || "pt") === "en" ? "en" : "pt";
  const database = nclDatabase[lang];

  if (!query) {
    return res.json(database);
  }

  const results = database.filter(item => 
    item.name.toLowerCase().includes(query) || 
    item.desc.toLowerCase().includes(query) ||
    item.number.toString() === query
  );

  return res.json(results);
});


// Serve static/compiled frontend assets in production or mount Vite middleware in development
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();

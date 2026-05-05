import { useState, useEffect, useRef } from "react";

const STEPS = ["Projet", "Client", "Offre", "Résultat"];

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --border: #1e1e2e;
    --accent: #c8f060;
    --accent2: #60d0f0;
    --text: #e8e8f0;
    --muted: #6060780;
    --muted2: #606078;
    --radius: 12px;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* HEADER */
  .header {
    padding: 20px 40px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: rgba(10,10,15,0.92);
    backdrop-filter: blur(16px);
    z-index: 100;
  }

  .logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.3rem;
    letter-spacing: -0.03em;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-dot {
    width: 8px; height: 8px;
    background: var(--accent);
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0 0 12px var(--accent);
  }

  .badge {
    font-size: 0.65rem;
    padding: 3px 10px;
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--muted2);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* STEPS */
  .steps-bar {
    display: flex;
    gap: 0;
    padding: 0 40px;
    border-bottom: 1px solid var(--border);
    overflow-x: auto;
  }

  .step-tab {
    padding: 14px 24px;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted2);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .step-tab.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
  }

  .step-tab.done {
    color: var(--accent2);
  }

  .step-num {
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 1px solid currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
  }

  /* MAIN */
  .main {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    gap: 0;
  }

  @media (max-width: 768px) {
    .main { grid-template-columns: 1fr; }
    .header { padding: 16px 20px; }
    .steps-bar { padding: 0 20px; }
    .preview-panel { display: none; }
  }

  /* FORM PANEL */
  .form-panel {
    padding: 40px;
    border-right: 1px solid var(--border);
  }

  .panel-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 6px;
    letter-spacing: -0.02em;
  }

  .panel-sub {
    font-size: 0.75rem;
    color: var(--muted2);
    margin-bottom: 32px;
    line-height: 1.6;
  }

  .field {
    margin-bottom: 20px;
  }

  .field label {
    display: block;
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted2);
    margin-bottom: 8px;
  }

  .field input, .field textarea, .field select {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px 16px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    transition: border-color 0.2s;
    resize: vertical;
    outline: none;
  }

  .field input:focus, .field textarea:focus, .field select:focus {
    border-color: var(--accent);
  }

  .field select option { background: var(--surface); }

  .field textarea { min-height: 90px; }

  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  .tag {
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid var(--border);
    font-size: 0.72rem;
    cursor: pointer;
    transition: all 0.15s;
    color: var(--muted2);
  }

  .tag.selected {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(200,240,96,0.07);
  }

  /* BUTTONS */
  .btn-row {
    display: flex;
    gap: 12px;
    margin-top: 32px;
  }

  .btn {
    padding: 12px 24px;
    border-radius: var(--radius);
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    cursor: pointer;
    border: none;
    transition: all 0.18s;
    letter-spacing: 0.05em;
  }

  .btn-primary {
    background: var(--accent);
    color: #0a0a0f;
    font-weight: 600;
    flex: 1;
  }

  .btn-primary:hover { background: #d8ff70; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .btn-ghost {
    background: transparent;
    color: var(--muted2);
    border: 1px solid var(--border);
  }

  .btn-ghost:hover { border-color: var(--muted2); color: var(--text); }

  /* PREVIEW PANEL */
  .preview-panel {
    padding: 40px;
    position: sticky;
    top: 57px;
    height: calc(100vh - 57px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .preview-label {
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted2);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .preview-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .proposal-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 400px;
  }

  .proposal-card::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(200,240,96,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--muted2);
    text-align: center;
    gap: 12px;
    padding: 40px;
  }

  .empty-icon {
    font-size: 2.5rem;
    opacity: 0.3;
  }

  .empty-state p {
    font-size: 0.75rem;
    line-height: 1.7;
    max-width: 220px;
  }

  /* GENERATED PROPOSAL */
  .proposal-content {
    font-size: 0.82rem;
    line-height: 1.8;
    color: var(--text);
    white-space: pre-wrap;
  }

  .proposal-header {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .proposal-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .proposal-meta {
    font-size: 0.68rem;
    color: var(--muted2);
    margin-top: 4px;
  }

  .proposal-badge {
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(200,240,96,0.12);
    border: 1px solid rgba(200,240,96,0.3);
    color: var(--accent);
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  /* LOADING */
  .loading-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
  }

  .spinner {
    width: 32px; height: 32px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-text {
    font-size: 0.75rem;
    color: var(--muted2);
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

  /* STREAMING TEXT */
  .streaming::after {
    content: '▋';
    animation: blink 0.7s step-end infinite;
    color: var(--accent);
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* COPY BTN */
  .copy-btn {
    margin-top: 20px;
    width: 100%;
    padding: 11px;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted2);
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.06em;
  }

  .copy-btn:hover { border-color: var(--accent2); color: var(--accent2); }

  /* FOOTER */
  .footer-note {
    padding: 12px 40px;
    border-top: 1px solid var(--border);
    font-size: 0.65rem;
    color: var(--muted2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    letter-spacing: 0.05em;
  }
`;

const TONES = ["Professionnel", "Chaleureux", "Direct", "Premium", "Créatif"];
const SERVICES = ["Design", "Dev Web", "Rédaction", "SEO", "Marketing", "Consulting", "Vidéo", "Photo"];

export default function App() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState([]);
  const [form, setForm] = useState({
    service: [],
    projectDesc: "",
    budget: "",
    deadline: "",
    clientName: "",
    clientCompany: "",
    clientProblem: "",
    freelanceName: "",
    tone: "Professionnel",
    extras: "",
  });
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const proposalRef = useRef("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleTag = (arr, key, val) => {
    const cur = form[key];
    set(key, cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val]);
  };

  const generate = async () => {
    setLoading(true);
    setProposal("");
    proposalRef.current = "";

    const prompt = `Tu es un expert en copywriting commercial pour freelances. 
Génère une proposition commerciale percutante et professionnelle en français, avec ce format :

---
**PROPOSITION COMMERCIALE**

**Objet :** [Titre accrocheur du projet]

**À :** ${form.clientName || "Le client"} ${form.clientCompany ? `— ${form.clientCompany}` : ""}
**De :** ${form.freelanceName || "Votre freelance"}
**Date :** ${new Date().toLocaleDateString("fr-FR")}

---

**VOTRE SITUATION**
[Reformuler le problème du client avec empathie — 2-3 phrases]

**MA SOLUTION**
[Décrire l'approche et ce qui sera livré — 3-4 phrases, concret et rassurant]

**CE QUE VOUS OBTENEZ**
• [Livrable 1]
• [Livrable 2]
• [Livrable 3]
• [Livrable 4]

**INVESTISSEMENT**
Montant : ${form.budget || "Sur devis"}
Délai : ${form.deadline || "À définir ensemble"}

**POURQUOI TRAVAILLER AVEC MOI**
[2-3 phrases qui inspirent confiance, ton ${form.tone.toLowerCase()}]

**PROCHAINE ÉTAPE**
[Appel à l'action clair et engageant]

---

Contexte :
- Services : ${form.service.join(", ") || "Non précisé"}
- Projet : ${form.projectDesc || "Non précisé"}
- Problème client : ${form.clientProblem || "Non précisé"}
- Infos complémentaires : ${form.extras || "Aucune"}
- Ton souhaité : ${form.tone}

Sois percutant, humain, et évite le jargon corporate. Maximum 400 mots.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          stream: true,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      setLoading(false);
      setStreaming(true);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done: d, value } = await reader.read();
        if (d) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data:"));
        for (const line of lines) {
          const data = line.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              proposalRef.current += parsed.delta.text;
              setProposal(proposalRef.current);
            }
          } catch {}
        }
      }
      setStreaming(false);
      setDone([0, 1, 2, 3]);
    } catch (e) {
      setLoading(false);
      setStreaming(false);
      setProposal("❌ Erreur lors de la génération. Vérifiez votre connexion.");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canGenerate = form.projectDesc.length > 10;

  const renderStep = () => {
    if (step === 0) return (
      <>
        <div className="panel-title">Le projet</div>
        <div className="panel-sub">Décris le projet pour lequel tu veux créer une proposition.</div>
        <div className="field">
          <label>Services proposés</label>
          <div className="tag-row">
            {SERVICES.map(s => (
              <span key={s} className={`tag ${form.service.includes(s) ? "selected" : ""}`}
                onClick={() => toggleTag(form.service, "service", s)}>{s}</span>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Description du projet *</label>
          <textarea placeholder="Ex: Refonte du site e-commerce, ajout d'un configurateur produit, intégration Stripe…"
            value={form.projectDesc} onChange={e => set("projectDesc", e.target.value)} />
        </div>
        <div className="row">
          <div className="field">
            <label>Budget client</label>
            <input placeholder="Ex: 2 500 €" value={form.budget} onChange={e => set("budget", e.target.value)} />
          </div>
          <div className="field">
            <label>Délai</label>
            <input placeholder="Ex: 3 semaines" value={form.deadline} onChange={e => set("deadline", e.target.value)} />
          </div>
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => setStep(1)}>Suivant →</button>
        </div>
      </>
    );

    if (step === 1) return (
      <>
        <div className="panel-title">Le client</div>
        <div className="panel-sub">Ces infos permettent de personnaliser la proposition et d'adresser directement ses douleurs.</div>
        <div className="row">
          <div className="field">
            <label>Nom du contact</label>
            <input placeholder="Marie Dupont" value={form.clientName} onChange={e => set("clientName", e.target.value)} />
          </div>
          <div className="field">
            <label>Entreprise</label>
            <input placeholder="Acme SAS" value={form.clientCompany} onChange={e => set("clientCompany", e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Problème principal du client</label>
          <textarea placeholder="Ex: Son site actuel génère peu de conversions, le tunnel d'achat est confus et le taux d'abandon est élevé…"
            value={form.clientProblem} onChange={e => set("clientProblem", e.target.value)} />
        </div>
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={() => setStep(0)}>← Retour</button>
          <button className="btn btn-primary" onClick={() => setStep(2)}>Suivant →</button>
        </div>
      </>
    );

    if (step === 2) return (
      <>
        <div className="panel-title">Ton offre</div>
        <div className="panel-sub">Personnalise le style et ajoute tes arguments différenciants.</div>
        <div className="field">
          <label>Ton prénom / nom (freelance)</label>
          <input placeholder="Alex Martin" value={form.freelanceName} onChange={e => set("freelanceName", e.target.value)} />
        </div>
        <div className="field">
          <label>Ton de la proposition</label>
          <div className="tag-row">
            {TONES.map(t => (
              <span key={t} className={`tag ${form.tone === t ? "selected" : ""}`}
                onClick={() => set("tone", t)}>{t}</span>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Arguments complémentaires (optionnel)</label>
          <textarea placeholder="Ex: 5 ans d'expérience e-commerce, client similaire chez Decathlon, garantie satisfaction 30j…"
            value={form.extras} onChange={e => set("extras", e.target.value)} />
        </div>
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={() => setStep(1)}>← Retour</button>
          <button className="btn btn-primary" disabled={!canGenerate || loading}
            onClick={() => { setStep(3); generate(); }}>
            {loading ? "Génération…" : "✦ Générer la proposition"}
          </button>
        </div>
      </>
    );

    if (step === 3) return (
      <>
        <div className="panel-title">Résultat</div>
        <div className="panel-sub">Ta proposition est visible à droite. Tu peux la copier ou recommencer.</div>
        <div style={{ background: "rgba(200,240,96,0.06)", border: "1px solid rgba(200,240,96,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.08em", marginBottom: 6 }}>✦ PROCHAINES ÉTAPES</div>
          <div style={{ fontSize: "0.78rem", lineHeight: 1.7, color: "var(--text)", opacity: 0.85 }}>
            1. Copie la proposition avec le bouton ci-dessous<br />
            2. Colle-la dans Gmail / Notion / Word<br />
            3. Ajuste 2-3 détails personnels si nécessaire<br />
            4. Envoie avec confiance 🚀
          </div>
        </div>
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={() => { setStep(0); setProposal(""); setDone([]); }}>
            ↺ Nouvelle proposition
          </button>
          <button className="btn btn-primary" onClick={() => setStep(2)}>← Modifier</button>
        </div>
      </>
    );
  };

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <span className="logo-dot" />
            ProposeAI
          </div>
          <span className="badge">Beta · IA Powered</span>
        </header>

        <div className="steps-bar">
          {STEPS.map((s, i) => (
            <div key={s} className={`step-tab ${step === i ? "active" : ""} ${done.includes(i) && step !== i ? "done" : ""}`}
              onClick={() => i < step || done.includes(i) ? setStep(i) : null}>
              <span className="step-num">{done.includes(i) && step !== i ? "✓" : i + 1}</span>
              {s}
            </div>
          ))}
        </div>

        <div className="main">
          <div className="form-panel">{renderStep()}</div>

          <div className="preview-panel">
            <div className="preview-label">Aperçu proposition</div>
            <div className="proposal-card">
              {loading && (
                <div className="loading-wrap">
                  <div className="spinner" />
                  <div className="loading-text">Rédaction en cours…</div>
                </div>
              )}
              {!loading && !proposal && (
                <div className="empty-state">
                  <div className="empty-icon">✦</div>
                  <p>Ta proposition apparaîtra ici une fois générée par l'IA.</p>
                </div>
              )}
              {!loading && proposal && (
                <>
                  <div className="proposal-header">
                    <div>
                      <div className="proposal-title">Proposition commerciale</div>
                      <div className="proposal-meta">
                        {form.clientCompany || form.clientName || "Client"} · {new Date().toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                    <span className="proposal-badge">{form.tone}</span>
                  </div>
                  <div className={`proposal-content ${streaming ? "streaming" : ""}`}>
                    {proposal}
                  </div>
                </>
              )}
            </div>
            {proposal && !loading && (
              <button className="copy-btn" onClick={copy}>
                {copied ? "✓ Copié !" : "Copier la proposition"}
              </button>
            )}
          </div>
        </div>

        <div className="footer-note">
          <span>ProposeAI · Généré avec Claude AI</span>
          <span>Gagne 2h par proposition ✦</span>
        </div>
      </div>
    </>
  );
}

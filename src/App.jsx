import { useState, useRef } from "react";

const STEPS = ["Projet", "Client", "Offre", "Résultat"];
const STRIPE_KEY = "pk_test_51TToAsQzKXermWLH7XenK6D12Ts007QCiX9ti4NlRv5JZ8aoqkCytbDbrc1B2WM7vyGEgETBRnUClQCn0xWZ4fs300Thax2jHa";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d0d14;
    --surface: #16161f;
    --border: #252535;
    --accent: #a8e060;
    --accent-dark: #7ab840;
    --text: #f0f0f8;
    --muted: #8888a8;
    --radius: 10px;
  }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    min-height: 100vh;
    font-size: 15px;
    line-height: 1.5;
  }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* HEADER */
  .header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: rgba(13,13,20,0.95);
    backdrop-filter: blur(12px);
    z-index: 100;
  }
  .logo {
    font-weight: 800;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: -0.02em;
  }
  .logo-dot {
    width: 8px; height: 8px;
    background: var(--accent);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--accent);
  }
  .badge {
    font-size: 0.7rem;
    padding: 3px 10px;
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--muted);
  }
  .header-right { display: flex; gap: 10px; align-items: center; }

  /* STEPS BAR */
  .steps-bar {
    display: flex;
    border-bottom: 1px solid var(--border);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .steps-bar::-webkit-scrollbar { display: none; }
  .step-tab {
    padding: 12px 18px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 7px;
    transition: color 0.2s;
    letter-spacing: 0;
  }
  .step-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
  .step-tab.done { color: #60c8a0; }
  .step-num {
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 1.5px solid currentColor;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem;
    font-weight: 600;
  }

  /* MAIN LAYOUT */
  .main {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
  }

  /* FORM PANEL */
  .form-panel { padding: 32px 28px; border-right: 1px solid var(--border); }
  .panel-title { font-size: 1.3rem; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.02em; }
  .panel-sub { font-size: 0.82rem; color: var(--muted); margin-bottom: 28px; line-height: 1.6; }

  /* FIELDS */
  .field { margin-bottom: 18px; }
  .field label {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--muted);
    margin-bottom: 7px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .field input, .field textarea {
    width: 100%;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 11px 14px;
    color: var(--text);
    font-family: inherit;
    font-size: 0.88rem;
    transition: border-color 0.2s;
    resize: vertical;
    outline: none;
  }
  .field input:focus, .field textarea:focus { border-color: var(--accent); }
  .field textarea { min-height: 85px; }

  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* TAGS */
  .tag-row { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 7px; }
  .tag {
    padding: 5px 12px;
    border-radius: 8px;
    border: 1.5px solid var(--border);
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    color: var(--muted);
  }
  .tag.selected { border-color: var(--accent); color: var(--accent); background: rgba(168,224,96,0.08); }

  /* BUTTONS */
  .btn-row { display: flex; gap: 10px; margin-top: 28px; }
  .btn {
    padding: 12px 20px;
    border-radius: var(--radius);
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.18s;
  }
  .btn-primary { background: var(--accent); color: #0d0d14; flex: 1; }
  .btn-primary:hover { background: #b8f070; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .btn-ghost { background: transparent; color: var(--muted); border: 1.5px solid var(--border); }
  .btn-ghost:hover { border-color: var(--muted); color: var(--text); }
  .btn-sm { padding: 8px 16px; font-size: 0.78rem; }

  /* PREVIEW PANEL */
  .preview-panel {
    padding: 28px;
    position: sticky;
    top: 53px;
    height: calc(100vh - 53px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .preview-label {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .preview-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .proposal-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 28px;
    flex: 1;
    min-height: 360px;
    position: relative;
  }
  .empty-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 100%; color: var(--muted); text-align: center; gap: 10px; padding: 32px;
  }
  .empty-icon { font-size: 2rem; opacity: 0.25; }
  .empty-state p { font-size: 0.8rem; line-height: 1.6; max-width: 200px; }

  /* PROPOSAL CONTENT */
  .proposal-header {
    margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  }
  .proposal-title { font-size: 1rem; font-weight: 700; }
  .proposal-meta { font-size: 0.72rem; color: var(--muted); margin-top: 3px; }
  .proposal-badge {
    padding: 3px 9px; border-radius: 999px;
    background: rgba(168,224,96,0.12); border: 1px solid rgba(168,224,96,0.3);
    color: var(--accent); font-size: 0.68rem; white-space: nowrap; font-weight: 500;
  }
  .proposal-content { font-size: 0.83rem; line-height: 1.75; color: var(--text); white-space: pre-wrap; }
  .streaming::after { content: '▋'; animation: blink 0.7s step-end infinite; color: var(--accent); }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* LOADING */
  .loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 14px; }
  .spinner { width: 28px; height: 28px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 0.78rem; color: var(--muted); animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

  .copy-btn {
    margin-top: 16px; width: 100%; padding: 10px;
    border-radius: var(--radius); border: 1.5px solid var(--border);
    background: transparent; color: var(--muted); font-family: inherit;
    font-size: 0.78rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
  }
  .copy-btn:hover { border-color: #60c8a0; color: #60c8a0; }

  /* FOOTER */
  .footer-note {
    padding: 12px 24px; border-top: 1px solid var(--border);
    font-size: 0.68rem; color: var(--muted);
    display: flex; align-items: center; justify-content: space-between;
  }

  /* SUCCESS BOX */
  .success-box {
    background: rgba(168,224,96,0.07);
    border: 1px solid rgba(168,224,96,0.2);
    border-radius: 10px; padding: 16px 18px; margin-bottom: 18px;
  }
  .success-box-label { font-size: 0.7rem; font-weight: 700; color: var(--accent); letter-spacing: 0.08em; margin-bottom: 8px; }
  .success-box-text { font-size: 0.8rem; line-height: 1.7; color: var(--text); opacity: 0.85; }

  /* PRICING OVERLAY */
  .pricing-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.8);
    backdrop-filter: blur(8px); z-index: 200;
    display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .pricing-box {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 18px; padding: 32px; max-width: 520px; width: 100%;
  }
  .pricing-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.02em; }
  .pricing-sub { font-size: 0.82rem; color: var(--muted); margin-bottom: 28px; line-height: 1.6; }
  .plans { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
  .plan {
    border: 1.5px solid var(--border); border-radius: 12px; padding: 20px;
    cursor: pointer; transition: all 0.2s; position: relative;
  }
  .plan:hover { border-color: var(--accent); }
  .plan.selected { border-color: var(--accent); background: rgba(168,224,96,0.05); }
  .plan-name { font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; }
  .plan-price { font-size: 1.5rem; font-weight: 800; color: var(--accent); margin: 10px 0; }
  .plan-price span { font-size: 0.75rem; color: var(--muted); font-weight: 400; }
  .plan-features { font-size: 0.75rem; color: var(--muted); line-height: 1.8; }
  .plan-badge {
    position: absolute; top: -10px; right: 14px;
    background: var(--accent); color: #0d0d14;
    font-size: 0.6rem; font-weight: 700; padding: 3px 10px; border-radius: 999px;
  }
  .pay-btn {
    width: 100%; padding: 14px; background: var(--accent); color: #0d0d14;
    border: none; border-radius: var(--radius); font-family: inherit;
    font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s;
  }
  .pay-btn:hover { background: #b8f070; transform: translateY(-1px); }
  .pricing-close {
    display: block; text-align: center; margin-top: 14px;
    font-size: 0.75rem; color: var(--muted); cursor: pointer;
  }
  .pricing-close:hover { color: var(--text); }
  .free-badge {
    display: inline-block; padding: 2px 8px; border-radius: 999px;
    background: rgba(96,200,160,0.1); border: 1px solid rgba(96,200,160,0.3);
    color: #60c8a0; font-size: 0.68rem; margin-left: 8px; font-weight: 500;
  }

  /* MOBILE */
  @media (max-width: 700px) {
    .main { grid-template-columns: 1fr; }
    .form-panel { padding: 24px 16px; border-right: none; }
    .preview-panel { display: none; }
    .header { padding: 14px 16px; }
    .badge { display: none; }
    .steps-bar { padding: 0 4px; }
    .step-tab { padding: 11px 14px; font-size: 0.72rem; }
    .row { grid-template-columns: 1fr; gap: 0; }
    .plans { grid-template-columns: 1fr; }
    .pricing-box { padding: 24px 18px; }
    .footer-note { padding: 10px 16px; flex-direction: column; gap: 4px; text-align: center; }
  }
`;

const TONES = ["Professionnel", "Chaleureux", "Direct", "Premium", "Créatif"];
const SERVICES = ["Design", "Dev Web", "Rédaction", "SEO", "Marketing", "Consulting", "Vidéo", "Photo"];

export default function App() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState([]);
  const [form, setForm] = useState({
    service: [], projectDesc: "", budget: "", deadline: "",
    clientName: "", clientCompany: "", clientProblem: "",
    freelanceName: "", tone: "Professionnel", extras: ""
  });
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [proposalCount, setProposalCount] = useState(0);
  const proposalRef = useRef("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleTag = (key, val) => {
    const cur = form[key];
    set(key, cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val]);
  };

  const handleGenerate = () => {
    if (proposalCount >= 1) { setShowPricing(true); return; }
    setStep(3);
    generate();
  };

  const generate = async () => {
    setLoading(true);
    setProposal("");
    proposalRef.current = "";

    const prompt = `Tu es un expert en copywriting commercial pour freelances. 
Génère une proposition commerciale percutante et professionnelle en français :

---
**PROPOSITION COMMERCIALE**
**Objet :** [Titre accrocheur]
**À :** ${form.clientName || "Le client"} ${form.clientCompany ? `— ${form.clientCompany}` : ""}
**De :** ${form.freelanceName || "Votre freelance"}
**Date :** ${new Date().toLocaleDateString("fr-FR")}
---
**VOTRE SITUATION**
[Reformuler le problème avec empathie — 2-3 phrases]

**MA SOLUTION**
[Décrire l'approche — 3-4 phrases concrètes]

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
[Appel à l'action clair]

---
Services : ${form.service.join(", ") || "Non précisé"}
Projet : ${form.projectDesc}
Problème client : ${form.clientProblem || "Non précisé"}
Extras : ${form.extras || "Aucun"}
Ton : ${form.tone}
Maximum 400 mots.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000, stream: true,
          messages: [{ role: "user", content: prompt }]
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
      setProposalCount(c => c + 1);
    } catch {
      setLoading(false);
      setStreaming(false);
      setProposal("❌ Erreur lors de la génération. Réessaie.");
    }
  };

  const handlePayment = async () => {
    const price = selectedPlan === "starter" ? 1900 : 4900;
    const label = selectedPlan === "starter" ? "ProposeAI Starter" : "ProposeAI Pro";
    const stripe = window.Stripe(STRIPE_KEY);
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price_data: { currency: "eur", product_data: { name: label }, unit_amount: price, recurring: { interval: "month" } }, quantity: 1 }],
      mode: "subscription",
      successUrl: window.location.origin + "?success=1",
      cancelUrl: window.location.origin,
    });
    if (error) alert(error.message);
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
                onClick={() => toggleTag("service", s)}>{s}</span>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Description du projet *</label>
          <textarea placeholder="Ex: Refonte du site e-commerce, intégration Stripe…"
            value={form.projectDesc} onChange={e => set("projectDesc", e.target.value)} />
        </div>
        <div className="row">
          <div className="field"><label>Budget client</label><input placeholder="Ex: 2 500 €" value={form.budget} onChange={e => set("budget", e.target.value)} /></div>
          <div className="field"><label>Délai</label><input placeholder="Ex: 3 semaines" value={form.deadline} onChange={e => set("deadline", e.target.value)} /></div>
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => setStep(1)}>Suivant →</button>
        </div>
      </>
    );

    if (step === 1) return (
      <>
        <div className="panel-title">Le client</div>
        <div className="panel-sub">Ces infos permettent de personnaliser la proposition.</div>
        <div className="row">
          <div className="field"><label>Nom du contact</label><input placeholder="Marie Dupont" value={form.clientName} onChange={e => set("clientName", e.target.value)} /></div>
          <div className="field"><label>Entreprise</label><input placeholder="Acme SAS" value={form.clientCompany} onChange={e => set("clientCompany", e.target.value)} /></div>
        </div>
        <div className="field">
          <label>Problème principal du client</label>
          <textarea placeholder="Ex: Son site génère peu de conversions…" value={form.clientProblem} onChange={e => set("clientProblem", e.target.value)} />
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
        <div className="panel-sub">
          Choisis le ton de ta proposition.
          {proposalCount === 0 && <span className="free-badge">1 essai gratuit</span>}
          {proposalCount >= 1 && <span style={{color:"var(--accent)", fontSize:"0.75rem", marginLeft:8, fontWeight:600}}>Abonnement requis</span>}
        </div>
        <div className="field"><label>Ton prénom / nom</label><input placeholder="Alex Martin" value={form.freelanceName} onChange={e => set("freelanceName", e.target.value)} /></div>
        <div className="field">
          <label>Ton de la proposition</label>
          <div className="tag-row">
            {TONES.map(t => (
              <span key={t} className={`tag ${form.tone === t ? "selected" : ""}`} onClick={() => set("tone", t)}>{t}</span>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Arguments complémentaires (optionnel)</label>
          <textarea placeholder="Ex: 5 ans d'expérience, garantie satisfaction…" value={form.extras} onChange={e => set("extras", e.target.value)} />
        </div>
        <div className="btn-row">
          <button className="btn btn-ghost" onClick={() => setStep(1)}>← Retour</button>
          <button className="btn btn-primary" disabled={!canGenerate || loading} onClick={handleGenerate}>
            {proposalCount >= 1 ? "🔒 S'abonner" : "✦ Générer gratuitement"}
          </button>
        </div>
      </>
    );

    if (step === 3) return (
      <>
        <div className="panel-title">Résultat</div>
        <div className="panel-sub">Ta proposition est prête.</div>
        <div className="success-box">
          <div className="success-box-label">✦ PROCHAINES ÉTAPES</div>
          <div className="success-box-text">
            1. Copie la proposition ci-dessous<br />
            2. Colle-la dans Gmail / Notion / Word<br />
            3. Envoie avec confiance 🚀
          </div>
        </div>
        {proposal && (
          <div style={{background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:10, padding:18, marginBottom:16, fontSize:"0.82rem", lineHeight:1.75, whiteSpace:"pre-wrap", maxHeight:320, overflowY:"auto"}}>
            {proposal}
          </div>
        )}
        {loading && <div className="loading-wrap" style={{height:120}}><div className="spinner"/><div className="loading-text">Rédaction en cours…</div></div>}
        {proposal && <button className="copy-btn" onClick={copy}>{copied ? "✓ Copié !" : "📋 Copier la proposition"}</button>}
        <div className="btn-row" style={{marginTop:16}}>
          <button className="btn btn-ghost" onClick={() => { setStep(0); setProposal(""); setDone([]); }}>↺ Nouvelle</button>
          <button className="btn btn-primary" onClick={() => setShowPricing(true)}>⚡ S'abonner</button>
        </div>
      </>
    );
  };

  return (
    <>
      <style>{FONTS + CSS}</style>
      <script src="https://js.stripe.com/v3/" async />

      {showPricing && (
        <div className="pricing-overlay">
          <div className="pricing-box">
            <div className="pricing-title">Passez au niveau supérieur</div>
            <div className="pricing-sub">Propositions illimitées. Chaque client gagné vaut 10x l'abonnement.</div>
            <div className="plans">
              <div className={`plan ${selectedPlan === "starter" ? "selected" : ""}`} onClick={() => setSelectedPlan("starter")}>
                <div className="plan-name">Starter</div>
                <div className="plan-price">19€ <span>/mois</span></div>
                <div className="plan-features">✓ 5 propositions/mois<br />✓ Tous les tons<br />✓ Export texte</div>
              </div>
              <div className={`plan ${selectedPlan === "pro" ? "selected" : ""}`} onClick={() => setSelectedPlan("pro")}>
                <div className="plan-badge">POPULAIRE</div>
                <div className="plan-name">Pro</div>
                <div className="plan-price">49€ <span>/mois</span></div>
                <div className="plan-features">✓ Illimité<br />✓ Priorité IA<br />✓ Support dédié</div>
              </div>
            </div>
            <button className="pay-btn" onClick={handlePayment}>
              Commencer — {selectedPlan === "starter" ? "19€" : "49€"}/mois
            </button>
            <span className="pricing-close" onClick={() => setShowPricing(false)}>Continuer sans abonnement</span>
          </div>
        </div>
      )}

      <div className="app">
        <header className="header">
          <div className="logo"><span className="logo-dot"/>ProposeAI</div>
          <div className="header-right">
            <span className="badge">Beta · IA</span>
            <button className="btn btn-primary btn-sm" onClick={() => setShowPricing(true)}>S'abonner</button>
          </div>
        </header>

        <div className="steps-bar">
          {STEPS.map((s, i) => (
            <div key={s} className={`step-tab ${step === i ? "active" : ""} ${done.includes(i) && step !== i ? "done" : ""}`}
              onClick={() => (i < step || done.includes(i)) ? setStep(i) : null}>
              <span className="step-num">{done.includes(i) && step !== i ? "✓" : i + 1}</span>{s}
            </div>
          ))}
        </div>

        <div className="main">
          <div className="form-panel">{renderStep()}</div>
          <div className="preview-panel">
            <div className="preview-label">Aperçu proposition</div>
            <div className="proposal-card">
              {loading && <div className="loading-wrap"><div className="spinner"/><div className="loading-text">Rédaction en cours…</div></div>}
              {!loading && !proposal && <div className="empty-state"><div className="empty-icon">✦</div><p>Ta proposition apparaîtra ici une fois générée.</p></div>}
              {!loading && proposal && (
                <>
                  <div className="proposal-header">
                    <div>
                      <div className="proposal-title">Proposition commerciale</div>
                      <div className="proposal-meta">{form.clientCompany || form.clientName || "Client"} · {new Date().toLocaleDateString("fr-FR")}</div>
                    </div>
                    <span className="proposal-badge">{form.tone}</span>
                  </div>
                  <div className={`proposal-content ${streaming ? "streaming" : ""}`}>{proposal}</div>
                </>
              )}
            </div>
            {proposal && !loading && <button className="copy-btn" onClick={copy}>{copied ? "✓ Copié !" : "Copier la proposition"}</button>}
          </div>
        </div>

        <div className="footer-note">
          <span>ProposeAI · Propulsé par Claude AI</span>
          <span>Gagne 2h par proposition ✦</span>
        </div>
      </div>
    </>
  );
}

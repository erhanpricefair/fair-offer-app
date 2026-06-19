import { useState } from "react";

const SUBURB_DATA = {
  "richmond": { house: 1420000, unit: 680000, growth: 3.2, competition: "very high", daysOnMarket: 18 },
  "fitzroy": { house: 1650000, unit: 720000, growth: 4.1, competition: "very high", daysOnMarket: 16 },
  "collingwood": { house: 1480000, unit: 650000, growth: 3.8, competition: "high", daysOnMarket: 20 },
  "brunswick": { house: 1280000, unit: 560000, growth: 3.5, competition: "high", daysOnMarket: 22 },
  "northcote": { house: 1350000, unit: 590000, growth: 3.9, competition: "high", daysOnMarket: 19 },
  "prahran": { house: 1520000, unit: 710000, growth: 3.3, competition: "very high", daysOnMarket: 17 },
  "south yarra": { house: 1780000, unit: 780000, growth: 2.9, competition: "very high", daysOnMarket: 21 },
  "st kilda": { house: 1390000, unit: 620000, growth: 2.7, competition: "high", daysOnMarket: 24 },
  "hawthorn": { house: 1920000, unit: 740000, growth: 3.1, competition: "very high", daysOnMarket: 19 },
  "camberwell": { house: 1750000, unit: 680000, growth: 3.4, competition: "very high", daysOnMarket: 18 },
  "malvern": { house: 2100000, unit: 760000, growth: 2.8, competition: "very high", daysOnMarket: 22 },
  "toorak": { house: 4200000, unit: 1100000, growth: 2.1, competition: "very high", daysOnMarket: 35 },
  "armadale": { house: 2350000, unit: 820000, growth: 2.6, competition: "very high", daysOnMarket: 28 },
  "glen waverley": { house: 1180000, unit: 620000, growth: 4.8, competition: "very high", daysOnMarket: 16 },
  "box hill": { house: 1090000, unit: 580000, growth: 5.1, competition: "very high", daysOnMarket: 15 },
  "doncaster": { house: 1150000, unit: 640000, growth: 4.2, competition: "high", daysOnMarket: 20 },
  "brighton": { house: 2400000, unit: 880000, growth: 2.4, competition: "very high", daysOnMarket: 30 },
  "sandringham": { house: 1650000, unit: 720000, growth: 3.0, competition: "high", daysOnMarket: 25 },
  "bayside": { house: 1820000, unit: 760000, growth: 2.8, competition: "high", daysOnMarket: 27 },
  "frankston": { house: 680000, unit: 420000, growth: 5.8, competition: "medium", daysOnMarket: 28 },
  "werribee": { house: 590000, unit: 390000, growth: 6.2, competition: "medium", daysOnMarket: 30 },
  "point cook": { house: 720000, unit: 450000, growth: 5.5, competition: "medium", daysOnMarket: 26 },
  "craigieburn": { house: 620000, unit: 410000, growth: 6.8, competition: "medium", daysOnMarket: 29 },
  "essendon": { house: 1380000, unit: 620000, growth: 3.6, competition: "high", daysOnMarket: 21 },
  "moonee ponds": { house: 1250000, unit: 580000, growth: 3.9, competition: "high", daysOnMarket: 20 },
  "williamstown": { house: 1320000, unit: 640000, growth: 3.2, competition: "high", daysOnMarket: 23 },
  "newport": { house: 1180000, unit: 580000, growth: 3.7, competition: "high", daysOnMarket: 22 },
  "footscray": { house: 890000, unit: 490000, growth: 5.2, competition: "high", daysOnMarket: 19 },
  "yarraville": { house: 980000, unit: 520000, growth: 4.8, competition: "high", daysOnMarket: 20 },
  "reservoir": { house: 820000, unit: 470000, growth: 5.6, competition: "high", daysOnMarket: 18 },
  "preston": { house: 910000, unit: 500000, growth: 5.1, competition: "high", daysOnMarket: 19 },
  "heidelberg": { house: 980000, unit: 520000, growth: 4.4, competition: "medium", daysOnMarket: 23 },
  "templestowe": { house: 1280000, unit: 660000, growth: 3.8, competition: "high", daysOnMarket: 24 },
  "ringwood": { house: 880000, unit: 520000, growth: 4.9, competition: "medium", daysOnMarket: 25 },
  "croydon": { house: 820000, unit: 490000, growth: 5.0, competition: "medium", daysOnMarket: 26 },
  "berwick": { house: 750000, unit: 480000, growth: 5.3, competition: "medium", daysOnMarket: 27 },
  "pakenham": { house: 620000, unit: 400000, growth: 6.1, competition: "medium", daysOnMarket: 29 },
  "newport": { house: 1180000, unit: 580000, growth: 3.7, competition: "high", daysOnMarket: 22 },
};

const BEDROOM_ADJUSTMENTS = { 1: -0.32, 2: -0.12, 3: 0, 4: 0.22, 5: 0.42 };

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  return `$${(n / 1000).toFixed(0)}k`;
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function getPricePosition(listing, low, high) {
  if (listing < low * 0.95) return { label: "Underpriced", color: "#1B6B45", bg: "#E6F4ED", icon: "↓" };
  if (listing <= high * 1.02) return { label: "Fairly Priced", color: "#1B6B45", bg: "#E6F4ED", icon: "✓" };
  if (listing <= high * 1.10) return { label: "Slightly High", color: "#C47A0A", bg: "#FDF3E7", icon: "⚠" };
  return { label: "Overpriced", color: "#C0392B", bg: "#FDECEA", icon: "✕" };
}

function getStrategies(pos, comp, dom, listing, low, high, open, walk) {
  if (pos === "Overpriced") {
    const gap = ((listing - high) / listing * 100).toFixed(1);
    return [
      `The listing is ${gap}% above fair market value. Open with a written offer at ${fmt(open)} with a 24–48 hour expiry. This anchors the negotiation on your terms.`,
      `Request the vendor's comparable sales evidence. If they cannot justify the price with real sold data, you have leverage to hold firm.`,
      `Your walk-away number is ${fmt(walk)}. Do not exceed this. If the vendor won't move, the market will eventually prove them wrong.`
    ];
  }
  if (pos === "Slightly High") return [
    `The property is priced slightly above fair value. Open at ${fmt(open)} and signal you're a serious buyer — finance pre-approved, flexible on settlement.`,
    `Use days on market as leverage. At ${dom} average days in this suburb, a longer-listed property means the vendor is feeling pressure.`,
    `Your walk-away number is ${fmt(walk)}. Above this you're paying a premium the market doesn't support.`
  ];
  if (pos === "Fairly Priced") return [
    `The property is fairly priced. In a ${comp} competition market, move quickly. Open at ${fmt(open)} with strong terms — short settlement, pre-approved finance.`,
    `Don't low-ball. You risk losing the property for a small saving. Focus on terms: settlement date, inclusions, and conditions.`,
    `Your walk-away is ${fmt(walk)}. Above this you're paying above market with no data to support it.`
  ];
  return [
    `This property appears underpriced. Move fast — competition will be strong. Open at or near asking price and focus on terms over price.`,
    `Book a building and pest inspection immediately. Underpriced properties sometimes carry issues that explain the price.`,
    `Your walk-away is ${fmt(walk)}. Even if bidding goes above asking, you have room before hitting the fair value ceiling.`
  ];
}

function getRisks(comp, dom, listing, high) {
  const risks = [];
  if (comp === "very high") risks.push({ level: "high", text: "Very high competition suburb — expect multiple offers or strong auction competition." });
  if (listing > high * 1.08) risks.push({ level: "high", text: `Bank valuation risk: lenders may value this property lower than your offer. A gap of ${fmt(listing - high)} could affect your lending approval.` });
  if (dom < 20 && comp === "very high") risks.push({ level: "medium", text: "Properties in this suburb sell fast. Delays in decision-making typically cost buyers the deal." });
  risks.push({ level: "medium", text: "Always obtain a building and pest inspection before going unconditional, regardless of price." });
  risks.push({ level: "low", text: "Review the section 32 vendor statement for encumbrances, easements, or zoning overlays." });
  return risks;
}

export default function App() {
  const [step, setStep] = useState("home");
  const [form, setForm] = useState({ suburb: "", propertyType: "house", bedrooms: "3", listingPrice: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [consultSent, setConsultSent] = useState(false);
  const [consultName, setConsultName] = useState("");
  const [consultPhone, setConsultPhone] = useState("");

  const G = "#1B6B45", AM = "#E8943A", CR = "#F7F5F1", DK = "#1A1A1A", MD = "#4A4A4A";

  const s = {
    app: { fontFamily: "'Inter', -apple-system, sans-serif", background: CR, minHeight: "100vh", color: DK, maxWidth: 480, margin: "0 auto" },
    hero: { background: G, padding: "32px 20px 40px" },
    heroEye: { fontSize: 11, fontWeight: 700, color: AM, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10 },
    heroH1: { fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 14 },
    heroSub: { fontSize: 15, color: "rgba(255,255,255,.8)", lineHeight: 1.6, marginBottom: 28 },
    heroBtn: { background: AM, color: "#fff", border: "none", borderRadius: 12, padding: 16, fontSize: 17, fontWeight: 700, cursor: "pointer", width: "100%" },
    trust: { background: "#fff", display: "flex", borderBottom: "1px solid #E8E4DF" },
    trustItem: { flex: 1, textAlign: "center", padding: "14px 8px" },
    trustN: { fontSize: 15, fontWeight: 900, color: G },
    trustL: { fontSize: 10, color: MD, textTransform: "uppercase", letterSpacing: ".5px", marginTop: 2 },
    sec: { padding: "24px 20px" },
    lbl: { fontSize: 12, fontWeight: 700, color: MD, letterSpacing: ".3px", marginBottom: 7, display: "block", textTransform: "uppercase" },
    inp: { width: "100%", padding: "13px 14px", borderRadius: 10, border: "1.5px solid #D8D4CF", fontSize: 16, background: "#fff", color: DK, boxSizing: "border-box", outline: "none", fontFamily: "inherit" },
    sel: { width: "100%", padding: "13px 14px", borderRadius: 10, border: "1.5px solid #D8D4CF", fontSize: 16, background: "#fff", color: DK, boxSizing: "border-box", outline: "none", appearance: "none", fontFamily: "inherit" },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    fg: { marginBottom: 18 },
    err: { background: "#FDECEA", border: "1px solid #F5C6C2", borderRadius: 8, padding: "11px 13px", fontSize: 13, color: "#C0392B", marginBottom: 14 },
    aBtn: { background: G, color: "#fff", border: "none", borderRadius: 12, padding: 16, fontSize: 17, fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "inherit" },
    hdr: { background: G, padding: "16px 20px 12px", position: "sticky", top: 0, zIndex: 10 },
    back: { background: "none", border: "none", color: "rgba(255,255,255,.75)", fontSize: 13, cursor: "pointer", padding: "0 0 6px", display: "block", fontFamily: "inherit" },
    hdrLogo: { fontSize: 19, fontWeight: 800, color: "#fff" },
    hdrSub: { fontSize: 11, color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: ".5px", marginTop: 2 },
    card: { background: "#fff", borderRadius: 12, padding: 18, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,.06)" },
    cardTitle: { fontSize: 12, fontWeight: 700, color: MD, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 14 },
    ctaCard: { background: G, borderRadius: 14, padding: "22px 18px", marginBottom: 20 },
    ctaInp: { width: "100%", padding: "13px 14px", borderRadius: 10, border: "none", fontSize: 15, background: "rgba(255,255,255,.15)", color: "#fff", marginBottom: 8, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
    ctaBtn: { background: AM, color: "#fff", border: "none", borderRadius: 12, padding: 15, fontSize: 16, fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "inherit" },
    footer: { background: "#fff", borderTop: "1px solid #E8E4DF", padding: "18px 20px", textAlign: "center", fontSize: 12, color: MD, lineHeight: 1.7 },
  };

  const goTo = (screen) => { setStep(screen); window.scrollTo(0, 0); };

  const analyse = () => {
    setError("");
    const key = form.suburb.toLowerCase().trim();
    const data = SUBURB_DATA[key];
    if (!data) { setError("Suburb not found. Try Hawthorn, Brunswick, Frankston, or Richmond."); return; }
    const base = form.propertyType === "house" ? data.house : data.unit;
    const adj = BEDROOM_ADJUSTMENTS[parseInt(form.bedrooms)] || 0;
    const mid = Math.round(base * (1 + adj) / 1000) * 1000;
    const low = Math.round(mid * 0.92 / 1000) * 1000;
    const high = Math.round(mid * 1.08 / 1000) * 1000;
    const listing = parseInt(form.listingPrice.replace(/[^0-9]/g, ""));
    if (!listing || listing < 100000) { setError("Please enter a valid listing price."); return; }
    const pos = getPricePosition(listing, low, high);
    const open = Math.round(low * 0.97 / 1000) * 1000;
    const walk = Math.round(high * 1.03 / 1000) * 1000;
    const strategies = getStrategies(pos.label, data.competition, data.daysOnMarket, listing, low, high, open, walk);
    const risks = getRisks(data.competition, data.daysOnMarket, listing, high);
    const needsPro = pos.label === "Overpriced" || pos.label === "Slightly High" || data.competition === "very high";
    setResult({ low, high, mid, pos, strategies, open, walk, risks, needsPro, listing, data, suburb: form.suburb, propertyType: form.propertyType, bedrooms: form.bedrooms });
    goTo("result");
  };

  const sendConsult = () => {
    if (!consultName.trim()) return;
    const sub = encodeURIComponent(`Fair Offer App — Consultation Request from ${consultName}`);
    const body = encodeURIComponent(`Hi Erhan,\n\nI used the Fair Offer App and would like a free consultation.\n\nSuburb: ${result.suburb}\nType: ${result.propertyType}\nBedrooms: ${result.bedrooms}\nListing Price: ${fmt(result.listing)}\nFair Value: ${fmt(result.low)} – ${fmt(result.high)}\nVerdict: ${result.pos.label}\n\nName: ${consultName}\nPhone: ${consultPhone || "Not provided"}\n\nPlease contact me.\n\nThank you.`);
    window.location.href = `mailto:erhan@newpfproperty.com.au?subject=${sub}&body=${body}`;
    setConsultSent(true);
  };

  if (step === "home") return (
    <div style={s.app}>
      <div style={s.hero}>
        <p style={s.heroEye}>Melbourne Property Tool</p>
        <h1 style={s.heroH1}>Is the price fair?</h1>
        <p style={s.heroSub}>Get a free price check and negotiation strategy for any Melbourne property — in under 60 seconds.</p>
        <button style={s.heroBtn} onClick={() => goTo("form")}>Check a Property →</button>
      </div>
      <div style={s.trust}>
        {[["Buyer", "Side Only"], ["Fixed", "Fee Only"], ["Free", "Price Check"]].map(([n, l]) => (
          <div key={n} style={s.trustItem}><div style={s.trustN}>{n}</div><div style={s.trustL}>{l}</div></div>
        ))}
      </div>
      <div style={s.sec}>
        <p style={{ fontSize: 12, fontWeight: 700, color: MD, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 16 }}>How it works</p>
        {[["Enter the details", "Suburb, property type, bedrooms, and the asking price."], ["Get your price check", "We compare the listing against suburb median data."], ["Get your strategy", "Opening offer, walk-away number, and what to say."], ["Talk to an expert", "Complex deal? Book a free NewPF consultation."]].map(([title, desc], i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
            <div style={{ background: G, color: "#fff", borderRadius: "50%", width: 30, height: 30, minWidth: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{i + 1}</div>
            <div><p style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, color: DK }}>{title}</p><p style={{ fontSize: 13, color: MD, lineHeight: 1.5 }}>{desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ background: "#E6F4ED", borderRadius: 12, padding: 14, borderLeft: `4px solid ${G}` }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: G, marginBottom: 4 }}>Built by NewPF Business Group</p>
          <p style={{ fontSize: 13, color: MD, lineHeight: 1.5 }}>Melbourne's buyer-side property negotiation service. We work for buyers only. Fixed fee. No commission.</p>
        </div>
      </div>
      <div style={s.footer}>
        <a href="mailto:erhan@newpfproperty.com.au" style={{ color: G, fontWeight: 600 }}>erhan@newpfproperty.com.au</a><br />
        <a href="https://newpfproperty.com.au" style={{ color: G, fontWeight: 600 }}>newpfproperty.com.au</a>
      </div>
    </div>
  );

  if (step === "form") return (
    <div style={s.app}>
      <div style={s.hdr}>
        <button style={s.back} onClick={() => goTo("home")}>← Back</button>
        <div style={s.hdrLogo}>Fair Offer</div>
        <div style={s.hdrSub}>Property Price Check</div>
      </div>
      <div style={s.sec}>
        <p style={{ fontSize: 21, fontWeight: 900, marginBottom: 5, letterSpacing: "-.5px" }}>Check this property</p>
        <p style={{ fontSize: 14, color: MD, marginBottom: 22, lineHeight: 1.5 }}>Enter the details to get your free price check and negotiation strategy.</p>
        {error && <div style={s.err}>{error}</div>}
        <div style={s.fg}><label style={s.lbl}>Melbourne Suburb</label><input style={s.inp} placeholder="e.g. Hawthorn, Brunswick, Frankston" value={form.suburb} onChange={e => setForm({ ...form, suburb: e.target.value })} /></div>
        <div style={{ ...s.row, ...s.fg }}>
          <div><label style={s.lbl}>Property Type</label><select style={s.sel} value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })}><option value="house">House</option><option value="unit">Unit / Apt</option></select></div>
          <div><label style={s.lbl}>Bedrooms</label><select style={s.sel} value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n} bed</option>)}</select></div>
        </div>
        <div style={s.fg}><label style={s.lbl}>Asking Price</label><input style={s.inp} placeholder="e.g. 1200000" value={form.listingPrice} onChange={e => setForm({ ...form, listingPrice: e.target.value })} inputMode="numeric" /><p style={{ fontSize: 11, color: MD, marginTop: 5 }}>Enter without $ or commas</p></div>
        <button style={s.aBtn} onClick={analyse}>Analyse This Property →</button>
        <p style={{ fontSize: 11, color: MD, textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>Based on Melbourne suburb median data. Not a formal valuation.</p>
      </div>
    </div>
  );

  if (step === "result" && result) {
    const rc = { high: "#C0392B", medium: AM, low: G };
    return (
      <div style={s.app}>
        <div style={{ ...s.hdr, background: result.pos.color === "#C0392B" ? "#C0392B" : G }}>
          <button style={s.back} onClick={() => goTo("form")}>← Check another</button>
          <div style={s.hdrLogo}>Fair Offer</div>
          <div style={s.hdrSub}>Price Analysis</div>
        </div>
        <div style={{ background: result.pos.bg, padding: "22px 20px 18px" }}>
          <span style={{ background: "rgba(0,0,0,.08)", borderRadius: 20, padding: "4px 11px", fontSize: 11, color: result.pos.color, display: "inline-block", marginBottom: 14, fontWeight: 700 }}>{cap(result.suburb)} · {result.bedrooms}bd {result.propertyType}</span>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6, color: result.pos.color }}>{result.pos.icon} Verdict</p>
          <p style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-.5px", marginBottom: 3, color: result.pos.color }}>{result.pos.label}</p>
          <p style={{ fontSize: 14, color: result.pos.color, opacity: .8 }}>Listing: {fmt(result.listing)}</p>
        </div>
        <div style={s.sec}>
          <div style={s.card}>
            <p style={s.cardTitle}>Fair Value Range</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div><p style={{ fontSize: 11, color: MD, marginBottom: 2, textTransform: "uppercase", letterSpacing: ".5px" }}>Low</p><span style={{ fontSize: 22, fontWeight: 900, color: G }}>{fmt(result.low)}</span></div>
              <span style={{ fontSize: 13, color: MD }}>—</span>
              <div style={{ textAlign: "right" }}><p style={{ fontSize: 11, color: MD, marginBottom: 2, textTransform: "uppercase", letterSpacing: ".5px" }}>High</p><span style={{ fontSize: 22, fontWeight: 900, color: DK }}>{fmt(result.high)}</span></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: "1px solid #F0EDE8" }}>
              <span style={{ fontSize: 13, color: MD }}>Listing price</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: result.pos.color }}>{fmt(result.listing)}</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={{ ...s.card, textAlign: "center", marginBottom: 0 }}><p style={{ fontSize: 11, color: MD, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>Open At</p><p style={{ fontSize: 21, fontWeight: 900, color: G }}>{fmt(result.open)}</p></div>
            <div style={{ ...s.card, textAlign: "center", marginBottom: 0 }}><p style={{ fontSize: 11, color: MD, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>Walk Away</p><p style={{ fontSize: 21, fontWeight: 900, color: "#C0392B" }}>{fmt(result.walk)}</p></div>
          </div>
          <div style={s.card}>
            <p style={s.cardTitle}>Your Negotiation Strategy</p>
            {result.strategies.map((st, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                <div style={{ background: G, color: "#fff", borderRadius: "50%", width: 22, height: 22, minWidth: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: DK }}>{st}</p>
              </div>
            ))}
          </div>
          <div style={s.card}>
            <p style={s.cardTitle}>Market Context</p>
            {[["Competition", cap(result.data.competition)], ["Avg. Days on Market", `${result.data.daysOnMarket} days`], ["Annual Growth", `${result.data.growth}%`]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #F0EDE8", fontSize: 14 }}>
                <span style={{ color: MD }}>{l}</span><span style={{ fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={s.card}>
            <p style={s.cardTitle}>Risk Flags</p>
            {result.risks.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: rc[r.level], marginTop: 5, minWidth: 8 }} />
                <p style={{ fontSize: 13, lineHeight: 1.5, color: DK }}>{r.text}</p>
              </div>
            ))}
          </div>
          {!consultSent ? (
            <div style={s.ctaCard}>
              <p style={{ fontSize: 19, fontWeight: 900, color: "#fff", marginBottom: 7, letterSpacing: "-.3px" }}>{result.needsPro ? "This deal needs expert eyes." : "Want a second opinion?"}</p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", lineHeight: 1.6, marginBottom: 18 }}>{result.needsPro ? "This property has characteristics that typically need professional negotiation. Book a free NewPF consultation — no obligation." : "Book a free consultation with NewPF and we'll pressure-test this deal with you."}</p>
              <input style={s.ctaInp} placeholder="Your name" value={consultName} onChange={e => setConsultName(e.target.value)} />
              <input style={s.ctaInp} placeholder="Your phone (optional)" value={consultPhone} onChange={e => setConsultPhone(e.target.value)} />
              <button style={s.ctaBtn} onClick={sendConsult}>Book Free Consultation →</button>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,.55)", textAlign: "center", marginTop: 10 }}>Free. No obligation. Buyer side only.</p>
            </div>
          ) : (
            <div style={{ ...s.ctaCard, textAlign: "center" }}>
              <p style={{ fontSize: 36, marginBottom: 10 }}>✓</p>
              <p style={{ fontSize: 19, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Sent to Erhan</p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", lineHeight: 1.5 }}>Check your email app — it should open automatically. Erhan will be in touch shortly.</p>
            </div>
          )}
          <div style={s.footer}>
            Fair Offer is built by <a href="https://newpfproperty.com.au" style={{ color: G, fontWeight: 600 }}>NewPF Business Group</a><br />
            Buyer-side · Melbourne · Fixed fee only<br />
            Estimates based on public suburb median data. Not a formal valuation.
          </div>
        </div>
      </div>
    );
  }

  return null;
}

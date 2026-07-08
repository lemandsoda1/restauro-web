import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Button, ButtonLink, Eyebrow, WorkCard, Badge, Plate, Icon } from "../ds";
import { useSiteContent } from "../lib/content";

/* ---- Overlay header: transparent white over the hero, solid on scroll ---- */
function SiteHeader() {
  const { user, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [["Services", "#leistungen"], ["Referenzen", "#atelier"], ["Werkstätte", "#ablauf"]];
  const ctaVariant = scrolled ? "primary" : "hero";
  return (
    <header className={`rst-header rst-header--overlay ${scrolled ? "rst-header--scrolled" : "rst-header--hero"}`}>
      <div className="rst-header__bar">
        <Link to="/" className="rst-hero-wordmark">Westermeier<br />Restaurierung</Link>
        <nav className="rst-header__nav">
          {links.map(([l, href]) => <a key={l} href={href}>{l}</a>)}
        </nav>
        <div className="rst-header__actions">
          {user ? (
            <ButtonLink as={Link} to={isAdmin ? "/admin" : "/dashboard"} size="sm" variant={ctaVariant}>Zum Portal</ButtonLink>
          ) : (
            <>
              <Link to="/login" className="rst-header__signin">Anmelden</Link>
              <ButtonLink as={Link} to="/anfrage" size="sm" variant={ctaVariant}>Angebot erhalten</ButtonLink>
            </>
          )}
          <button className="rst-header__menu rst-iconbtn rst-iconbtn--md" aria-label="Menü" onClick={() => setMenuOpen((o) => !o)}>
            <Icon name={menuOpen ? "x" : "menu"} size={22} />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "8px 24px 16px" }}>
          {links.map(([l, href]) => (
            <a key={l} href={href} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "10px 0", fontFamily: "var(--font-grotesque)", fontWeight: 500, color: "var(--stone-700)" }}>{l}</a>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <ButtonLink as={Link} to="/login" variant="outline" size="sm" block>Anmelden</ButtonLink>
            <ButtonLink as={Link} to="/anfrage" size="sm" block>Angebot erhalten</ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}

/** Render "… seit 1989" with an italic tail when present. */
function HeroTitle({ title }) {
  const idx = title.indexOf(" seit ");
  if (idx === -1) return <>{title}</>;
  return <>{title.slice(0, idx + 1)}<em>{title.slice(idx + 1)}</em></>;
}

function Hero({ content }) {
  return (
    <>
      <section className="rst-hero-full">
        <div className="rst-hero-full__scrim" />
        <div className="rst-hero-full__inner">
          <h1 className="rst-hero-full__title"><HeroTitle title={content.hero.title} /></h1>
          <p className="rst-hero-full__lede">{content.hero.lede}</p>
          <div className="rst-hero-full__cta">
            <ButtonLink as={Link} to="/anfrage" size="lg" variant="accent" endIcon={<Icon name="arrow-right" size={16} />}>
              Fotos hochladen & Angebot erhalten
            </ButtonLink>
            <ButtonLink as="a" href="#ablauf" size="lg" variant="hero">So funktioniert es</ButtonLink>
          </div>
        </div>
      </section>
      <section className="rst-statsbar">
        <div className="rst-statsbar__inner">
          {content.stats.map((s, i) => (
            <div key={i}>
              <div className="rst-statsbar__n">{s.n}</div>
              <div className="rst-statsbar__l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Services({ content }) {
  return (
    <section id="leistungen" className="rst-section--surface">
      <div className="rst-section">
        <div className="rst-sec-head">
          <div>
            <Eyebrow>Was wir tun</Eyebrow>
            <h2 className="rst-sec-title">Leistungen</h2>
          </div>
        </div>
        <div className="rst-services">
          {content.services.map((s, i) => (
            <div key={i} className="rst-service">
              <div className="rst-service__icon"><Icon name={s.icon || "sparkles"} size={22} /></div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ content }) {
  return (
    <section id="ablauf" className="rst-section">
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Eyebrow>In drei Schritten</Eyebrow>
        <h2 className="rst-sec-title" style={{ marginLeft: "auto", marginRight: "auto" }}>So funktioniert es</h2>
      </div>
      <div className="rst-services">
        {content.steps.map((s, i) => (
          <div key={i} className="rst-service" style={{ gridColumn: "span 1" }}>
            <div className="rst-service__icon" style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 600 }}>{s.n}</div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            {s.meta ? <span className="r-mono" style={{ fontSize: 11, letterSpacing: ".06em", color: "var(--text-muted)" }}>{s.meta}</span> : null}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <ButtonLink as={Link} to="/anfrage" size="lg" endIcon={<Icon name="arrow-right" size={16} />}>Jetzt Angebot anfordern</ButtonLink>
      </div>
    </section>
  );
}

function workBadge(label) {
  if (!label) return null;
  const l = label.toLowerCase();
  if (l.includes("bearbeit")) return <Badge tone="success" dot>{label}</Badge>;
  if (l.includes("prüf") || l.includes("pruef")) return <Badge tone="warning" dot>{label}</Badge>;
  return <Badge tone="brand">{label}</Badge>;
}

function Featured({ works }) {
  return (
    <section id="atelier" className="rst-section">
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <Eyebrow>Aus dem Atelier</Eyebrow>
        <h2 className="rst-sec-title" style={{ marginLeft: "auto", marginRight: "auto" }}>Aktuelle Behandlungen</h2>
      </div>
      <div className="rst-works-grid">
        {works.map((w, i) => (
          <WorkCard
            key={w.id ?? i}
            title={w.title}
            artist={w.artist}
            meta={w.meta}
            status={workBadge(w.status_label)}
            image={w.image_url ? w.image_url : <Plate ratio="4/5" tone={w.tone ?? i % 4} />}
          />
        ))}
      </div>
    </section>
  );
}

function ClosingCTA({ content }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="kontakt" className="rst-cta">
      <div className="rst-cta__inner">
        <div>
          <Eyebrow tone="onDark">Beginnen</Eyebrow>
          <h2>Ein Werk, das Pflege braucht?</h2>
          <p>Teilen Sie uns einige Details und Fotografien mit. Ein Restaurator meldet sich innerhalb von zwei Werktagen.</p>
          <ButtonLink as={Link} to="/anfrage" size="lg" endIcon={<Icon name="arrow-right" size={16} />}>Beratung anfragen</ButtonLink>
        </div>
        <div className="rst-faq">
          {content.faq.map((it, i) => (
            <div key={i} className="rst-faq__item">
              <button className="rst-faq__q" onClick={() => setOpen(open === i ? -1 : i)}>
                {it.q}<Icon name={open === i ? "minus" : "plus"} size={18} />
              </button>
              {open === i ? <p className="rst-faq__a">{it.a}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter({ content }) {
  const c = content.contact;
  return (
    <footer className="rst-footer">
      <div className="rst-footer__grid">
        <div>
          <div className="rst-hero-wordmark">Westermeier<br />Restaurierung</div>
          <p className="rst-footer__lede">Ein Atelier für die Restaurierung von Gemälden, Papier und Objekten.</p>
        </div>
        <div>
          <div className="rst-footer__col-h">Atelier</div>
          <div className="rst-footer__links">
            {["Leistungen", "Das Team", "Journal", "Karriere"].map((l) => <a key={l} href="#">{l}</a>)}
          </div>
        </div>
        <div>
          <div className="rst-footer__col-h">Sammler</div>
          <div className="rst-footer__links">
            <Link to="/anfrage">Beratung anfragen</Link>
            <Link to="/login">Kundenportal</Link>
            <a href="#">Versicherung</a>
            <a href="#">Versand</a>
          </div>
        </div>
        <div>
          <div className="rst-footer__col-h">Kontakt</div>
          <div className="rst-footer__links">
            {c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : null}
            {c.phone ? <a href={`tel:${c.phone.replace(/\s+/g, "")}`}>{c.phone}</a> : null}
            {c.address ? <span style={{ color: "var(--stone-700)", fontSize: 14 }}>{c.address}</span> : null}
          </div>
        </div>
      </div>
      <div className="rst-footer__bar">
        <span>© {new Date().getFullYear()} Westermeier Restaurierung</span>
        <span><Link to="/impressum">Datenschutz · Impressum</Link></span>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const { content, works } = useSiteContent();
  return (
    <div className="rst-site">
      <SiteHeader />
      <Hero content={content} />
      <Services content={content} />
      <HowItWorks content={content} />
      <Featured works={works} />
      <ClosingCTA content={content} />
      <SiteFooter content={content} />
    </div>
  );
}

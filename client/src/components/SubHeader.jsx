import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ButtonLink } from "../ds";

/* Solid, sticky header for subpages (Team, Impressum, …). Nav links jump to
   the homepage sections; on narrow screens the nav collapses (CSS) to keep the
   bar clean, with the wordmark + CTA always reachable. */
const LINKS = [["Services", "/#leistungen"], ["Werkstätte", "/werkstatt"], ["Referenzen", "/referenzen"]];

export default function SubHeader() {
  const { user, isAdmin } = useAuth();
  return (
    <header className="rst-header rst-header--scrolled">
      <div className="rst-header__bar">
        <Link to="/" className="rst-hero-wordmark">Westermeier<br />Restaurierung</Link>
        <nav className="rst-header__nav">
          {LINKS.map(([l, href]) => href.includes("#") ? <a key={l} href={href}>{l}</a> : <Link key={l} to={href}>{l}</Link>)}
        </nav>
        <div className="rst-header__actions">
          {user ? (
            <ButtonLink as={Link} to={isAdmin ? "/admin" : "/dashboard"} size="sm">Zum Portal</ButtonLink>
          ) : (
            <>
              <Link to="/login" className="rst-header__signin">Anmelden</Link>
              <ButtonLink as={Link} to="/anfrage" size="sm">Angebot erhalten</ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

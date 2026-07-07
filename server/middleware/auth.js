import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-fallback-secret";

/** Verify JWT and attach req.user = { id, email, role } */
export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Anmeldung erforderlich." });
  }
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, SECRET);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: "Sitzung ungültig oder abgelaufen." });
  }
}

/** Require admin role (calls authenticate first) */
export function requireAdmin(req, res, next) {
  authenticate(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Administratorzugriff erforderlich." });
    }
    next();
  });
}

/** Create a signed JWT */
export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET,
    { expiresIn: "7d" }
  );
}

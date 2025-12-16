
export { config } from './_lib/config.js'
export default function handler(req, res) {
  res.status(200).json({ ok: true, server: "up" });
}

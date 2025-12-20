export default function handler(req, res) {
  const redirectUri = `${process.env.BASE_URL}/api/auth/google/callback`;

  const url =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=openid email profile`;

  res.redirect(url);
}

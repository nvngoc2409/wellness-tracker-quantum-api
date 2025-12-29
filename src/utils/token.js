import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import fs from "fs";
import jwksClient from "jwks-rsa";

const appleClient = jwksClient({
  jwksUri: "https://appleid.apple.com/auth/keys",
});

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: [process.env.GOOGLE_IOS_CLIENT_ID, process.env.GOOGLE_ANDROID_CLIENT_ID],
  });

  const payload = ticket.getPayload();
  return payload;
};

// --- Apple Sign In verification ---
function getKey(header, callback) {
  appleClient.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export const verifyAppleToken = (idToken) => {
  const secretKey = generateAppleClientSecret();
  return new Promise((resolve, reject) => {
    jwt.verify(
      idToken,
      getKey,
      {
        algorithms: ['RS256'], // Apple uses RS256 for id_tokens
        audience: process.env.APPLE_CLIENT_ID,
        issuer: "https://appleid.apple.com",
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      }
    );
  });
}

function generateAppleClientSecret() {
  const privateKey = fs.readFileSync("AuthKey.p8");

  return jwt.sign(
    {
      iss: process.env.APPLE_TEAM_ID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      aud: "https://appleid.apple.com",
      sub: process.env.APPLE_CLIENT_ID,
    },
    privateKey,
    {
      algorithm: "ES256",
      keyid: process.env.APPLE_KEY_ID,
    }
  );
}
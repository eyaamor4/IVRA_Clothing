import "server-only";
import nodemailer from "nodemailer";

// Sends email using Gmail SMTP with an "App Password".
// Setup (one-time, on the Google account that owns ivraclothing@gmail.com):
//  1. Turn on 2-Step Verification: https://myaccount.google.com/security
//  2. Create an App Password: https://myaccount.google.com/apppasswords
//  3. Put that 16-character password (no spaces) in .env.local as GMAIL_APP_PASSWORD
//  4. Set GMAIL_USER=ivraclothing@gmail.com in .env.local
export function getMailTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export const CONTACT_RECIPIENT = process.env.GMAIL_USER || "ivraclothing@gmail.com";
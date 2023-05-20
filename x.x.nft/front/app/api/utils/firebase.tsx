import { Firestore } from "@google-cloud/firestore";

export const db = new Firestore({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  credentials: {
    client_email: process.env.NEXT_PUBLIC_GOOGLE_EMAIL,
    private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIATEKEY?.replace(/\\n/g, '\n'),
  },
});
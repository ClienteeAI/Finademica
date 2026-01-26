// Centralized webhook URLs to avoid drift across components

// Signup form data (name, email, phone)
export const SIGNUP_WEBHOOK_URL =
  "https://clientee.app.n8n.cloud/webhook/f9b5acc5-f4a9-4a0b-8956-37e174289f51";

// Quiz/questionnaire answers
export const QUIZ_WEBHOOK_URL =
  "https://clientee.app.n8n.cloud/webhook/0436515b-5645-4361-b278-c6273f0d5efb";

// Legacy alias (kept for backward compatibility if needed)
export const ONBOARDING_WEBHOOK_URL = QUIZ_WEBHOOK_URL;

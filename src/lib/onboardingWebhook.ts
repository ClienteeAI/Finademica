// Centralized webhook URLs to avoid drift across components

// Signup form data (name, email, phone)
export const SIGNUP_WEBHOOK_URL =
  "https://n8n.srv1474318.hstgr.cloud/webhook/Sign-up-form-finademica";

// Quiz/questionnaire answers
export const QUIZ_WEBHOOK_URL =
  "https://n8n.srv1474318.hstgr.cloud/webhook/Onboarding-quiz-finademica";

// Legacy alias (kept for backward compatibility if needed)
export const ONBOARDING_WEBHOOK_URL = QUIZ_WEBHOOK_URL;

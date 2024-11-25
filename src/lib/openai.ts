import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: import.meta.env.GEN_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});
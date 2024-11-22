export interface AIModel {
  name: string;
  displayName: string;
  systemPrompt?: string;
  assistantPrompt?: string;
  api?: string;
  uiContext?: AIModelUIContext  
}

interface AIModelUIContext {
  inputPlaceholder?: string;
  pageTitle?: string;
  link?: string;
}

export interface Route {
  name: string;
  path: string;
}

export interface FooterProps {
  brandName?: string;
  brandLink?: string;
  routes?: Array<{
    name: string;
    path: string;
  }>;
}

export interface RouteConfig {
  layout: string;
  pages: Array<{
    path: string;
    element: React.ReactNode;
  }>;
}

export interface DecodedToken {
  id: number;
  uemail: string;
  role: number;
  iat: number;
  exp: number;
  package: string | number;
  firstname: string;
  is_email_verified: number;
  imageurl: string;
}

export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onaudioend: (event: Event) => void;
  onaudiostart: (event: Event) => void;
  onend: (event: Event) => void;
  onerror: (event: Event) => void;
  onnomatch: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onsoundend: (event: Event) => void;
  onsoundstart: (event: Event) => void;
  onspeechend: (event: Event) => void;
  onspeechstart: (event: Event) => void;
  onstart: (event: Event) => void;
  abort(): void;
  start(): void;
  stop(): void;
}

export interface Window {
  webkitSpeechRecognition: {
    new (): SpeechRecognition;
  };
}

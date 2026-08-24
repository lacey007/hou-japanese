declare module "edge-tts.js" {
  export class Communicate {
    constructor(text: string, voice: string);
    save(path: string): Promise<void>;
  }
}

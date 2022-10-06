import type { Request, Response } from "express";
interface RenderOptions {
  req: Request;
  res: Response;
  template: string;
}

export type ServerRenderFunction = (options: RenderOptions) => Promise<void>;

import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errors";
import { getSupabaseAdmin } from "./supabase";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export async function authMiddleware(request: Request, response: Response, next: NextFunction) {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.slice(7);
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return next();
    }

    request.user = {
      id: data.user.id,
      email: data.user.email || ""
    };

    next();
  } catch (error) {
    next();
  }
}

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  if (!request.user?.id) {
    throw new AppError(401, "Unauthorized: Please login first");
  }
  next();
}

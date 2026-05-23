import { type NextRequest } from "next/server";
import { updateSession } from "@/shared/api/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/drafts/:path*",
    "/post/write/:path*",
    "/post/:id/edit/:path*",
  ],
};

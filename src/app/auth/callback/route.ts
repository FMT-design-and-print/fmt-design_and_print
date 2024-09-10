import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAuthApiError } from "@supabase/supabase-js";
import { invalidOrExpiredMsg } from "@/constants";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (!code) {
    return redirectBadCode(requestUrl, invalidOrExpiredMsg, "error");
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    if (data.session) {
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    } else {
      return redirectBadCode(requestUrl, invalidOrExpiredMsg, "error");
    }
  } catch (error) {
    if (isAuthApiError(error)) {
      return redirectDiffDevice(requestUrl);
    }
  }
}

function redirectBadCode(
  requestUrl: URL,
  message: string,
  messageStatus: string
) {
  const searchParams = encodeSearchParams({
    err_type: "bad_code",
    message,
    messageStatus,
  });

  return NextResponse.redirect(`${requestUrl.origin}/login?${searchParams}`);
}

function redirectDiffDevice(requestUrl: URL) {
  const searchParams = encodeSearchParams({
    err_type: "diff_device",
  });

  return NextResponse.redirect(`${requestUrl.origin}/login?${searchParams}`);
}

function encodeSearchParams(params: Record<string, string>) {
  return new URLSearchParams(params).toString();
}

import { invalidOrExpiredMsg } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { isAuthApiError } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (!code) {
    return redirectBadCode(requestUrl, invalidOrExpiredMsg, "error");
  }

  const supabase = await createClient();

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

  return NextResponse.redirect(
    `${requestUrl.origin}/admin/login?${searchParams}`
  );
}

function redirectDiffDevice(requestUrl: URL) {
  const searchParams = encodeSearchParams({
    err_type: "diff_device",
  });

  return NextResponse.redirect(
    `${requestUrl.origin}/admin/login?${searchParams}`
  );
}

function encodeSearchParams(params: Record<string, string>) {
  return new URLSearchParams(params).toString();
}

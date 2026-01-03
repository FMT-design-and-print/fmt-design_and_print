import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/utils/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const FORWARD_TO = [
    "ankomaheneshadrack@gmail.com",
    "fmtdesignandprints@gmail.com",
];

export async function POST(request: NextRequest) {
    try {
        const event = await request.json();

        if (event?.type !== "email.received") {
            return NextResponse.json({ success: true });
        }

        const emailId: string | undefined = event?.data?.email_id;
        if (!emailId) {
            return NextResponse.json(
                { success: false, error: "Missing email_id" },
                { status: 400 }
            );
        }

        const { data: email } = await resend.emails.receiving.get(emailId);

        const attachmentsRes =
            await resend.emails.receiving.attachments.list({ emailId });
        const attachmentsList =
            Array.isArray((attachmentsRes as any)?.data)
                ? ((attachmentsRes as any).data as Array<{
                    id: string;
                    filename: string;
                    content_type: string;
                    content_disposition?: string;
                    content_id?: string | null;
                    download_url: string;
                    expires_at?: string;
                }>)
                : [];

        const processedAttachments: Array<{
            id: string;
            filename: string;
            content_type: string;
            content_disposition?: string;
            content_id?: string | null;
            size: number;
            download_url: string;
            expires_at?: string;
        }> = [];

        for (const attachment of attachmentsList) {
            const response = await fetch(attachment.download_url);
            if (!response.ok) {
                continue;
            }
            const buffer = Buffer.from(await response.arrayBuffer());
            processedAttachments.push({
                id: attachment.id,
                filename: attachment.filename,
                content_type: attachment.content_type,
                content_disposition: attachment.content_disposition,
                content_id: attachment.content_id,
                size: buffer.length,
                download_url: attachment.download_url,
                expires_at: (attachment as any)?.expires_at,
            });
        }

        const supabase = createAdminClient();

        const subject: string | null = event?.data?.subject ?? null;
        const content: string =
            (email as any)?.text ?? (email as any)?.html ?? "";
        const source: string | null = event?.data?.from ?? null;

        const metadata = {
            from: event?.data?.from,
            to: event?.data?.to,
            cc: event?.data?.cc,
            bcc: event?.data?.bcc,
            message_id: event?.data?.message_id,
            headers: (email as any)?.headers,
            attachments: processedAttachments,
        };

        const { data: saved, error: saveError } = await supabase
            .from("messages")
            .insert([
                {
                    subject,
                    content,
                    source,
                    status: "unread",
                    group: "inbox",
                    metadata,
                },
            ])
            .select()
            .single();

        

        const forwardAttachments =
            attachmentsList.length > 0
                ? await Promise.all(
                    attachmentsList.map(async (att) => {
                        const res = await fetch(att.download_url);
                        if (!res.ok) {
                            return null;
                        }
                        const buffer = Buffer.from(await res.arrayBuffer());
                        return {
                            filename: att.filename,
                            content: buffer.toString("base64"),
                            content_type: att.content_type,
                        } as any;
                    })
                )
                : [];

        const sanitizedForwardAttachments = forwardAttachments.filter(Boolean);

        await resend.emails.send({
            from: "FMT Design and Print <notifications@fmtdesignprint.com>",
            to: FORWARD_TO,
            subject: subject || "Inbound Email",
            html: (email as any)?.html || undefined,
            text: (email as any)?.text || undefined,
            replyTo: source || undefined,
            attachments: sanitizedForwardAttachments as any,
        });

        return NextResponse.json({
            success: true,
            id: saved?.id,
            attachmentsProcessed: processedAttachments.length,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to process inbound email" },
            { status: 500 }
        );
    }
}

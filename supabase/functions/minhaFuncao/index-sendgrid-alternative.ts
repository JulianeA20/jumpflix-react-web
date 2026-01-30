// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

// Usar variáveis de ambiente
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const emailUser = Deno.env.get('EMAIL_USER') ?? 'jumpflixapp@gmail.com';
const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY') ?? ''; // SendGrid API Key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

Deno.serve(async (req: Request) => {
    try {
        const { email } = await req.json()
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const { error } = await supabase.from('password_reset_codes').insert([{
            email,
            code,
            expires_at: new Date(Date.now() + 3600000)
        }]);
        if (error) throw error;

        // Send email using SendGrid API (Deno-compatible)
        const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sendgridApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [
                    {
                        to: [{ email }],
                        subject: 'Código de redefinição de senha',
                    },
                ],
                from: { email: emailUser },
                content: [
                    {
                        type: 'text/plain',
                        value: `Seu código de redefinição de senha é: ${code}`,
                    },
                ],
            }),
        });

        if (!emailResponse.ok) {
            const errorData = await emailResponse.text();
            throw new Error(`Failed to send email: ${errorData}`);
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error('Erro:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        return new Response(JSON.stringify({ success: false, error: errorMessage }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
});

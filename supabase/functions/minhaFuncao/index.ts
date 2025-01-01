// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";
import nodemailer from "https://deno.land/x/nodemailer/mod.ts";

const supabaseUrl = "https://qracyjpajjwnbivcygkg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyYWN5anBhamp3bmJpdmN5Z2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NTcyNjcsImV4cCI6MjA0NzAzMzI2N30.ui9BpgrvBpz4aq_TtMEJIGiSRDrUQV6-D81KoeeRo6U";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

Deno.serve(async (req) => {
  try {
    const { email } = await req.json()
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const { error } = await supabase.from('password_reset_codes').insert([{ email, code, expires_at: new Date(Date.now() + 3600000) }]);

    if (error) throw error;
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jumpflixapp@gmail.com",
        pass: "juli22jac",
      },
    });

    const mailOptions = {
      from: "jumpflixapp@gmail.com",
      to: email,
      subject: "Código de redefinição de senha",
      text: `Seu código de redefinição de senha é: ${code}`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Erro:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/minhaFuncao' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function entrar(e: any) {
    e.preventDefault();
    setMsg("Entrando...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setMsg(error ? "Login inválido." : "Logado com sucesso!");
  }

  async function sair() {
    await supabase.auth.signOut();
    setMsg("Saiu.");
  }

  async function baixarDiploma() {
    setMsg("Buscando diploma...");

    const { data, error } = await supabase
      .from("diplomas")
      .select("file_path, full_name")
      .single();

    if (error || !data) {
      setMsg("Nenhum diploma encontrado para este usuário.");
      return;
    }

    // ✅ Corrigido: o bucket no Supabase está como "Diplomas" (D maiúsculo)
    const { data: signed, error: err2 } = await supabase.storage
      .from("Diplomas")
      .createSignedUrl(data.file_path, 60);

    if (err2 || !signed?.signedUrl) {
      setMsg(
        `Erro ao gerar link do diploma.${
          err2?.message ? " (" + err2.message + ")" : ""
        }`
      );
      return;
    }

    window.open(signed.signedUrl, "_blank", "noopener,noreferrer");
    setMsg(`Abrindo diploma${data.full_name ? " de " + data.full_name : ""}...`);
  }

  return (
    <main style={{ fontFamily: "Arial", maxWidth: 420, margin: "40px auto" }}>
      <h2>Portal de Diplomas</h2>

      {!session ? (
        <form onSubmit={entrar}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, margin: "8px 0" }}
          />
          <input
            placeholder="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ width: "100%", padding: 10, margin: "8px 0" }}
          />
          <button style={{ padding: 10, width: "100%" }}>Entrar</button>
          <p>{msg}</p>
        </form>
      ) : (
        <>
          <p>Você está logado ✅</p>

          <button onClick={baixarDiploma} style={{ padding: 10, width: "100%" }}>
            Ver / Baixar diploma (PDF)
          </button>

          <button onClick={sair} style={{ padding: 10, width: "100%", marginTop: 10 }}>
            Sair
          </button>

          <p>{msg}</p>
        </>
      )}
    </main>
  );
}


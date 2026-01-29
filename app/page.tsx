"use client";

import { useState } from "react";

export default function Home() {
  const [user, setUser] = useState("");
  const [senha, setSenha] = useState("");

  function entrar(e: any) {
    e.preventDefault();
    alert("Login recebido: " + user);
  }

  return (
    <main style={{fontFamily:"Arial", maxWidth:400, margin:"40px auto"}}>
      <h2>Portal de Diplomas</h2>

      <form onSubmit={entrar}>
        <input
          placeholder="Número do usuário"
          value={user}
          onChange={e => setUser(e.target.value)}
          style={{width:"100%", padding:10, margin:"8px 0"}}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          style={{width:"100%", padding:10, margin:"8px 0"}}
        />

        <button style={{padding:10, width:"100%"}}>
          Entrar
        </button>
      </form>
    </main>
  );
}

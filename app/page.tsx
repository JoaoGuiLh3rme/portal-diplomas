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

  const { data: signed, error: err2 } = await supabase.storage
    .from("Diplomas") // ← AQUI É A CORREÇÃO
    .createSignedUrl(data.file_path, 60);

  if (err2 || !signed) {
    setMsg("Erro ao gerar link do diploma.");
    console.error(err2);
    return;
  }

  window.open(signed.signedUrl, "_blank");
  setMsg(`Abrindo diploma de ${data.full_name}...`);
}


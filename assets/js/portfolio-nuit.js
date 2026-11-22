/* Chargement Cloudflare Analytics suspendu en attendant validation du paramétrage et de l’information RGPD. */
(() => {
  const statut = document.getElementById("visits-status");
  if (!statut || location.origin !== "https://www.lenumeriquevientavous.fr") return;
  statut.textContent = "Les statistiques historiques ne sont pas disponibles.";
  fetch("assets/visites-historiques.json", { credentials: "omit", mode: "same-origin" })
    .then(r => {
      if (!r.ok) throw new Error("Export indisponible");
      return r.json();
    })
    .then(donnees => {
      if (donnees?.source !== "hitscounter.dev" ||
          donnees.url !== "https://www.lenumeriquevientavous.fr/" ||
          !Number.isSafeInteger(donnees.total) || donnees.total <= 0 ||
          typeof donnees.dateReleve !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(donnees.dateReleve)) return;
      const date = new Date(donnees.dateReleve + "T00:00:00Z");
      if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== donnees.dateReleve) return;
      const total = new Intl.NumberFormat("fr-FR").format(donnees.total);
      const jour = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" }).format(date);
      statut.textContent = `${total} chargements · relevé du ${jour}`;
    })
    .catch(() => {
      // Le texte de repli reste affiché si l'export est introuvable ou illisible.
    });
})();

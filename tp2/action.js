// action.js — Lit les paramètres d'URL et met à jour la page
window.addEventListener('DOMContentLoaded', () => {
  const paramsString = document.location.search;
  const searchParams = new URLSearchParams(paramsString);

  for (const param of searchParams) {
    const key = param[0];
    const value = decodeURIComponent(param[1] || '');
    // map form names to element ids (they are identical here)
    const el = document.getElementById(key);
    if (!el) continue;

    // if target is an <a>, update href and text
    if (el.tagName.toLowerCase() === 'a') {
      if (key === 'address') {
        el.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
        el.textContent = value;
      } else if (key === 'email') {
        el.href = `mailto:${value}?subject=Hello!&body=Salut%20!`;
        el.textContent = value;
      } else {
        el.textContent = value;
      }
    } else {
      el.textContent = value;
    }
  }

  // Accessibility: if no params, show a hint
  if (!paramsString || paramsString === '') {
    const out = document.getElementById('output');
    out.innerHTML = '<p>Aucune donnée reçue. Retournez au formulaire et envoyez les informations.</p>';
  }
});

// gps.js — permet de géolocaliser ou d'afficher la carte selon l'adresse saisie

// Fonction principale appelée par le bouton GPS
function getLocation() {
  const addrField = document.querySelector("#adresse");
  const adresse = addrField ? addrField.value.trim() : "";

  if (adresse) {
    // Si une adresse est saisie manuellement → on affiche la carte à cette adresse
    showMapFromAddress(adresse);
  } else if (navigator.geolocation) {
    // Sinon, on tente la géolocalisation réelle
    navigator.geolocation.getCurrentPosition(showPosition, showError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  } else {
    showFallback("Geolocation is not supported by this browser.");
  }
}

// ---- SI L’UTILISATEUR AUTORISE LA LOCALISATION ----
function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  showMap(lat, lon, "Votre position détectée");
  const addrField = document.querySelector("#adresse");
  if (addrField) {
    addrField.value = lat.toFixed(6) + ", " + lon.toFixed(6);
    const evt = new Event("keyup");
    addrField.dispatchEvent(evt);
  }
}

// ---- CAS D'ERREUR / REFUS ----
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      showFallback("Autorisez la localisation ou saisissez une adresse.");
      break;
    case error.POSITION_UNAVAILABLE:
    case error.TIMEOUT:
    case error.UNKNOWN_ERROR:
    default:
      showFallback("Impossible d’obtenir votre position. Entrez une adresse manuellement.");
      break;
  }
}

// ---- AFFICHER LA MAP À PARTIR DE LAT/LON ----
function showMap(lat, lon, message = "") {
  const zoom = 5;
  const delta = 0.05 / Math.pow(2, zoom - 10);
  const bbox = `${lon - delta}%2C${lat - delta}%2C${lon + delta}%2C${lat + delta}`;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
  document.getElementById("map").innerHTML = `
    <div class="text-muted mb-2">${message}</div>
    <iframe width="100%" height="200" frameborder="0" scrolling="no" src="${iframeSrc}"></iframe>
  `;
}

// ---- AFFICHER UNE CARTE DE SECOURS (Paris par défaut) ----
function showFallback(msg) {
  const defaultLat = 48.8566;
  const defaultLon = 2.3522;
  showMap(defaultLat, defaultLon, msg);
  const addrField = document.querySelector("#adresse");
  if (addrField) {
    addrField.value = defaultLat + ", " + defaultLon + " (Paris)";
    const evt = new Event("keyup");
    addrField.dispatchEvent(evt);
  }
}

// ---- UTILISER L’ADRESSE SAISIE ----
// ⚠️ utilise l’API Nominatim d’OpenStreetMap (sans clé)
function showMapFromAddress(adresse) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    adresse
  )}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        showMap(lat, lon, `Résultat pour: ${adresse}`);
      } else {
        showFallback(`Adresse introuvable : ${adresse}`);
      }
    })
    .catch(() => {
      showFallback("Erreur lors de la recherche d’adresse.");
    });
}

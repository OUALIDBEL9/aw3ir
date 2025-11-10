// Basic validation and behavior for the form
function calcNbChar(id) {
  const input = document.querySelector('#' + id);
  if (!input) return;
  const countElement = input.parentElement.parentElement.querySelector("[data-count]");
  if (countElement) {
    countElement.textContent = input.value.length + " car.";
  }
}

function validateEmail(email) {
  // simple regex for basic validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  const name = document.querySelector('#name').value.trim();
  const firstname = document.querySelector('#firstname').value.trim();
  const birth = document.querySelector('#birth').value;
  const adresse = document.querySelector('#adresse').value.trim();
  const mail = document.querySelector('#mail').value.trim();

  let ok = true;
  let messages = [];

  if (name.length < 5) { ok = false; messages.push('Nom: 5 caractères min'); }
  if (firstname.length < 5) { ok = false; messages.push('Prénom: 5 caractères min'); }
  if (adresse.length < 5) { ok = false; messages.push('Adresse: 5 caractères min'); }
  if (!validateEmail(mail)) { ok = false; messages.push('Email: format invalide'); }
  if (birth) {
    const b = new Date(birth);
    const today = new Date();
    if (b > today) { ok = false; messages.push('Date de naissance ne peut pas être dans le futur'); }
  } else {
    ok = false; messages.push('Date de naissance requise');
  }

  return { ok, messages };
}

function displayMessages(messages) {
  const alertBox = document.querySelector('#messages');
  if (!alertBox) return;
  if (messages.length === 0) {
    alertBox.innerHTML = '';
    alertBox.style.display = 'none';
    return;
  }
  alertBox.style.display = 'block';
  alertBox.innerHTML = '<ul>' + messages.map(m => '<li>'+m+'</li>').join('') + '</ul>';
}

function displayContactList() {
  const contactListString = localStorage.getItem("contactList");
  const contactList = contactListString ? JSON.parse(contactListString) : [];
  const tbody = document.querySelector("table#contacts tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  for (const contact of contactList) {
    tbody.innerHTML += `<tr>
  <td>${contact.name}</td>
  <td>${contact.firstname}</td>
  <td>${contact.date}</td>
  <td>${contact.adress}</td>
  <td><a href="mailto:${contact.mail}">${contact.mail}</a></td>
  </tr>`;
  }
}

window.addEventListener('DOMContentLoaded', function() {
  displayContactList();

  // hook char counters
  ['name','firstname','birth','adresse','mail'].forEach(id => {
    const el = document.querySelector('#' + id);
    if (el) {
      el.addEventListener('keyup', () => calcNbChar(id));
      // init
      calcNbChar(id);
    }
  });

  const form = document.querySelector('form#contactForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const v = validateForm();
      displayMessages(v.messages);
      if (!v.ok) return;
      contactStore.add(
        document.querySelector('#name').value.trim(),
        document.querySelector('#firstname').value.trim(),
        document.querySelector('#birth').value,
        document.querySelector('#adresse').value.trim(),
        document.querySelector('#mail').value.trim()
      );
      displayContactList();
      form.reset();
      // reset counters
      ['name','firstname','birth','adresse','mail'].forEach(id => calcNbChar(id));
      // clear map
      const map = document.querySelector('#map');
      if (map) map.innerHTML = '';
      displayMessages(['Contact ajouté avec succès.']);
    });
  }

  const gpsBtn = document.querySelector('#gps');
  if (gpsBtn) {
    gpsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (typeof getLocation === 'function') {
        getLocation();
      } else {
        alert('fonction getLocation introuvable.');
      }
    });
  }

  const resetBtn = document.querySelector('#resetStore');
  if (resetBtn) {
    resetBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Voulez-vous vraiment effacer la liste locale ?')) {
        contactStore.reset();
        displayContactList();
        alert('Liste effacée.');
      }
    });
  }
});
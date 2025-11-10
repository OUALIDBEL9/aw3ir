(function () {
  'use strict';
  window.onload = function () {
    console.log("DOM ready!");

    const form = document.getElementById('tpForm');
    const modalEl = document.getElementById('myModal');
    const modal = new bootstrap.Modal(modalEl);
    const modalBody = modalEl.querySelector('.modal-body');
    const modalTitle = modalEl.querySelector('.modal-title');

    function validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    function markInvalid(el, msg) {
      el.classList.add('is-invalid');
      const fb = el.parentElement.querySelector('.invalid-feedback');
      if (fb) fb.textContent = msg;
    }

    function clearInvalid(el) {
      el.classList.remove('is-invalid');
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      let valid = true;

      const lastname = document.getElementById('lastname');
      const firstname = document.getElementById('firstname');
      const address = document.getElementById('address');
      const birthday = document.getElementById('birthday');
      const email = document.getElementById('email');

      [lastname, firstname, address, birthday, email].forEach(clearInvalid);

      if (!lastname.value || lastname.value.trim().length < 5) {
        markInvalid(lastname, 'Le nom doit contenir au moins 5 caractères.');
        valid = false;
      }
      if (!firstname.value || firstname.value.trim().length < 5) {
        markInvalid(firstname, 'Le prénom doit contenir au moins 5 caractères.');
        valid = false;
      }
      if (!address.value || address.value.trim().length < 5) {
        markInvalid(address, "L'adresse doit contenir au moins 5 caractères.");
        valid = false;
      }

      const birthdayDate = new Date(birthday.value);
      const now = Date.now();
      if (!birthday.value || isNaN(birthdayDate.getTime()) || birthdayDate.getTime() > now) {
        markInvalid(birthday, 'Veuillez saisir une date de naissance valide (pas dans le futur).');
        valid = false;
      }

      if (!validateEmail(email.value)) {
        markInvalid(email, 'Veuillez entrer une adresse email valide.');
        valid = false;
      }

      if (!valid) {
        modalTitle.textContent = 'Erreur : champs invalides';
        modalBody.innerHTML = '<p>Veuillez vérifier vos informations : certains champs sont invalides.</p>';
        modal.show();
        return;
      }

   
      modalTitle.textContent = 'Formulaire valide - aperçu';


      const apiKey = 'AIzaSyAkmvI9DazzG9p77IShsz_Di7-5Qn7zkcg';
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?markers=Paris&zoom=14&size=600x300&scale=2&key=${apiKey}`;
      const mapsLink = 'https://maps.google.com/maps?q='+address.value;
      const locationImage = 'assets/location.png'
    

      const recap = `
        <h5>Récapitulatif</h5>
        <ul>
          <li><strong>Nom :</strong> ${lastname.value}</li>
          <li><strong>Prénom :</strong> ${firstname.value}</li>
          <li><strong>Date de naissance :</strong> ${birthday.value}</li>
          <li><strong>Adresse :</strong> ${address.value}</li>
          <li><strong>Email :</strong> ${email.value}</li>
        </ul>
        <p>Cliquez sur la position en rouge pour afficher votre localisation.</p>
        <a href="${mapsLink}" target="_blank" rel="noopener noreferrer">
          <img src="${locationImage}" alt="logo" style="width:8%; height:auto; border-radius:6px;"/>
        </a>
      `;

      modalBody.innerHTML = recap;
      modal.show();
    });
  };
})();
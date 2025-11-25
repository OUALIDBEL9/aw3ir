// main.js – version complète (clé API intégrée)
var app;
window.onload = function () {
  app = new Vue({
    el: "#weatherApp",
    data: {
      loaded: false,
      formCityName: "nice",
      message: "WebApp Loaded.",
      messageForm: "dsqsdqsd",
      cityList: [{ name: "Paris" }],
      cityWeather: null,
      cityWeatherLoading: false,

      // 🔥 TA CLÉ API ICI
      apiKey: "07abcc8c3690e58643ab3cbfeeadc839"
    },

    mounted() {
      this.loaded = true;
      this.readData();
    },

    methods: {
      readData() {
        console.log(JSON.stringify(this.cityList));
      },

      isCityExist(name) {
        if (!name) return false;
        return this.cityList.filter(
          c => c.name.toUpperCase() === name.toUpperCase()
        ).length > 0;
      },

      addCity(event) {
        event.preventDefault();
        let name = this.formCityName.trim();
        if (name === "") return;

        if (this.isCityExist(name)) {
          this.messageForm = "existe déjà";
          return;
        }

        this.cityList.push({ name });
        this.messageForm = "";
        this.formCityName = "";
      },

      remove(city) {
        this.cityList = this.cityList.filter(c => c.name !== city.name);
      },

      meteo(city) {
        this.cityWeatherLoading = true;
        this.message = null;

        fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            city.name +
            "&units=metric&lang=fr&appid=" +
            this.apiKey
        )
          .then((response) => response.json())
          .then((json) => {
            this.cityWeatherLoading = false;

            if (json.cod == 200) {
              this.cityWeather = json;
            } else {
              this.cityWeather = null;
              this.message =
                "Météo introuvable pour " +
                city.name +
                " (" +
                json.message +
                ")";
            }
          });
      },

      useMyPosition() {
        if (!navigator.geolocation) {
          this.message = "Géolocalisation non supportée";
          return;
        }

        this.cityWeatherLoading = true;

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            let lat = pos.coords.latitude;
            let lon = pos.coords.longitude;

            fetch(
              "https://api.openweathermap.org/data/2.5/weather?lat=" +
                lat +
                "&lon=" +
                lon +
                "&units=metric&lang=fr&appid=" +
                this.apiKey
            )
              .then((r) => r.json())
              .then((json) => {
                this.cityWeatherLoading = false;

                if (json.cod == 200) {
                  this.cityWeather = json;
                } else {
                  this.cityWeather = null;
                  this.message = "Erreur: " + json.message;
                }
              });
          },
          (err) => {
            this.cityWeatherLoading = false;
            this.message = "Erreur de géolocalisation : " + err.message;
          }
        );
      },
    },

    computed: {
      cityWheaterDate() {
        if (!this.cityWeather) return "";
        let d = new Date(this.cityWeather.dt * 1000);
        return d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
      },

      cityWheaterSunrise() {
        if (!this.cityWeather) return "";
        let d = new Date(this.cityWeather.sys.sunrise * 1000);
        return d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
      },

      cityWheaterSunset() {
        if (!this.cityWeather) return "";
        let d = new Date(this.cityWeather.sys.sunset * 1000);
        return d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
      },

      openStreetMapArea() {
        if (!this.cityWeather) return "";
        const zoom = 8;
        const delta = 0.05 / Math.pow(2, zoom - 10);
        const bbox = {
          south: this.cityWeather.coord.lat - delta,
          north: this.cityWeather.coord.lat + delta,
          west: this.cityWeather.coord.lon - delta,
          east: this.cityWeather.coord.lon + delta,
        };
        return `${bbox.west}%2C${bbox.south}%2C${bbox.east}%2C${bbox.north}`;
      },
    },
  });
};

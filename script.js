const weatherGIFs = {
  Clear: "wHUWuJWg6iRRQWTBd1",
  Sunny: "khzLJR9sTppTUpBEia",
  Partly_Cloudy: "Oh1rKdcE3IFOpfeimr",
  Cloudy: "Oh1rKdcE3IFOpfeimr",
  Overcast: "Oh1rKdcE3IFOpfeimr",
  Mist: "dUR62cwTf5aMGMOmwy",
  Fog: "dUR62cwTf5aMGMOmwy",
  Light_rain_shower: "yGhTOpxFbAUhuBJG30",
  Thunderstorm: "eyoDFbM8UwpIsjG8iI",
  Light_Snow: "dwdBXHwYtuQV21eeF7",
  Heavy_Snow: "lOgHL3b6ogY6IEkq6q",
  Sleet: "dUR62cwTf5aMGMOmwy",
  Hail: "8hhfYrbc0XugC1XIeO",
  Windy: "lOgHL3b6ogY6IEkq6q",
  Hot: "xhC6odm0c5kFZQ5MGh",
  Cold: "dUR62cwTf5aMGMOmwy",
  Freezing_fog: "dwdBXHwYtuQV21eeF7",
  Drizzle: "AQ60Mqpz7sJLK4DiOW",
};

let pet_api = "";


// Initialize the map India coordinates
let map = L.map('map').setView([22.5937, 78.9629], 5);

// Add OpenStreetMap layer
let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
osm.addTo(map);
L.Control.geocoder().addTo(map);

// Add Stadia Alidade Smooth Dark layer
var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=f5855062-a557-4018-8d6e-c03f13450bcd', {
  ext: 'png'
});
Stadia_AlidadeSmoothDark.addTo(map);

// Variable to store the marker
let currentMarker;

// UI Elements
let loadMsg = document.querySelector(".loadMsg"); 
let location_msg = document.querySelector("#location");
let temperature = document.querySelector("#temperature");
let weatherText = document.querySelector("#weather");
let humidityText = document.querySelector("#humidity");
let windSpeed = document.querySelector("#wind-speed");
let weatherIcon = document.querySelector(".icon");
let gif = document.querySelector(".gif");

map.on('click', async function (e) {
  let { lat, lng } = e.latlng;

  let url = `https://api.weatherapi.com/v1/current.json?key=9025db8dbabb430d952165219252901&q=${lat},${lng}`;

  try {
    let response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch weather data");

    let location = await response.json();

    let place = location.location.name;
    let country = location.location.country;
    let temp_c = location.current.temp_c;
    let weatherCondition = location.current.condition.text;
    let humidity = location.current.humidity;
    let wind = location.current.wind_kph;
    let icon = location.current.condition.icon;
    let icon_url = `https:${icon}`;
    let weathergif;

    console.log(weatherCondition, lat, lng);

    if (weatherCondition.toLowerCase().includes("rain")) {
      weathergif = "Light_rain_shower"; // Default GIF for rain-related conditions
    }else if (weatherCondition.toLowerCase().includes("snow")) {
      weathergif = "Light_Snow"; // Default GIF for snow-related conditions
    }else {
      weathergif = weatherCondition.replace(/ /g, "_");
      console.log(weathergif);
    }

    if (currentMarker) {
      map.removeLayer(currentMarker);
    }

    currentMarker = L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`Place: ${place}, Country: ${country}`)
      .openPopup();

    if (loadMsg) {
      loadMsg.remove();
    }

    location_msg.textContent = `${place}, ${country}`;
    temperature.textContent = `${temp_c}°C`;
    weatherText.textContent = `${weatherCondition}`;
    humidityText.textContent = `${humidity}%`;
    windSpeed.textContent = `${wind} km/h`;
    weatherIcon.src = icon_url;

    let gifID = weatherGIFs[weathergif] || weatherGIFs["Clear"]; // Fallback to "Clear" GIF
    let pet_url = `https://api.giphy.com/v1/gifs/${gifID}?api_key=xbzOMuOZIy2p0uPqHHyAjhs6QrQNQKht`;
    let pet_response = await fetch(pet_url);
    let gifData = await pet_response.json();
    gif.src = gifData.data.images.original.url;
    console.log(gif.src);

  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
});


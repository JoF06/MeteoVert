const API_KEY = "08ff47227f87df8c90cefdfe15457efe";

document.getElementById("city-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const city = document.getElementById("city-input").value.trim();
    if (city !== "") {
        loadWeather(city);
    }

    document.getElementById("city-input").value = "";
});

async function loadWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=fr&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            alert("Ville introuvable !");
            return;
        }

        const data = await response.json();
        createWeatherCard(data);

    } catch (error) {
        console.error("Erreur :", error);
    }
}

function createWeatherCard(data) {

    const container = document.createElement("div");
    container.className = "weather-container";

    const condition = data.weather[0].main;   // "Rain", "Snow", "Clear", etc.
    const bgColor = getWeatherColor(condition);

    container.style.backgroundColor = bgColor;

    container.innerHTML = `
        <h2>${data.name}</h2>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
        <p class="weather-temp">${Math.round(data.main.temp)}°C</p>
        <p class="weather-desc">${data.weather[0].description}</p>
        <p>Humidité : ${data.main.humidity}%</p>
        <p>Vent : ${Math.round(data.wind.speed)} km/h</p>
    `;

    document.getElementById("weather-list").appendChild(container);
}

function getWeatherColor(condition) {
    condition = condition.toLowerCase();

    if (condition.includes("clear")) {
        return "#ffe680"; // Soleil
    }
    if (condition.includes("cloud")) {
        return "#8d8d8db5"; // Nuageux
    }
    if (condition.includes("rain")) {
        return "#359affff"; // Pluie
    }
    if (condition.includes("drizzle")) {
        return "#99ccff"; // Bruine
    }
    if (condition.includes("thunder")) {
        return "#8080ff"; // Orage
    }
    if (condition.includes("snow")) {
        return "#ffffff"; // Neige
    }
    if (condition.includes("mist") || condition.includes("fog")) {
        return "#cccccc"; // Brouillard
    }

    return "#f0f0f0"; // Défaut
}

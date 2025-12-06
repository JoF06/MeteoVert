const API_KEY = "08ff47227f87df8c90cefdfe15457efe";

// État de l'application (remplace localStorage)
let spotifyToken = null;

// Gestion de la météo
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

    const condition = data.weather[0].main;
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

// Spotify Config
const clientId = "b862d45ee4854785b4bb4237875d84e7"; // ⬅️ Remplacez par le Client ID de votre app Development
const redirectUri = "https://jof06.github.io/MeteoVert";
const scope = "user-top-read";

console.log("🔗 Redirect URI utilisé :", redirectUri);

// Vérifier si on revient de Spotify (callback)
function checkSpotifyCallback() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    if (token) {
        spotifyToken = token;
        console.log("✅ Token Spotify récupéré !");
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname);
        loadTopTracks();
    }
}

// Bouton Spotify
const loginBtn = document.getElementById("spotify-login");
loginBtn.addEventListener("click", () => {
    const authUrl =
        "https://accounts.spotify.com/authorize" +
        `?client_id=${clientId}` +
        `&response_type=token` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&show_dialog=true`;

    console.log("➡ Redirection Spotify");
    window.location.href = authUrl;
});

// Récupère et affiche les top tracks
async function loadTopTracks() {
    const container = document.getElementById("top-tracks");

    if (!spotifyToken) {
        container.innerHTML = "<p>👇 Connecte-toi à Spotify pour voir tes sons</p>";
        return;
    }

    try {
        const res = await fetch(
            "https://api.spotify.com/v1/me/top/tracks?limit=5",
            { headers: { Authorization: "Bearer " + spotifyToken } }
        );

        if (!res.ok) {
            throw new Error("Erreur API Spotify");
        }

        const data = await res.json();

        if (!data.items) {
            container.innerHTML = "<p>Permission manquante, reconnecte-toi.</p>";
            return;
        }

        container.innerHTML = "<h3>🎧 Tes derniers sons préférés</h3>";

        data.items.forEach(track => {
            container.innerHTML += `
                <div class="track">
                    <img src="${track.album.images[2]?.url || track.album.images[0]?.url}">
                    <span>${track.name} — ${track.artists[0].name}</span>
                </div>
            `;
        });
    } catch (err) {
        console.error("Erreur Spotify :", err);
        container.innerHTML = "<p>Erreur Spotify ❌ Reconnecte-toi</p>";
        spotifyToken = null;
    }
}

// Au chargement de la page
checkSpotifyCallback();
loadTopTracks();



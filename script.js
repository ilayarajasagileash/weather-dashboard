
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const localTime = document.getElementById("localTime");

const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const errorMessage = document.getElementById("errorMessage");
const loadingMessage = document.getElementById("loadingMessage");



searchBtn.addEventListener("click", getWeather);



async function getWeather() {

    const city = cityInput.value.trim();


    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        return;
    }

    
    errorMessage.textContent = "";
    loadingMessage.textContent = "Loading weather...";

    try {


        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        
        if (!locationResponse.ok) {
            throw new Error("Unable to find the city.");
        }

        
        const locationData = await locationResponse.json();


        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found.");
        }


        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;



        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );


        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        
        const weatherData = await weatherResponse.json();



        const currentWeather = weatherData.current;

        const temp = currentWeather.temperature_2m;
        const humidityValue = currentWeather.relative_humidity_2m;
        const wind = currentWeather.wind_speed_10m;
        const weatherCode = currentWeather.weather_code;



        cityName.textContent = location.name;

        countryName.textContent = location.country;

        localTime.textContent =
            `Local time: ${currentWeather.time.replace("T", " ")}`;


        
        temperature.textContent = `${temp} °C`;

        humidity.textContent = `${humidityValue} %`;

        windSpeed.textContent = `${wind} km/h`;


        
        weatherDescription.textContent =
            getWeatherDescription(weatherCode);



        weatherIcon.textContent =
            getWeatherIcon(weatherCode);


        
        loadingMessage.textContent = "";


    } catch (error) {


        loadingMessage.textContent = "";

        
        errorMessage.textContent = error.message;


    
        cityName.textContent = "City Name";

        countryName.textContent = "Country";

        localTime.textContent = "Local time";

        weatherDescription.textContent =
            "Weather condition";

        weatherIcon.textContent = "🌤️";

        temperature.textContent = "-- °C";

        humidity.textContent = "-- %";

        windSpeed.textContent = "-- km/h";
    }
}


function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if (code >= 1 && code <= 3) {
        return "Partly cloudy";
    }

    if (code >= 45 && code <= 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code >= 95 && code <= 99) {
        return "Thunderstorm";
    }

    return "Unknown weather";
}


function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code >= 1 && code <= 3) {
        return "🌤️";
    }

    if (code >= 45 && code <= 48) {
        return "🌫️";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "❄️";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️";
    }

    if (code >= 95 && code <= 99) {
        return "⛈️";
    }

    return "🌤️";
}


cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});

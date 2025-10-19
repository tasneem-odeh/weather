async function getCityData(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

  const response = await fetch(url);

  const json = await response.json();

  return json;
}

async function getWeatherData(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,wind_speed_10m,relative_humidity_2m`;

  const response = await fetch(url);

  const json = await response.json();

  return json;
}

async function getCityAndWeatherData(city) {
  const cityData = await getCityData(city);
  const latitude = cityData.results[0].latitude;
  const longitude = cityData.results[0].longitude;

  const weatherData = await getWeatherData(latitude, longitude);

  return { cityData, weatherData };
}
// Closure
const searchHistoryManager = (function () {
  const history = [];

  return {
    add(city) {
      // history.push(city);
      history.push({ city: city, time: new Date() });
    },
    getAll() {
      return [...history]; 
    },
  };
})();

async function updateWeather(city) {
  const data = await getCityAndWeatherData(city);

  const name = data.cityData.results[0].name;
  const temp = data.weatherData.current.temperature_2m;
  const tempUnit = data.weatherData.current_units.temperature_2m;
  const wind = data.weatherData.current.wind_speed_10m;
  const windUnit = data.weatherData.current_units.wind_speed_10m;
  const rain = data.weatherData.current.rain;
  const isDay = data.weatherData.current.is_day;
  const humidityValue = data.weatherData.current.relative_humidity_2m;
  const humidityValueUnit = data.weatherData.current_units.relative_humidity_2m;

  document.getElementById("city-name").textContent = name;
  document.getElementById("temperature").textContent = `${temp}${tempUnit}`;
  document.getElementById("wind").textContent = `${wind} ${windUnit}`;
  document.getElementById("rain").textContent = `Chance of rain: ${rain}%`;
  document.getElementById(
    "humidityValue"
  ).textContent = `${humidityValue} ${humidityValueUnit}`;

  const icon = document.getElementById("weather-icon");
  icon.className = isDay ? "iconoir-sun-light icon" : "iconoir-half-moon icon";
  icon.style.color = isDay ? "#ffd84d" : "#87CEEB";

  const loader = document.getElementById("loader");
  loader.classList.add("none");

  const card = document.getElementById("card");
  card.classList.add("flex");
  card.classList.remove("none");

  searchHistoryManager.add(
  city
);

console.log(searchHistoryManager.getAll());
  updateHistoryTable();
}
 
function updateHistoryTable() {
  const container = document.getElementById("history-container");
  const tbody = document.querySelector("#history-table tbody");

  const allHistory = searchHistoryManager.getAll();

  if (allHistory.length === 0) {
    container.classList.add("none");
    return;
  }

  container.classList.remove("none");
  tbody.innerHTML = "";

  allHistory.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${index + 1}</td><td>${item.city}</td><td>${item.time.toLocaleTimeString()}</td>`;
    tbody.appendChild(row);
  });
}



document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search");
  searchForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const input = searchForm.querySelector("input");
    const inputValue = input.value;
    updateWeather(inputValue);
  });
});

async function getCityData(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
  
    const response = await fetch(url);
  
    const json = await response.json();
  
    return json;
  }
  
  async function getWeatherData(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,wind_speed_10m`;
  
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
  
  getCityAndWeatherData("Stockholm").then((data) => {
    console.log(data);
    const p = document.createElement("p");
  
      p.textContent = `The current temperature in ${data.cityData.results[0].name} is ${data.weatherData.current.temperature_2m}${data.weatherData.current_units.temperature_2m}`;
      p.id = "weather-info-p";
      p.className = "weather-info abed";
  
    const weatherDiv = document.getElementById("weather-data");
  
    weatherDiv?.appendChild(p);
  });
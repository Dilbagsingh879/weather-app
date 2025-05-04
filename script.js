const apiKey = "69e3d2b1da76d72ac0f0809f4b9e5a30"; 
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBtn").addEventListener("click", getWeather);
  document.getElementById("cityInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") getWeather();
  });

  document.getElementById("cityInput").value = "Delhi"; // Default city
  getWeather();
});

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(weatherUrl)
    .then(res => res.json())
    .then(data => {
      const description = data.weather[0].description || "weather";
      document.getElementById("city").textContent = data.name;
      document.getElementById("temperature").textContent = Math.round(data.main.temp) + "°";
      document.getElementById("description").textContent = description;

      const imageUrl = getImageByWeather(description);
      document.body.style.backgroundImage = `url('${imageUrl}')`;

      getAQI(data.coord.lat, data.coord.lon);
    });

  fetch(forecastUrl)
    .then(res => res.json())
    .then(data => {
      const hourly = document.getElementById("hourlyForecast");
      const daily = document.getElementById("dailyForecast");
      hourly.innerHTML = "";
      daily.innerHTML = "";

      data.list.slice(0, 8).forEach(item => {
        const hour = new Date(item.dt * 1000).getHours();
        hourly.innerHTML += `
          <div>
            <p>${hour}:00</p>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png"/>
            <p>${Math.round(item.main.temp)}°</p>
          </div>
        `;
      });

      for (let i = 0; i < data.list.length; i += 8) {
        const day = new Date(data.list[i].dt_txt).toLocaleDateString(undefined, { weekday: 'short' });
        daily.innerHTML += `
          <div>
            <p>${day}</p>
            <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png"/>
            <p>${Math.round(data.list[i].main.temp)}°</p>
          </div>
        `;
      }
    });
}

function getAQI(lat, lon) {
  const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  fetch(aqiUrl)
    .then(res => res.json())
    .then(data => {
      const aqi = data.list[0].main.aqi;
      document.getElementById("aqi").textContent = "AQI: " + aqi;
    });
}

function getImageByWeather(description) {
  const keyword = description.toLowerCase();
  if (keyword.includes("clear")) return "images/clear.jpg";
  if (keyword.includes("cloud")) return "images/cloudy.jpg";
  if (keyword.includes("rain")) return "images/rain.jpg";
  if (keyword.includes("thunder")) return "images/thunder.jpg";
  if (keyword.includes("snow")) return "images/snow.jpg";
  if (keyword.includes("fog") || keyword.includes("mist")) return "images/fog.jpg";
  return "images/default.jpg"; // fallback
}


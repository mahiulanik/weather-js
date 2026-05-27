const startButton = document.querySelector("#start-button");
const homeButton = document.querySelector("#home-button");
const search = document.querySelector("#inputfield");
const searchIcon = document.querySelector("#searchIcon");
const desc = document.querySelector("#desc");
const temp = document.querySelector("#temp");
const cityName = document.querySelector("#city");
const wind = document.querySelector("#windSpeed");
const humidity = document.querySelector("#humidityper");
const icon = document.querySelector("#icon");
const mainBox1 = document.querySelector(".mainBox1");
const mainBox2 = document.querySelector(".mainBox2");
const mainBox3 = document.querySelector(".mainBox3");

startButton.addEventListener("click", () => {
  mainBox1.classList.add("inactive");
  mainBox2.classList.remove("inactive");
});

const changeIcon = (weatherIcon) => {
  let icons = {
    Clouds: "/images/clouds.png",
    Rain: "/images/rain.png",
    Mist: "/images/mist.png",
    Haze: "/images/haze.png",
    Snow: "/images/snow.png",
    Clear: "/images/clear.png",
  };
  icon.src = icons[weatherIcon] || "/images/clear.png";
};

const url = "https://api.openweathermap.org/data/2.5/weather?";
const apiKey = "5cb2322d7b1dc7a77cafcff136d0a530";

async function getWeatherData(city) {
  let finalUrl = `${url}q=${city}&appid=${apiKey}&units=metric`;
  let response = await fetch(finalUrl);
  let data = await response.json();

  if (data.cod == 404) {
    mainBox2.classList.add("inactive");
    mainBox3.classList.remove("inactive");

    desc.innerHTML = "Description";
    temp.innerHTML = "0°c";
    cityName.innerHTML = "Your City";
    wind.innerHTML = "0km/h";
    humidity.innerHTML = "0%";
    search.value = "";
    icon.src = "/images/clear.png";
  }

  desc.innerHTML = data.weather[0].main;
  temp.innerHTML = Math.round(data.main.temp) + "°c";
  cityName.innerHTML = data.name;
  wind.innerHTML = data.wind.speed + "km/h";
  humidity.innerHTML = data.main.humidity + "%";

  changeIcon(data.weather[0].main);
}

const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?";

async function getForecast(city) {
  const finalUrl = `${forecastUrl}q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(finalUrl);
  const data = await response.json();
  // console.log(data);

  const forecastContainer = document.getElementById("forecastContainer");

  forecastContainer.innerHTML = "";

  // First 8 items = 24 hours
  const next24Hours = data.list.slice(0, 8);

  next24Hours.forEach((item) => {
    const time = item.dt_txt.split(" ")[1].slice(0, 5);
    const temp = Math.round(item.main.temp);
    const icon = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    forecastContainer.innerHTML += `
      <div class="forecastCard">
        <p class="forecastTime">${time}</p>
        <img src="${iconUrl}" />
        <p class="forecastTemp">${temp}°C</p>
      </div>
    `;
  });
}

searchIcon.addEventListener("click", () => {
  getWeatherData(search.value);
  getForecast(search.value);
});

search.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeatherData(search.value);
    getForecast(search.value);
  }
});

homeButton.addEventListener("click", () => {
  mainBox3.classList.add("inactive");
  mainBox2.classList.remove("inactive");
});

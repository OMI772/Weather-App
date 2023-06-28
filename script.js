const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
// const userContainer = document.querySelector(".user-weather");
const grantAccess = document.querySelector(".grantLocationContainer");
const searchForm = document.querySelector("[data-searchLocation]");
const loadingScreen = document.querySelector(".loadingContainer");
const userWeatherInfo = document.querySelector(".user-weather-container");
const errorPage = document.querySelector(".error404");

let currTab = userTab;
const API_key = "62925d44d3c22eb8bcb5814183072e13";
currTab.classList.add("current-tab");
getFromSessionStorage();
errorPage.classList.remove("active");

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

function switchTab(clickedTab) {
  if (clickedTab != currTab) {
    currTab.classList.remove("current-tab");
    currTab = clickedTab;
    currTab.classList.add("current-tab");
  }
  if (!searchForm.classList.contains("active")) {
    grantAccess.classList.remove("active");
    userWeatherInfo.classList.remove("active");
    searchForm.classList.add("active");
  } else {
    searchForm.classList.remove("active");
    userWeatherInfo.classList.remove("active");
    getFromSessionStorage();
  }
}

function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");

  if (!localCoordinates) {
    grantAccess.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantAccess.classList.remove("active");
  errorPage.classList.remove("active");
  loadingScreen.classList.add("active");

  // api call
  try {
    const response = await fetch(
      // `https://pro.openweathermap.org/data/2.5/forecast/climate?lat=${lat}&lon=${lon}&appid=${API_key}`
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userWeatherInfo.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  errorPage.classList.remove("active");
  const city = document.querySelector("[data-city-name]");
  const countryIcon = document.querySelector("[data-country-flag]");
  const desc = document.querySelector("[data-weather-desc]");
  const weatherImg = document.querySelector("[data-weather-img]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-cloud]");

  //fetch info from weatherInfo and update the UI items
  city.innerText = weatherInfo?.name;
  if (city.innerText === "undefined") {
    userWeatherInfo.classList.remove("active");
    errorPage.classList.add("active");
    return;
  }
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherImg.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${(weatherInfo?.main?.temp / 10).toFixed(2)} °C`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  clouds.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showCurrPosition);
  } else {
    console.log("geolocation not supported");
    alert("geolocation not supported");
  }
}

function showCurrPosition(Location) {
  let userCoordinates = {
    lat: Location.coords.latitude,
    lon: Location.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const locationAcessBtn = document.querySelector("[data-grantLocation]");
locationAcessBtn.addEventListener("click", getLocation);

const searchInputCity = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = searchInputCity.value;
  if (inputValue.value === "") {
    return;
  } else {
    fetchSearchedWeatherInfo(inputValue);
  }
});

async function fetchSearchedWeatherInfo(cityName) {
  loadingScreen.classList.add("active");
  grantAccess.classList.remove("active");
  userWeatherInfo.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userWeatherInfo.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    console.log(err);
  }
}

// const API_key = "62925d44d3c22eb8bcb5814183072e13";

// function renderWeatherrDetails(data) {
//   let newPara = document.createElement("p");
//   newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;
//   document.body.appendChild(newPara);
// }

// async function fetchWeatherInfo() {
//   try {
//     const city_name = "Goa";
//     const weather = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_key}`
//     );
//     const data = await weather.json();
//     renderWeatherrDetails(data);
//   } catch (err) {
//     console.log("Some error occured", err);
//   }
// }

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(ShowCurrPosition);
//   } else {
//     console.log("geolacation not supported");
//   }
// }

// function ShowCurrPosition(Position) {
//   let lat = Position.coords.latitude;
//   let longi = Position.coords.longitude;

//   console.log(lat);
//   console.log(longi);
// }

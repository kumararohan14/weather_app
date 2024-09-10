const KEY = "baed5dd5b84149d8a1444713240309";

const date = document.querySelector(".overviewDate");
const currentWeatherIcon = document.querySelector(".weather-icon");
const currentCondition = document.querySelector(".current-condition");
const currentTemp = document.querySelector(".current-temp");
const forcast = document.querySelector(".forcast");
const  cardImg  = document.querySelector(".current-weather-img");
const  celcius  = document.querySelector(".celcius");
const  celcius2  = document.querySelector(".celcius2");
const  f  = document.querySelector(".f");
const  windValue1  = document.querySelector(".wind-value1");
const  windValue2  = document.querySelector(".wind-value2");
const  windDir  = document.querySelector(".wind-dir-value");
const  name  = document.querySelector(".name-value");
const  region  = document.querySelector(".region-value");
const  country  = document.querySelector(".country-value");
const hourlyWeather = document.querySelector(".hourly-weather-content");


async function getCurrentWeather(text) {
    try {
        const res = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${text}&aqi=no`
        );
        return await res.json(); // Ensure you call .json() and use await to get the data
    } catch (e) {
        console.log(e.message); // Corrected typo from e.massage to e.message
    }
}


var map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker with a popup
L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();

// Locate the user's current position and set the map view
map.locate({setView: true, maxZoom: 16});

// When the location is found, add a marker and popup at the location
map.on('locationfound', function(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
});

// Handle location errors (if the user denies location access)
map.on('locationerror', function(e) {
    alert("Location access denied.");
});


document.getElementById('search-btn').addEventListener('click',function(){
    var text = document.querySelector('.search-bar').value;
    viewCurrentWeather(text);
})

async function getHistoryWeatherData(text) {
    try {
        
        const d = new Date();
        
        const data = [];
        for (let index = 3; index >0; index--) {
            d.setDate(d.getDate()-1);
            console.log("index " +index)
            const res = await fetch(
                `http://api.weatherapi.com/v1/history.json?key=${KEY}&q=${text}&dt=${
                  d.toLocaleDateString('en-CA')
                }`
              );
              data.push(await res.json());
        }
        return data;
    } catch (error) {
        
    }
    
}

async function getforcastWeatherData(text) {
    try {
        const res = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=${text}&days=4&aqi=no&alerts=no`
        );
        return await res.json();
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null; 
    }
}


async function viewCurrentWeather(text) {
    const { current, location } = await getCurrentWeather(text);
    const historyWeatherData  = await getHistoryWeatherData(text);
    const weatherdata  = await getforcastWeatherData(text);

    

    const {text1,icon,code} = current.condition;

    currentWeatherIcon.src = icon;
    currentCondition.textContent = current.condition.text;
    currentTemp.textContent = current.dewpoint_c + "c"
    date.textContent = 2024;
    cardImg.src = icon;
    console.log(current);
    console.log("icon "+ icon  );


    forcast.innerHTML = "";
    historyWeatherData.forEach((element) =>{
        forcast.insertAdjacentHTML(
            "beforeend",
            `<div class="forcast-item">
                <p class="date history-date">${element.forecast.forecastday[0].date}</p>
                <img src="${element.forecast.forecastday[0].day.condition.icon}" alt="weather-icon" class="icon history-weather-icon" />
                <h2 class="history-temp">${element.forecast.forecastday[0].day.avgtemp_c} C</h2>
                <p class="history-condition">${element.forecast.forecastday[0].day.condition.text}</p>
                <p class="humidity">${element.forecast.forecastday[0].day.avghumidity}%</p>
              </div>`
          );
        });

     for(i=1 ; i<=3; i++){
            forcast.insertAdjacentHTML(
                "beforeend",
                `<div class="forcast-item">
                    <p class="date history-date">${weatherdata.forecast.forecastday[i].date}</p>
                    <img src="${weatherdata.forecast.forecastday[i].day.condition.icon}" alt="weather-icon" class="icon history-weather-icon" />
                    <h2 class="history-temp">${weatherdata.forecast.forecastday[i].day.avgtemp_c} C</h2>
                    <p class="history-condition">${weatherdata.forecast.forecastday[i].day.condition.text}</p>
                    <p class="humidity">${weatherdata.forecast.forecastday[i].day.avghumidity}%</p>
                  </div>`
              );
            }

            celcius.textContent = current.condition.text;
            celcius2.textContent = current.dewpoint_c;
            f.textContent = current.dewpoint_f;

            windValue1 .textContent   = current.wind_mph 
            windValue2 .textContent   = current.wind_kph
            windDir .textContent   = current.wind_dir
            name .textContent    = location.name
            region.textContent    = location.region
            country.textContent    = location.country

            hourlyWeather.innerHTML = "";
            for(i=1 ; i<=12; i++){
                hourlyWeather.insertAdjacentHTML(
                    "beforeend",
                    `<div class="hourly-item">
                        <p class="hourly-time">${weatherdata.forecast.forecastday[0].hour[i].time.split(' ')[1]}</p>
                        <img src="${weatherdata.forecast.forecastday[0].hour[i].condition.icon}" alt="weather-icon" class="icon hourly-weather-icon" />
                        <h2 class="hourly-temp">${weatherdata.forecast.forecastday[0].hour[i].dewpoint_c} C</h2>
                        <p class="humidity">${weatherdata.forecast.forecastday[0].hour[i].humidity}%</p>
                      </div>`
                  );
                }
            
}
viewCurrentWeather("Sri Lanka");
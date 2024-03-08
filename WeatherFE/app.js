document.getElementById('zipForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const zipCode = document.getElementById('zipInput').value;
    try {
        await fetchWeatherData(zipCode);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayErrorMessage();
    }
});

async function fetchWeatherData(ZipCode, isTicker = false) {
    const apiUrl = `http://34.93.204.178:5000/weather?ZipCode=${ZipCode}`;
    // const apiUrl = `http://127.0.0.1:5000/weather?ZipCode=${ZipCode}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Weather data fetch failed');
    const data = await response.json();
    if (isTicker) {
        displayTickerData(data, ZipCode);
    } else {
        displayWeatherData(data);
    }
}

function displayWeatherData(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = ''; 
    if (data.cod !== "200") {
        weatherDisplay.innerHTML = `<p>Error retrieving weather data</p>`;
        return;
    }
    const cityName = data.city.name;
    const currentWeather = data.list[0];
    // Convert from Kelvin to Celsius
    const tempInCelsius = (currentWeather.main.temp - 273.15).toFixed(2);
    const feelsLikeInCelsius = (currentWeather.main.feels_like - 273.15).toFixed(2);

    weatherDisplay.innerHTML = `
        <h2>Weather for ${cityName}</h2>
        <div>
            <p><strong>Now:</strong> ${tempInCelsius}°C, ${currentWeather.weather[0].description}</p>
            <p>Feels like: ${feelsLikeInCelsius}°C</p>
            <p>Humidity: ${currentWeather.main.humidity}%</p>
        </div>
        <div>
            <h3>Forecast:</h3>
            ${data.list.slice(1, 10).map(period => {
                const tempPeriodInCelsius = (period.main.temp - 273.15).toFixed(2);
                return `
                    <div>
                        <p><strong>${period.dt_txt}:</strong> ${tempPeriodInCelsius}°C, ${period.weather[0].description}</p>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}


function displayErrorMessage() {
    document.getElementById('weatherDisplay').innerHTML = `<p>Unable to retrieve weather data. Please try again later.</p>`;
}

function displayTickerData(data, ZipCode) {
    console.log('displayTickerData', ZipCode);
    const tickerDisplay = document.getElementById('tickerDisplay');
    if (data.cod !== "200") {
        console.error(`Error retrieving weather data for ZIP code ${ZipCode}`);
        return;
    }

    const cityName = data.city.name;
    const currentWeather = data.list[0];
    const tempInCelsius = (currentWeather.main.temp - 273.15).toFixed(2);

    const existingEntry = document.querySelector(`#ticker-${ZipCode}`);
    if (existingEntry) {
        existingEntry.innerHTML = `${cityName}: ${tempInCelsius}°C, ${currentWeather.weather[0].description}`;
    } else {
        const entryDiv = document.createElement('div');
        entryDiv.id = `ticker-${ZipCode}`;
        entryDiv.innerHTML = `${cityName}: ${tempInCelsius}°C, ${currentWeather.weather[0].description}`;
        tickerDisplay.appendChild(entryDiv);
    }
}



document.addEventListener('DOMContentLoaded', function() {
    startWeatherTicker();
});

function startWeatherTicker() {
    const zipCodes = ['sw1a1aa','90011','560001'];
    updateWeatherForCities(zipCodes);
    setInterval(() => updateWeatherForCities(zipCodes), 60000);
}

function updateWeatherForCities(zipCodes) {
    console.log('updateWeatherForCities', zipCodes);
    zipCodes.forEach(zipCode => {
        fetchWeatherData(zipCode, true); 
    });
}



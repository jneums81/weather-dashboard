const apiKey = '0e6c7f3a3e6cc010b40e84fa4133a8ca';
const baseUrl = 'https://api.openweathermap.org/data/2.5';

// Variables to store references to HTML elements
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const currentWeatherContainer = document.getElementById('currentWeatherContainer');
const forecastContainer = document.getElementById('forecastContainer');
const searchHistoryContainer = document.getElementById('searchHistoryContainer');

// Event listener for form submission
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const userCity = cityInput.value;
    fetchWeatherData(userCity);
});

// Fetch weather data from OpenWeather API
function fetchWeatherData(city) {
    const apiUrl = `${baseUrl}/weather?q=${city}&appid=${apiKey}`;

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Check if the city is found
            if (data.cod === '404') {
                alert('City not found.');
            } else {
                displayCurrentWeather(data);
                // Extract latitude and longitude from current weather data and call the forecast function
                const { coord } = data;
                fetchForecast(coord.lat, coord.lon);
                updateSearchHistory(city);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Display current weather conditions
function displayCurrentWeather(data) {
    // Extract relevant data
    const { name, dt, weather, main, wind } = data;
    const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
    const date = new Date(dt * 1000).toLocaleDateString();
    const temp = main.temp;
    const humidity = main.humidity;
    const windSpeed = wind.speed;

    // Create HTML elements to display data
    const currentWeatherHtml = `
        <h2>${name} (${date})</h2>
        <img src="${iconUrl}" alt="${weather[0].description}">
        <p>Temperature: ${temp} &#8451;</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;

    // Update currentWeatherContainer
    currentWeatherContainer.innerHTML = currentWeatherHtml;
}

// Fetch and display 5-day forecast
function fetchForecast(lat, lon) {
    // Construct the API URL for forecast
    const forecastApiUrl = `${baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fetch forecast data from the API
    fetch(forecastApiUrl)
        .then(response => response.json())
        .then(data => {
            displayForecast(data.list);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

// Display 5-day forecast
function displayForecast(forecastData) {
    // Loop through the forecast data and create HTML elements for each day
    const forecastHtml = forecastData.slice(0, 5).map(forecast => {
        const { dt, weather, main, wind } = forecast;
        const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
        const date = new Date(dt * 1000).toLocaleDateString();
        const temp = main.temp;
        const humidity = main.humidity;
        const windSpeed = wind.speed;

        return `
            <div class="forecast-day">
                <h3>${date}</h3>
                <img src="${iconUrl}" alt="${weather[0].description}">
                <p>Temperature: ${temp} &#8451;</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            </div>
        `;
    }).join('');

    // Update forecastContainer
    forecastContainer.innerHTML = forecastHtml;
}

// Update search history
function updateSearchHistory(city) {
    // Get the existing search history from local storage or initialize an empty array
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Add the searched city to the history
    searchHistory.push(city);

    // Store the updated history in local storage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    // Display the updated history
    displaySearchHistory();
}

// Display search history
function displaySearchHistory() {
    // Get the search history from local storage
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Create a clickable list of cities
    const historyHtml = searchHistory.map(city => {
        return `<li class="history-item">${city}</li>`;
    }).join('');

    // Add event listeners to history items
    searchHistoryContainer.innerHTML = `<ul>${historyHtml}</ul>`;
    const historyItems = searchHistoryContainer.querySelectorAll('.history-item');
    historyItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedCity = item.textContent;
            fetchWeatherData(selectedCity);
        });
    });
}

// Initial page load: Load and display search history
displaySearchHistory();

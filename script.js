// Add an event listener for form submission
searchForm.addEventListener('submit', function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the user's input from the cityInput element
    const userInput = cityInput.value;

    // Call a function to fetch weather data with the user's input
    fetchWeatherData(userInput);
});

// Define the fetchWeatherData function to fetch weather data based on the user's input
function fetchWeatherData(city) {
    // Construct the API URL using the user's input and API key
    const apiUrl = `${baseUrl}weather?q=${city}&appid=${apiKey}`;

    // Fetch data from the API using the constructed URL
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                // Handle the case where the API request returns an error
                throw new Error('City not found or other API error');
            }
            return response.json();
        })
        .then(data => {
            // Check if the API response contains an error message
            if (data.cod === '404') {
                // Handle the case where the city is not found
                alert('City not found. Please enter a valid city name.');
                return;
            }

            // Process the data and update the currentWeatherContainer
            // with the current weather information
            updateCurrentWeatherUI(data);

            // You can also store the search history and update the searchHistoryContainer
            // with the latest search
            updateSearchHistory(city);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            // Handle other errors that may occur during the fetch
        });
        // Inside the fetchWeatherData function after successfully fetching data
        displayCurrentWeather(data);

    // Process the data and update the currentWeatherContainer
    // with the current weather information
    updateCurrentWeatherUI(data);

    // Extract lat and lon from the current weather API response
    const lat = data.coord.lat;
    const lon = data.coord.lon;

    // Call a function to fetch the 5-day forecast using lat and lon
    fetchFiveDayForecast(lat, lon);

    // You can also store the search history and update the searchHistoryContainer
    // with the latest search
    updateSearchHistory(city);
}





// Define a function to update the UI with current weather data
function updateCurrentWeatherUI(weatherData) {
    // Update the currentWeatherContainer with the weather information
    // You can create and append HTML elements to display the data
    // For example:
    currentWeatherContainer.innerHTML = `
        <h2>Current Weather in ${weatherData.name}</h2>
        <p>Temperature: ${weatherData.main.temp}°C</p>
        <p>Weather Condition: ${weatherData.weather[0].description}</p>
        <!-- Add more data as needed -->
    `;
}

// Define a function to update the search history
function updateSearchHistory(city) {
    // You can add the searched city to the search history list
    const searchHistoryItem = document.createElement('li');
    searchHistoryItem.textContent = city;
    searchHistoryList.appendChild(searchHistoryItem);
}

// Define a function to display the current weather conditions
function displayCurrentWeather(weatherData) {
    // Extract relevant data from the API response
    const cityName = weatherData.name;
    const date = new Date(weatherData.dt * 1000); // Convert timestamp to date
    const iconUrl = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    const temperature = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;

    // Create HTML elements to display the data
    const weatherInfoContainer = document.createElement('div');
    weatherInfoContainer.classList.add('weather-info');

    const cityElement = document.createElement('h2');
    cityElement.textContent = `Current Weather in ${cityName}`;

    const dateElement = document.createElement('p');
    dateElement.textContent = `Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    const iconElement = document.createElement('img');
    iconElement.src = iconUrl;
    iconElement.alt = weatherData.weather[0].description;

    const temperatureElement = document.createElement('p');
    temperatureElement.textContent = `Temperature: ${temperature}°C`;

    const humidityElement = document.createElement('p');
    humidityElement.textContent = `Humidity: ${humidity}%`;

    const windSpeedElement = document.createElement('p');
    windSpeedElement.textContent = `Wind Speed: ${windSpeed} m/s`;

    // Append the created elements to the weatherInfoContainer
    weatherInfoContainer.appendChild(cityElement);
    weatherInfoContainer.appendChild(dateElement);
    weatherInfoContainer.appendChild(iconElement);
    weatherInfoContainer.appendChild(temperatureElement);
    weatherInfoContainer.appendChild(humidityElement);
    weatherInfoContainer.appendChild(windSpeedElement);

    // Update the currentWeatherContainer with the weatherInfoContainer
    currentWeatherContainer.innerHTML = ''; // Clear previous content
    currentWeatherContainer.appendChild(weatherInfoContainer);
}

// Define a function to fetch the 5-day forecast using lat and lon
function fetchFiveDayForecast(lat, lon) {
    // Construct the API URL for the 5-day forecast using lat, lon, and the API key
    const forecastUrl = `${baseUrl}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fetch data from the 5-day forecast API
    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching 5-day forecast data');
            }
            return response.json();
        })
        .then(data => {
            // Process the 5-day forecast data and display it
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching 5-day forecast data:', error);
            // Handle errors
        });
}

// Define a function to display the 5-day forecast
function displayForecast(forecastData) {
    // Clear the forecastContainer
    forecastContainer.innerHTML = '';

    // Loop through the forecast data
    forecastData.list.forEach(forecast => {
        // Extract relevant data for each forecast
        const date = new Date(forecast.dt * 1000);
        const iconUrl = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
        const temperature = forecast.main.temp;
        const humidity = forecast.main.humidity;
        const windSpeed = forecast.wind.speed;

        // Create HTML elements to display the forecast data
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        const dateElement = document.createElement('p');
        dateElement.textContent = `Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        const iconElement = document.createElement('img');
        iconElement.src = iconUrl;
        iconElement.alt = forecast.weather[0].description;

        const temperatureElement = document.createElement('p');
        temperatureElement.textContent = `Temperature: ${temperature}°C`;

        const humidityElement = document.createElement('p');
        humidityElement.textContent = `Humidity: ${humidity}%`;

        const windSpeedElement = document.createElement('p');
        windSpeedElement.textContent = `Wind Speed: ${windSpeed} m/s`;

        // Append the created elements to the forecastItem
        forecastItem.appendChild(dateElement);
        forecastItem.appendChild(iconElement);
        forecastItem.appendChild(temperatureElement);
        forecastItem.appendChild(humidityElement);
        forecastItem.appendChild(windSpeedElement);

        // Append the forecastItem to the forecastContainer
        forecastContainer.appendChild(forecastItem);
    });
}




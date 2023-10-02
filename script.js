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
    // You can use the OpenWeather API to fetch weather data here
    // Construct the API URL using the apiKey and city
    const apiUrl = `${baseUrl}weather?q=${city}&appid=${'0e6c7f3a3e6cc010b40e84fa4133a8ca'}`;

    // You can use fetch or any other method to make an API request
    // and handle the response to update the UI with weather data
    // For example:
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process the data and update the currentWeatherContainer
            // with the current weather information
            updateCurrentWeatherUI(data);

            // You can also store the search history and update the searchHistoryContainer
            // with the latest search
            updateSearchHistory(city);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
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

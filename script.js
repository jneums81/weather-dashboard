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

let baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
let key = 'f4507cf842a6930d63dc7b1e9c8d0f9a';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
    const postCode = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;
    console.log(newDate);
    getTemperature(baseURL, postCode, key)
        .then(function (data) {
            // Add data to POST request
            postData('http://localhost:1337/addWeatherData', { temperature: data.main.temp, date: newDate, user_response: feelings, cityName: data.name })
                // Function which updates UI
                .then(function () {
                    updateUI()
                })
        })
}

// Async GET
const getTemperature = async (baseURL, code, key) => {
    const response = await fetch(baseURL + code + ',us' + '&APPID=' + key)
    console.log(response);
    
    try {
        const data = await response.json();
            console.log(data);
            return data;        
    }
    catch (error) {
        console.log('error', error);
    }
}

// Async POST
const postData = async (url = '', data = {}) => {
    const postRequest = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try {
        const newData = await postRequest.json();
        return newData;
    }
    catch (error) {
        console.log('Error', error.error);
    }
}

// Update user interface
const updateUI = async () => {
    const request = await fetch('http://localhost:1337/all');
    try {
        const allData = await request.json();
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('temp').innerHTML = tempConversion(allData.temperature);
        document.getElementById('content').innerHTML = allData.user_response;
        document.getElementById('city_name').innerHTML = allData.cityName;
        
    }
    catch (error) {
        console.log('error', error);
    }
}

// Convert temperature unit from kelvin to celsius
function tempConversion(kelvin) {
    let celsius = Math.floor(kelvin - 273)
    return `${celsius}°C` // Shift + option + 8 for degree symbol
}
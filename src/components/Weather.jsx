import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import humidity_icon from "../assets/humidity.png";
import wind_icon from "../assets/wind.png";

const Weather = () => {
  const inputRef = useRef(null);
  const [weatherData, setWeatherData] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const search = async (city) => {
    if (city === "") {
      setErrorMessage("Please enter a city name.");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      // Check if the city was found
      if (data.cod !== 200) {
        setErrorMessage("City not found. Please try again.");
        setWeatherData(false); // Clear weather data on error
        return;
      }

      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      setWeatherData({
        temperature: Math.floor(data.main.temp),
        location: data.name,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: iconUrl,
      });
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      setWeatherData(false);
      console.error("City Not Found", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    search("Skhirat");
  }, []);

  return (
    <div>
      <div className="weather">
        <div className="search-bar">
          <input
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const searchValue = inputRef.current.value;
                inputRef.current.value = "";
                inputRef.current.focus();
                search(searchValue);
              }
            }}
            type="text"
            placeholder="Search"
          />
          <img
            src={search_icon}
            alt=""
            onClick={() => {
              const searchValue = inputRef.current.value;
              inputRef.current.value = "";
              inputRef.current.focus();
              search(searchValue);
            }}
          />
        </div>

        {errorMessage ? <p className="error-message">{errorMessage}</p> : <></>}

        {weatherData ? (
          <>
            <img src={weatherData.icon} alt="" className="weather-icon" />
            <p className="temperature">{weatherData.temperature}°C</p>
            <p className="location">{weatherData.location}</p>

            <div className="weather-data">
              <div className="col">
                <img src={humidity_icon} alt="" />
                <div>
                  <p>{weatherData.humidity} %</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="col">
                <img src={wind_icon} alt="" />
                <div>
                  <p>{weatherData.windSpeed} Km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Weather;

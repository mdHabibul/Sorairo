import { useState, useEffect } from 'react'
import AiOverview from './AiOverview'
import './App.css'

function App() {
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        console.log('Location:', position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )
  }, [])

  useEffect(() => {
    if (!location) return

    const fetchWeatherData = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=rain,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,wind_speed_10m,wind_direction_10m&forecast_days=1
`
        console.log(url)
        const response = await fetch(url)
        const weatherData = await response.json()
        setWeather(weatherData)
        console.log(weatherData)
      } catch (error) {
        console.error('Error fetching weather data:', error)
      }
    }

    fetchWeatherData()
  }, [location])

  return (
    <div className='flex flex-col justify-center items-center h-full w-full'>
      <div className='text-center text-blue-400 font-medium'>
        <h1 className='text-blue-600 font-black text-5xl mt-10'>Sora<span className='text-teal-800'>iro</span></h1>
        <p className="mb-10 font-thin">Use your location to get weather information</p>
        {weather ? (
          <div className='text-center w-130'>
            <div className='flex justify-around'>
              <div>
                <p>Latitude</p>
                <p className='text-3xl text-blue-500'>{location?.latitude.toFixed(6)}</p>
              </div>

              <div>
                <p>Longitude</p>
                <p className='text-3xl text-blue-500'>{location?.longitude.toFixed(6)}</p>
              </div>
            </div>

            <div className='flex justify-around my-5'>
              <div>
                <p>Temperature</p>
                <p className='text-3xl text-blue-500'>{weather.current.temperature_2m}°C</p>
              </div>

              <div>
                <p>Humidity</p>
                <p className='text-3xl text-blue-500'>{weather.current.relative_humidity_2m}%</p>
              </div>
            </div>

            <div className='flex justify-around mb-5'>
              <div>
                <p>Precipitation</p>
                <p className='text-3xl text-blue-500'>{weather.current.precipitation} mm</p>
              </div>

              <div>
                <p>Wind Speed</p>
                <p className='text-3xl text-blue-500'>{weather.current.wind_speed_10m} km/h</p>
              </div>
            </div>

            <div>
              <div>
                <p>Wind Direction</p>
                <p className='text-3xl text-blue-500'>{weather.current.wind_direction_10m}°</p>
              </div>
            </div>
          </div>
        ) : <p className='italic text-cyan-900'>Loading weather data.....</p>}
      </div>
      {weather && <div>
        <div><AiOverview weather={weather} className="bg-red-500" /></div>
      </div>}
    </div>
  )
}

export default App
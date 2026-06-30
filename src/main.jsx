import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WeatherApp from './weather.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WeatherApp />
  </StrictMode>,
)

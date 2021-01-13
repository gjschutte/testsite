require('dotenv').config();

const fetch = require('node-fetch');
const winLogger = require('../winlogger');

// Helper function to check the status of an API-call

function handleErrors(res) {
  if (!res.ok) {
    throw Error(res.statusText);
  }
  return res;
}

const createIconMap = () => {
  const iconMap = new Map();
  iconMap.set(200, 'thunderstorm')
    .set(201, 'thunderstorm')
    .set(202, 'thunderstorm')
    .set(210, 'lightning')
    .set(211, 'lightning')
    .set(212, 'lightning')
    .set(221, 'lightning')
    .set(230, 'thunderstorm')
    .set(231, 'thunderstorm')
    .set(232, 'thunderstorm')
    .set(300, 'sprinkle')
    .set(301, 'sprinkle')
    .set(302, 'rain')
    .set(310, 'rain-mix')
    .set(311, 'rain')
    .set(312, 'rain')
    .set(313, 'showers')
    .set(314, 'rain')
    .set(321, 'sprinkle')
    .set(500, 'sprinkle')
    .set(501, 'rain')
    .set(502, 'rain')
    .set(503, 'rain')
    .set(504, 'rain')
    .set(511, 'rain-mix')
    .set(520, 'showers')
    .set(521, 'showers')
    .set(522, 'showers')
    .set(531, 'storm-showers')
    .set(600, 'snow')
    .set(601, 'snow')
    .set(602, 'sleet')
    .set(611, 'rain-mix')
    .set(612, 'rain-mix')
    .set(615, 'rain-mix')
    .set(616, 'rain-mix')
    .set(620, 'rain-mix')
    .set(621, 'snow')
    .set(622, 'snow')
    .set(701, 'showers')
    .set(711, 'smoke')
    .set(721, 'day-haze')
    .set(731, 'dust')
    .set(741, 'fog')
    .set(761, 'dust')
    .set(762, 'dust')
    .set(771, 'cloudy-gusts')
    .set(781, 'tornado')
    .set(800, 'day-sunny')
    .set(801, 'cloudy-gusts')
    .set(802, 'cloudy-gusts')
    .set(803, 'cloudy-gusts')
    .set(804, 'cloudy')
    .set(900, 'tornado')
    .set(901, 'storm-showers')
    .set(902, 'hurricane')
    .set(903, 'snowflake-cold')
    .set(904, 'hot')
    .set(905, 'windy')
    .set(906, 'hail')
    .set(957, 'strong-wind');

  return iconMap;
};

const createIconMapNight = () => {
  const iconMapNight = new Map();
  /* Set of Night-icons, which do not start with night-alt */
  iconMapNight.set(711, 'smoke')
    .set(721, 'day-haze')
    .set(731, 'dust')
    .set(741, 'night-fog')
    .set(761, 'dust')
    .set(762, 'dust')
    .set(781, 'tornado')
    .set(800, 'nigth-clear')
    .set(801, 'night-alt-cloudy-gusts')
    .set(802, 'night-alt-cloudy-gusts')
    .set(803, 'night-alt-cloudy-gusts')
    .set(804, 'night-alt-cloudy')
    .set(900, 'tornado')
    .set(902, 'hurricane')
    .set(903, 'snowflake-cold')
    .set(904, 'hot')
    .set(905, 'windy')
    .set(906, 'night-alt-hail')
    .set(957, 'strong-wind');

  return iconMapNight;
};

const convertIcon = (weatherIcons, oldIcon, id) => {
  /* Icon list is general. If night, then change the icon to the
  ** corresponding night icon by adding alt-night. And for some
  ** icons, the name starts not with alt-night. For those, look in
  ** iconMapNight.
  */
  const dayNight = oldIcon.charAt(oldIcon.length - 1);
  let newIcon = weatherIcons.get(id);

  if (dayNight === 'd') {
    newIcon = `day-${newIcon}`;
  }
  if (dayNight === 'n') {
    newIcon = `night-alt-${newIcon}`;
    const weatherIconsNight = createIconMapNight();
    const altNightIcon = weatherIconsNight.get(id);
    if (altNightIcon != null) {
      newIcon = altNightIcon;
    }
    console.log(`NightIcon: ${newIcon}`);
  }
  return newIcon;
};

const convertTemp = (temp) => (Math.round(temp * 10)) / 10;

const formatTime = (timeStamp) => {
  const time1 = new Date(timeStamp * 1000);
  const options = { hour: 'numeric', minute: 'numeric' };
  return time1.toLocaleTimeString(options);
};

const convertWindDirection = (deg) => {
  const directions = ['North', 'North North East', 'North East', 'East North East',
    'East', 'East South East', 'South East', 'South South East',
    'South', 'South South West', 'South West', 'West South West',
    'West', 'West North West', 'North West', 'North North West'];

  const rawPosition = Math.floor((deg / 22.5) + 0.5);
  console.log(`Raw: ${rawPosition}`);
  const arrayPosition = (rawPosition % 16);
  console.log(`Array: ${arrayPosition}`);
  return directions[arrayPosition];
};

const convertWindSpeed = (ms) => {
  // Convert the wind speed, from meter/second to beaufort
  if (ms < 0.3) {
    return 0;
  }
  if (ms < 1.6) {
    return 1;
  }
  if (ms < 3.4) {
    return 2;
  }
  if (ms < 5.5) {
    return 3;
  }
  if (ms < 8.0) {
    return 4;
  }
  if (ms < 10.8) {
    return 5;
  }
  if (ms < 13.9) {
    return 6;
  }
  if (ms < 17.2) {
    return 7;
  }
  if (ms < 20.8) {
    return 8;
  }
  if (ms < 24.5) {
    return 9;
  }
  if (ms < 28.5) {
    return 10;
  }
  if (ms < 32.7) {
    return 11;
  }
  return 12;
};

const getWeather = (inputCity, res) => {
  winLogger.info('GET for current weather');
  console.log('in getWeather');
  console.log(inputCity);

  const { WEATHERAPIKEY } = process.env;
  const city = inputCity;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHERAPIKEY}`;
  const weatherIcons = createIconMap();
  console.log(`weathericons: ${weatherIcons.get(201)}`);

  fetch(url)
    .then(handleErrors)
    .then((response) => response.json())
    .then((data) => {
      data.main.temp = convertTemp(data.main.temp);
      data.main.feels_like = convertTemp(data.main.feels_like);
      data.wind.speedConv = convertWindSpeed(data.wind.speed);
      data.wind.direction = convertWindDirection(data.wind.deg);
      data.weather[0].iconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      data.weather[0].newIcon = `wi-${convertIcon(weatherIcons, data.weather[0].icon, data.weather[0].id)}`;
      console.log(data);
      res.render('weather/index', {
        title: 'Weather page',
        data,
      });
    })
    .catch((err) => console.log(err));

  return 0;
};

// GET the weather index page
exports.weather_index = (req, res, next) => {
  let city = '';
  // Use the stored city. Otherwise, default is Apeldoorn
  if (typeof req.session.city !== 'undefined') {
    city = req.session.city;
  } else {
    city = 'Apeldoorn';
  }
  // Store the city
  req.session.city = city;
  getWeather(city, res);
};

// POST for current weather page
exports.current_post = (req, res, next) => {
  console.log('In current post');
  // Store the city
  req.session.city = req.body.city;
  getWeather(req.body.city, res);
};

const getForecast = (inputCity, res) => {
  // Function: get the Forecast used for graphs
  const { WEATHERAPIKEY } = process.env;
  const city = inputCity;
  const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${WEATHERAPIKEY}`;

  fetch(url)
    .then(handleErrors)
    .then((response) => response.json())
    .then((data) => {
      /* Format the dates: Day and hour */
      let i;
      for (i = 0; i < data.list.length; i += 1) {
        data.list[i].date = new Date(data.list[i].dt * 1000);
        const wd = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(data.list[i].date);
        const hour = new Intl.DateTimeFormat('en', { hour: '2-digit' }).format(data.list[i].date);
        data.list[i].printDate = `${wd} ${hour}`;
        data.list[i].windSpeed = convertWindSpeed(data.list[i].wind.speed);
      }
      console.log(data);

      res.render('weather/forecast', {
        title: 'Weather forecast',
        data,
      });
    })
    .catch((err) => console.log(err));
  return 0;
};

// GET the forecast, display graphs
exports.weather_forecast = (req, res, next) => {
  let city = '';
  // Use the stored city. Otherwise, default is Apeldoorn
  if (typeof req.session.city !== 'undefined') {
    city = req.session.city;
  } else {
    city = 'Apeldoorn';
  }
  // Store the city
  req.session.city = city;
  // Call thcast and display the graphs
  getForecast(city, res);
};

// POST for the forecast, display graphs
exports.weather_forecast_post = (req, res, next) => {
  // Store the city
  req.session.city = req.body.city;
  // Call the forecast and display the graphs
  getForecast(req.body.city, res);
};

const getDaily = (inputCity, res) => {
  // Function: get the daily forecast

  // nominatim variables
  const city = inputCity;
  const format = 'json';
  const url = `https://nominatim.openstreetmap.org/search?q=${city}&format=${format}&limit=1`;

  // Openweathermap variables
  const { WEATHERAPIKEY } = process.env;
  const weatherIcons = createIconMap();
  const exclude = 'current,minutely,hourly,alerts';

  // First, get the latitude and longitude
  fetch(url)
    .then(handleErrors)
    .then((response1) => response1.json())
    .then((data1) => {
      console.log(`Citydata: ${data1}`);
      const { lat } = data1[0];
      const { lon } = data1[0];
      const url2 = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=metric&appid=${WEATHERAPIKEY}`;
      // Second, get the forecast using the latitude and longitude
      fetch(url2)
        .then(handleErrors)
        .then((response) => response.json())
        .then((data) => {
          let i;
          for (i = 0; i < data.daily.length; i += 1) {
            const tempDate = new Date(data.daily[i].dt * 1000);
            data.daily[i].weekDay = Intl.DateTimeFormat('en', { weekday: 'short' }).format(tempDate);
            data.daily[i].sunriseFormat = formatTime(data.daily[i].sunrise);
            data.daily[i].sunsetFormat = formatTime(data.daily[i].sunset);
            data.daily[i].temp.min = convertTemp(data.daily[i].temp.min);
            data.daily[i].temp.max = convertTemp(data.daily[i].temp.max);
            data.daily[i].temp.morn = convertTemp(data.daily[i].temp.morn);
            data.daily[i].temp.day = convertTemp(data.daily[i].temp.day);
            data.daily[i].temp.eve = convertTemp(data.daily[i].temp.eve);
            data.daily[i].windSpeed = convertWindSpeed(data.daily[i].wind_speed);
            data.daily[i].windDirection = convertWindDirection(data.daily[i].wind_deg);
            data.daily[i].newIcon = `wi-${weatherIcons.get(data.daily[i].weather[0].id)}`;
            data.daily[i].dayNumber = i;

            if (typeof data.daily[i].rain === 'undefined') {
              data.daily[i].rain = 0;
            }
            if (typeof data.daily[i].snow === 'undefined') {
              data.daily[i].snow = 0;
            }
          }
          data.city = city;
          console.log(data);

          res.render('weather/daily', {
            title: 'Daily weather forecast',
            data,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err1) => console.log(err1));
  return 0;
};

// GET the daily forecast
exports.weather_daily = (req, res, next) => {
  let city = '';
  // Use the stored city. Otherwise, default is Apeldoorn
  if (typeof req.session.city !== 'undefined') {
    city = req.session.city;
  } else {
    city = 'Apeldoorn';
  }
  // Store the city
  req.session.city = city;
  // Call the forecast and display the graphs
  getDaily(city, res);
};

// POST for the daily forecast
exports.weather_daily_post = (req, res, next) => {
  console.log('In daily post');
  // Store the city
  req.session.city = req.body.city;
  // Call the forecast and display the daily forecast
  getDaily(req.body.city, res);
};

// Geolocation
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    let lat, lon, weather, air_quality;
    try {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      document.getElementById('latitude').textContent = lat.toFixed(2);
      document.getElementById('longitude').textContent = lon.toFixed(2);
      const openWeatherURL = `/weather/${lat},${lon}`;
      const response = await fetch(openWeatherURL);
      const json = await response.json();
      // console.log(json);

      weather = json.weather;
      // console.log(weather);

      const air_score = json.air_quality;

      const aq_score = (aq_raw) => {
        let aqs = '';
        if (air_score === 1) {
          return (aqs = 'good');
        } else if (air_score === 2) {
          return (aqs = 'fair');
        } else if (air_score === 3) {
          return (aqs = 'moderate');
        } else if (air_score === 4) {
          return (aqs = 'poor');
        } else if (air_score === 5) {
          return (aqs = 'very poor');
        } else {
          return (aqs = 'No air quality score available');
        }
      };

      const aq_res = aq_score(json.air_quality);
      // console.log(aq_res);

      document.getElementById('summary').textContent =
        weather.weather[0].description;
      document.getElementById('temp').textContent = weather.main.temp;
      document.getElementById('aq').textContent = aq_res;

      air_quality = {
        aq_raw: json.air_quality,
        aq_desc: aq_res,
      };
      const data = { lat, lon, weather, air_quality };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      const db_response = await fetch('/api', options);
      const db_json = await db_response.json();
      console.log(db_json);
    } catch (err) {
      console.log(err);
    }
  });
} else {
  console.log('Geolocation is not available...');
}

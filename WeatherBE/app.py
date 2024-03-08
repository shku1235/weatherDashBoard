from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

from geopy.geocoders import Nominatim

app = Flask(__name__)
CORS(app)


API_KEY = '24eb4fea8b1bd4ee7423c50950928446'
BASE_URL = "https://api.openweathermap.org/data/2.5/forecast?"


def get_lat_long_from_zip(zip_code):
    geolocator = Nominatim(user_agent="trail")
    location = geolocator.geocode(zip_code)
    return (location.latitude, location.longitude)


@app.route('/weather', methods=['GET'])
def get_weather():
    ZipCode = request.args.get('ZipCode', '')
    print(ZipCode)
    lat, lon = get_lat_long_from_zip(ZipCode)
    print(lat, lon)
    url = f"{BASE_URL}lat={lat}&lon={lon}&appid={API_KEY}"

    response = requests.get(url)
    weather_data = response.json()

    print(weather_data);

    return jsonify(weather_data)

if __name__ == '__main__':
    app.run(debug=True)


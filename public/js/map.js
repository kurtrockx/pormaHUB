import L from "leaflet";
import "leaflet/dist/leaflet.css";

let map;

const getLocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve([latitude, longitude]);
        },
        (error) => {
          console.log("Error occurred. Error code: " + error.code);
          reject(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      reject(new Error("Geolocation is not supported"));
    }
  });
};

const spawnMap = async (onClickCallback) => {
  const latlng = await getLocation();

  map = L.map("map").setView(latlng, 16);

  L.tileLayer(
    "https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=d0fc7b659e204326a94c3fd8ba63e93b",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  ).addTo(map);

  let currentMarker = null;

  map.on("click", (event) => {
    const clickedLatLng = event.latlng;
    const latitude = clickedLatLng.lat;
    const longitude = clickedLatLng.lng;

    if (currentMarker) {
      map.removeLayer(currentMarker);
    }

    const customIcon = L.icon({
      iconUrl: "https://i.ibb.co/x6gN6FJ/image.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    currentMarker = L.marker(clickedLatLng, { icon: customIcon })
      .addTo(map)
      .openPopup();

    if (onClickCallback) {
      onClickCallback([latitude, longitude]);
    }
  });
};

export const clickMap = async () => {
  await spawnMap((coordinates) => {
    console.log(coordinates);
    return coordinates;
  });
};

import React, { Component } from "react";
import mapbox from "mapbox-gl";

import "./Map.css";

class Map extends Component {
  state = {
    points: []
  };
  componentDidMount() {
    mapbox.accessToken = process.env.REACT_APP_MAP_TOKEN;
    this.map = new mapbox.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v9",
      zoom: 4,
      center: [37.799973, 0.448375]
    });

    this.map.on("load", () => {
      fetch(`${process.env.REACT_APP_POINT_URL}/points`)
        .then(resp => resp.json())
        .then(data => {
          const geojson1 = {
            type: "FeatureCollection",
            features: this.createFeatures(data.first)
          };
          const geojson2 = {
            type: "FeatureColection",
            features: this.createFeatures(data.second)
          };

          this.addGeojsonToMap(geojson1, "marker1");
          this.addGeojsonToMap(geojson2, "marker2");
        });
    });
  }
  addGeojsonToMap = (geojson, className) => {
    geojson.features.forEach(marker => {
      // create a HTML element for each feature
      var el = document.createElement("div");
      el.className = className;

      // make a marker for each feature and add to the map
      new mapbox.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(
          new mapbox.Popup({ offset: 25 }) // add popups
            .setHTML(
              "<h3>" +
                marker.properties.title +
                "</h3><p>" +
                marker.properties.description +
                "</p>"
            )
        )
        .addTo(this.map);
    });
  };
  createFeatures = cords => {
    return cords.map(cord => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [cord.point.longitude, cord.point.latitude]
        },
        properties: {
          title: cord.name,
          description: ""
        }
      };
    });
  };
  render() {
    return <div id="map" />;
  }
}

export default Map;

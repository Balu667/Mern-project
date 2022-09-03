/** @format */

import React, { useRef, useEffect } from "react";

import "./Map.css";

const Map = (props) => {
  const mapRef = useRef(null);

  const { center, zoom } = props;

  useEffect(() => {
    let map;
    if (mapRef.current && !map) {
      map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
      });
    }

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;

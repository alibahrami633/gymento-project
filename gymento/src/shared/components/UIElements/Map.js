import React, { useRef, useEffect } from "react";

import "./Map.css";

const Map = (props) => {
  // this is pointer which points to the div with ref=mapRef. This pointer keeps the value of the div disregard of statechange
  const mapRef = useRef();

  const { center, zoom } = props;

  // we use useEffect instead of useState because we need any center and zoom dependencies change results in the useEffect logic to re-run so the new map with new info gets rendered. useEffect runs after the JSX (return) is executed (didMount) because ref in JSX requires the mapRef to be initiated
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

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

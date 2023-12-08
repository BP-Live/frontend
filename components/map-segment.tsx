"use client";

import * as THREE from "three";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useRef, useEffect, useState } from "react";
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// @ts-ignore
import { ThreeJSOverlayView } from "@googlemaps/three";

export function MapSegment() {
  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_MAP_API_KEY!}>
      <MapElement />
    </Wrapper>
  );
}

function MapElement() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    getMapAsync(mapRef.current).then((map) => setMap(map));
  }, []);

  useEffect(() => {
    if (!map) return;

    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xff00ff, 0.75);

    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);

    directionalLight.position.set(0, 10, 50);
    scene.add(directionalLight);

    // Load the model.
    const loader = new GLTFLoader();
    const url =
      "https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf";

    // @ts-ignore
    loader.load(url, (gltf) => {
      gltf.scene.scale.set(6, 6, 6);
      gltf.scene.rotation.x = Math.PI;
      gltf.scene.position.set(0, 0, 100);
      scene.add(gltf.scene);

      let { tilt, heading, zoom } = cameraOptions;

      const animate = () => {
        heading += 0.2;

        map.moveCamera({ tilt, heading, zoom });

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    });

    new ThreeJSOverlayView({
      map,
      scene,
      THREE,
      anchor: { ...cameraOptions.center, altitude: 0 },
    });
  }, [map]);

  return <div ref={mapRef} className="w-full h-full" />;
}

const cameraOptions = {
  center: { lat: 47.507155, lng: 19.045742 },
  heading: 0,
  tilt: 45,
  zoom: 17.5,
};

const mapOptions = {
  mapId: process.env.NEXT_PUBLIC_MAP_ID,
  disableDefaultUI: true,
  disableDoubleClickZoom: true,
  gestureHandling: "none",
  keyboardShortcuts: false,
};

async function getMapAsync(ref: HTMLElement): Promise<google.maps.Map> {
  const { Map } = (await google.maps.importLibrary(
    "maps",
  )) as google.maps.MapsLibrary;

  const map = new Map(ref, { ...cameraOptions, ...mapOptions });

  return map;
}

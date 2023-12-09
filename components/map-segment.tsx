"use client";

import * as THREE from "three";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useRef, useEffect, useState } from "react";
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// @ts-ignore
import { ThreeJSOverlayView } from "@googlemaps/three";
import axios from "@/lib/config/axios";
import { setInterval } from "timers";
import { RestaurantJson } from "@/lib/types";

export function MapSegment({ json }: { json: RestaurantJson | null }) {
  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_MAP_API_KEY!}>
      <MapElement json={json} />
    </Wrapper>
  );
}

function MapElement({ json }: { json: RestaurantJson | null }) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    getMapAsync(mapRef.current).then((map) => setMap(map));
  }, []);

  useEffect(() => {
    if (!json?.metadata?.location) return;

    const loc = json.metadata?.location;

    new google.maps.Marker({
      position: { lat: loc.lat, lng: loc.lng },
      label: json.metadata?.name,
      icon: "/business2.png",
      map,
    });

    json.competitors?.forEach((comp: any) => {
      new google.maps.Marker({
        position: { lat: comp.lat, lng: comp.lng },
        label: comp.name,
        icon: "/business2.png",
        map,
      });
    });

    map?.moveCamera({
      center: { lat: loc.lat, lng: loc.lng },
    });
  }, [json?.metadata?.location]);

  useEffect(() => {
    const asyncCall = async () => {
      let busReq = await axios.get("/v1/bkk");

      return busReq.data;
    };

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

      let { heading } = cameraOptions;

      const animate = () => {
        heading += 0.001;
        map.notify("render");
        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    });

    let markers: google.maps.Marker[] = [];

    setInterval(() => {
      asyncCall().then((data) => {
        markers.forEach((marker: google.maps.Marker) => {
          marker.setMap(null);
        });

        data = data.slice(0, 10);

        data.forEach((bus: any) => {
          markers.push(
            new google.maps.Marker({
              position: { lat: bus.latitude, lng: bus.longitude },
              icon: "/bus2.png",
              //label: bus.vehicle_label,
              //optimized: true,
              map,
            }),
          );
        });
      });
    }, 10000);

    //requestAnimationFrame(animate);

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
  // szell kalman 47.50764552991384, 19.022730071164332
  center: { lat: 47.50764552991384, lng: 19.022730071164332 },
  heading: 0,
  tilt: 45,
  zoom: 17.5,
};

const mapOptions = {
  mapId: process.env.NEXT_PUBLIC_MAP_ID,
  disableDefaultUI: true,
  disableDoubleClickZoom: true,
};

async function getMapAsync(ref: HTMLElement): Promise<google.maps.Map> {
  const { Map } = (await google.maps.importLibrary(
    "maps",
  )) as google.maps.MapsLibrary;

  const map = new Map(ref, { ...cameraOptions, ...mapOptions });
  return map;
}

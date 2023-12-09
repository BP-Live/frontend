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
import { BusinessCategorie, RestaurantJson } from "@/lib/types";

import heatmapData from "@/public/business_heatmap.json";
import { info } from "console";
import { useTheme } from "next-themes";
import { budapest } from "@/lib/constants/coordinates";

export function MapSegment({
  json,
  categories,
}: {
  json: RestaurantJson | null;
  categories: string[];
}) {
  const { theme } = useTheme();

  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_MAP_API_KEY!}>
      <MapElement json={json} categories={categories} theme={theme} />
    </Wrapper>
  );
}

function MapElement({
  json,
  categories,
  theme,
}: {
  json: RestaurantJson | null;
  categories: string[];
  theme: string | undefined;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [circles, setCircles] = useState<google.maps.Circle[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    getMapAsync(mapRef.current, theme).then((map) => setMap(map));
  }, [theme]);

  const infoWindow = new google.maps.InfoWindow();

  useEffect(() => {
    if (!json?.metadata?.location) return;

    const loc = json.metadata?.location;

    new google.maps.Marker({
      position: { lat: loc.lat, lng: loc.lng },
      label: json.metadata?.name,
      icon: {
        url: "/business.png",
        anchor: new google.maps.Point(20, 20),
        scaledSize: new google.maps.Size(40, 40),
      },
      map,
    });

    json.competitors?.forEach((comp: any) => {
      new google.maps.Marker({
        position: { lat: comp.lat, lng: comp.lng },
        label: comp.name,
        icon: {
          url: "/business.png",
          anchor: new google.maps.Point(16, 16),
          scaledSize: new google.maps.Size(32, 32),
        },
        map,
      });
    });

    json.premises?.forEach(
      (premise: any) => {
        let marker = new google.maps.Marker({
          position: { lat: premise.lat, lng: premise.lng },
          label: premise.name,
          icon: {
            url: "/open.png",
            anchor: new google.maps.Point(16, 16),
            scaledSize: new google.maps.Size(32, 32),
          },
          map,
        });

        marker.addListener("click", () => {
          infoWindow.close();
          infoWindow.setContent(
            `<div><h3>${premise.address}</h3><p>Store area: ${premise.area} m2</p></div>`,
          );
          infoWindow.open(map, marker);
        });

        map?.moveCamera({
          center: { lat: loc.lat, lng: loc.lng },
        });
      },
      [json],
    );
  }, [json, map]);

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

      // let { heading } = cameraOptions;

      // const animate = () => {
      //   console.log(json)
      //   heading += 0.1;
      //   if (!json) map.moveCamera({ heading });
      //   requestAnimationFrame(animate);
      // };

      // requestAnimationFrame(animate);
    });

    let markers: google.maps.Circle[] = [];

    setInterval(() => {
      asyncCall().then((data) => {
        markers.forEach((marker: google.maps.Circle) => {
          marker.setMap(null);
        });

        //data = data.slice(0, 10);

        data.forEach((bus: any) => {
          markers.push(
            new google.maps.Circle({
              strokeColor: "#0000FF",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#0000FF",
              fillOpacity: 0.35,
              map,
              center: { lat: bus.latitude, lng: bus.longitude },
              radius: 7.5,
            }),
          );
        });
      });
    }, 10000);

    new ThreeJSOverlayView({
      map,
      scene,
      THREE,
      anchor: { ...cameraOptions.center, altitude: 0 },
    });
  }, [map, json]);

  useEffect(() => {
    console.log(categories);
    console.log(circles);

    circles.forEach((rect) => {
      console.log("csumpa");
      rect.setMap(null);
    });

    setCircles([]);

    //rectangels = [];

    Object.keys(heatmapData).forEach((key: string) => {
      if (!categories.includes(key)) return;
      const data = (heatmapData as any)[key];
      data.forEach((dot: any) => {
        if (dot[3] == 0) return;
        setCircles((prevRectangles) => {
          prevRectangles.push(
            new google.maps.Circle({
              strokeColor: dot[2],
              strokeOpacity: dot[3],
              strokeWeight: 2,
              fillColor: dot[2],
              fillOpacity: dot[3],
              map,
              center: { lat: dot[0], lng: dot[1] },
              radius: 300,
            }),
          );

          return prevRectangles;
        });
      });
    });
  }, [categories]);

  return <div ref={mapRef} className="w-full h-full" />;
}

const cameraOptions = {
  // szell kalman 47.50764552991384, 19.022730071164332
  center: { lat: budapest[0], lng: budapest[1] },
  heading: 0,
  tilt: 45,
  zoom: 17.5,
};

async function getMapAsync(
  ref: HTMLElement,
  theme: string | undefined,
): Promise<google.maps.Map> {
  const { Map } = (await google.maps.importLibrary(
    "maps",
  )) as google.maps.MapsLibrary;

  const map = new Map(ref, {
    ...cameraOptions,
    mapId:
      theme === "light"
        ? process.env.NEXT_PUBLIC_MAP_ID
        : process.env.NEXT_PUBLIC_MAP_ID_MN,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
  });

  return map;
}

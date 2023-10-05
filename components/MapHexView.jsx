"use client";

import { useState } from "react";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import Map, { Marker, FullscreenControl } from "react-map-gl";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";

// import map config
import {
  lightingEffect,
  material,
  INITIAL_VIEW_STATE,
  colorRange,
} from "../lib/mapconfig.js";

// import data

import FR088_HEX from "@/data/FR088_HEX.js";
import RIA_FR_ALL_hex from "@/data/RIA_FR_ALL_hex.js";
import FR_REST_HEX from "@/data/FR_REST_HEX.js";

function getTooltip({ object }) {
  if (!object) {
    return null;
  }
  const lat = object.position[1];
  const lng = object.position[0];
  const count = object.points.length;

  return `\
        latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ""}
        longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ""}
        ${count} locations`;
}

// APP COMPONENT STARTS HERE //

export default function App({ upperPercentile = 100, coverage = 1 }) {
  const [radius, setRadius] = useState(1000);
  const [data, setData] = useState(0);
  const [networkID, setNetworkID] = useState(null);
  const [allLocs, setAllLocs] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [controller, setController] = useState(true);
  const [competition, setCompetition] = useState(false);

  const handleRadiusChange = (e) => {
    console.log(e.target.value);
    setRadius(e.target.value);
  };
  const toggleController = () => {
    setController(!controller);
  };

  const layers = [
    new HexagonLayer({
      id: "heatmap",
      colorRange,
      coverage,
      data,
      elevationRange: [0, 3000],
      elevationScale: data && data.length ? 50 : 0,
      extruded: true,
      getPosition: (d) => d,
      pickable: true,
      radius,
      upperPercentile,
      material,

      transitions: {
        elevationScale: 3000,
      },
    }),
  ];

  return (
    <div className="">
      <DeckGL
        layers={layers}
        effects={[lightingEffect]}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        getTooltip={getTooltip}
      >
        <Map
          className=""
          controller={true}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/petherem/cl2hdvc6r003114n2jgmmdr24"
        ></Map>

        {/* Floating Tooltip */}
        <div className="absolute bg-slate-800 min-h-[200px] h-auto w-[150px] md:w-[220px] top-10 left-5 rounded-lg p-4 text-sm text-white">
          <div className="flex flex-col">
            <div
              className="bg-rose-500 mb-2 w-fit px-3 rounded-lg"
              onClick={toggleController}
            >
              {controller ? (
                <p className="font-bold text-md">Hide</p>
              ) : (
                <p className="font-bold text-md">Show</p>
              )}
            </div>
            {/* RADIUS MENU */}
            <div className={!controller ? "hidden" : "inline-block"}>
              <h1 className="font-bold text-[12px] md:text-xl uppercase mb-1">
                Map controller
              </h1>
              <h2 className="font-semibold text-md uppercase mb-4">
                Set the radius
              </h2>
              <input
                name="radius"
                className="w-fit py-2"
                type="range"
                value={radius}
                min={500}
                step={50}
                max={10000}
                onChange={handleRadiusChange}
              />
              <label htmlFor="radius">
                <br />
                Radius -{" "}
                <span className="bg-indigo-500 font-bold text-white px-2 py-1 rounded-lg">
                  {radius}
                </span>{" "}
                meters
              </label>
              <p className="mt-2 mb-2">
                {" "}
                <span className="font-bold">{data.length}</span> locations
              </p>
            </div>

            <h2 className="font-bold text-md uppercase mb-4 mt-4">
              Network density
            </h2>

            <div className="form-control w-full">
              <label className="cursor-pointer label">
                <span className="label-text text-[12px] text-white/80">
                  Network 1
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-secondary"
                  onChange={() =>
                    data === FR088_HEX ? setData(0) : setData(FR088_HEX)
                  }
                />
              </label>
            </div>
            <div className="form-control w-full">
              <label className="cursor-pointer label">
                <span className="label-text text-[12px] text-white/80">
                  Networks 2 & 3
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-secondary"
                  onChange={() =>
                    data === FR_REST_HEX ? setData(0) : setData(FR_REST_HEX)
                  }
                />
              </label>
            </div>
            <div className="form-control w-full">
              <label className="cursor-pointer label">
                <span className="label-text text-[12px] text-white/80">
                  Ria Financials
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-secondary"
                  onChange={() =>
                    data === RIA_FR_ALL_hex
                      ? setData(0)
                      : setData(RIA_FR_ALL_hex)
                  }
                />
              </label>
            </div>
          </div>
        </div>
      </DeckGL>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import Map, { Marker, FullscreenControl, Popup } from "react-map-gl";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
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

import FR088_All from "@/data/FR088_All.js";
import RIA_FR_ALL from "@/data/RIA_FR_ALL.js";
import FR_REST from "@/data/FR_REST.js";

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
        ${count} transactions`;
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

  const [popupInfo, setPopupInfo] = useState(null);

  const [lbpRank, setLbpRank] = useState(100);

  //handle the lbprank
  const handleLbpRank = (e) => {
    setLbpRank(e.target.value);
  };

  const handleNetworkID = (e) => {
    setNetworkID(e.target.value);
  };

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };
  const handleAllLocs = () => {
    setAllLocs(!allLocs);
  };
  const toggleController = () => {
    setController(!controller);
  };

  const handleMarkerClick = (agent_id) => {
    setPopupInfo(agent_id);
    console.log(popupInfo);
  };

  const handleRadiusChange = (e) => {
    console.log(e.target.value);
    setRadius(e.target.value);
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

    // new ScatterplotLayer({
    //   id: "scatterplot",
    //   data: airports,
    //   filled: true,
    //   radiusScale: 20,
    //   getPosition: d => d.coordinates,
    //   getRadius: d => d.radius,
    //   getFillColor: [255, 140, 0],

    //   pickable: true

    // })
  ];

  return (
    <div className="z-40">
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
        >
          {FR088_All.filter((i) => i.LBP_Rank <= lbpRank).map((location) => (
            <div key={location.agent_id}>
              <Marker
                latitude={location.latitude}
                longitude={location.longitude}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <div
                  className={`rounded-full bg-orange-500 h-[10px] w-[10px] z-40`}
                  onClick={() => handleMarkerClick(location.agent_id)}
                />
              </Marker>
              {popupInfo === location.agent_id ? (
                <Popup
                  latitude={location.latitude}
                  longitude={location.longitude}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setPopupInfo(null)}
                  anchor="top"
                >
                  <div className="text-sm">
                    <h2 className="font-bold text-md uppercase mb-4">
                      {popupInfo}
                    </h2>
                    <p className="text-xs">
                      <span className="font-bold">LBP Rank: </span>
                      {location.LBP_Rank}
                    </p>
                  </div>
                </Popup>
              ) : null}
            </div>
          ))}

          {allLocs &&
            FR_REST.map((location) => (
              <Marker
                key={location.agent_id}
                latitude={location.latitude}
                longitude={location.longitude}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <div
                  className={`rounded-full bg-green-500 h-[7px] w-[7px] z-40`}
                />
              </Marker>
            ))}
          {/* COMPETITION */}
          {competition &&
            RIA_FR_ALL.map((location) => (
              <Marker
                key={location.Id}
                latitude={location.lat}
                longitude={location.long}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <div
                  className={`rounded-full bg-red-500 h-[5px] w-[5px] z-40`}
                />
              </Marker>
            ))}
        </Map>

        {/* Floating Tooltip */}
        <div className="absolute bg-slate-800 min-h-[200px] h-auto w-[150px] md:w-[220px] top-10 left-5 rounded-lg p-4 text-sm text-white z-50">
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

              <h2 className="font-bold text-[10px] md:text-md uppercase mb-4">
                Postal locations filter
              </h2>

              <div>
                <input
                  type="text"
                  placeholder="Location rank threshold"
                  className="input input-bordered input-secondary h-8 md:h-10 w-full max-w-xs"
                  onChange={handleLbpRank}
                />
                <label className="text-[9px] text-white/80">
                  FR Post rank filter (100 by default)
                </label>

                <p>
                  {/* {" "}
                <span className="font-bold">{data.length}</span> transactions */}
                </p>

                <hr className="h-[1.5px] mt-4 mb-4 bg-slate-300" />
                {/* COMPETITION RADIO BUTTON */}
                <div>
                  <div className="flex flex-col">
                    <div className="form-control w-full">
                      <label className="cursor-pointer label">
                        <span className="label-text text-[12px] text-white/80">
                          Show Ria Network
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-secondary"
                          onChange={(prev) => setCompetition(!competition)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="h-[1.5px] mt-4 mb-4 bg-slate-300" />

            <h2 className="font-bold text-md uppercase mb-4">
              Other Class of Trade
            </h2>

            <div className="form-control w-full">
              <label className="cursor-pointer label">
                <span className="label-text text-[12px] text-white/80">
                  Show rest of network
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-secondary"
                  onChange={(prev) => setAllLocs(!allLocs)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* <div className="relative">
          <div className="absolute right-5 stats bg-primary text-primary-content w-fit">
            <div className="stat">
              <p className="w-fit  mb-2 px-2  rounded-lg font-semibold btn-success">
                High Value Cust - <br />
                June 2023 (min 5 txn/month)
              </p>
              <div className="stat-title text-white ">
                Bucharest <span className="font-bold">5.5%</span>
              </div>
              <div className="stat-title text-white ">
                Iasi <span className="font-bold">3.62%</span>
              </div>
              <div className="stat-title text-white ">
                Bacau <span className="font-bold">3.49%</span>
              </div>
              <div className="stat-title text-white ">
                Craiova <span className="font-bold">2.98%</span>
              </div>
              <div className="stat-title text-white ">
                Galati <span className="font-bold">2.54%</span>
              </div>
              <div className="stat-title text-white ">
                Focsani <span className="font-bold">2.30%</span>
              </div>
              <div className="stat-title text-white ">
                Cluj Napoca <span className="font-bold">2.06%</span>
              </div>
              <hr className="h-[2px] mt-2 mb-2 bg-white" />
              <div className="ml-3 stat-title text-white ">
                Rest <span className="font-bold">77.5%</span>
              </div>
            </div>
          </div>
        </div> */}
      </DeckGL>
    </div>
  );
}

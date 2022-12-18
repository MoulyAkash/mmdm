// @ts-nocheck
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Library from "../pages/Library";
import TimeLine from "../pages/TimeLine";
import Settings from "../pages/Settings";
import Catalog from "../pages/Catalog";
import Details from "../pages/detail/Details";
import AnimeCatalog from "../pages/AnimeCatalog";
import AnimeDetails from "../pages/anime-detail/AnimeDetails";
import WatchTogether from "../pages/WatchTogether";
import Player from "@/pages/Player";

function RouteConfig() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/Library" element={<Library />}></Route>
        <Route path="/TimeLine" element={<TimeLine />}></Route>
        <Route path="/Settings" element={<Settings />}></Route>
        <Route path="/:category/:id/:name" element={<Details />} />
        <Route path="/:category" element={<Catalog />} />
        <Route path="/anime/:category" element={<AnimeCatalog />} />
        <Route path="/anime/:category/:id" element={<AnimeDetails />} />
        <Route path="/WatchTogether" element={<WatchTogether />}></Route>
        <Route path="/player/:category/:id" element={<Player />} />
      </Routes>
    </>
  );
}

export default RouteConfig;

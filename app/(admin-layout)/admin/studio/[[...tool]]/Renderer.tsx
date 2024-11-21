"use client";
import React from "react";
import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export const Renderer = () => {
  return <NextStudio config={config} />;
};

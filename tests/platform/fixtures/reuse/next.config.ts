import type {NextConfig} from "next";
import {resolve} from "node:path";
const config:NextConfig={turbopack:{root:resolve(__dirname,"../../../..")},outputFileTracingRoot:resolve(__dirname,"../../../..")};
export default config;

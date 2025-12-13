import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "robohash.org",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
                pathname: "/**"
            }
        ]
    },
    devIndicators: false
};

export default nextConfig;

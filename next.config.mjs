// FILE: next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ddragon.leagueoflegends.com",
                port: "",
                pathname: "/cdn/**",
            },
        ],
    },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
            "utf-8-validate": "common utf-8-validate",
            bufferutil: "commonjs bufferutil"
        });
        return config;
    },
    images: {
        domains: ["utfs.io"]
    }
}

module.exports = nextConfig

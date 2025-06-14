/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/index.html",
        permanent: true,
      }
    ]
  }
}

module.exports = nextConfig;

/*
/** @type {import('next').NextConfig} 
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/products",
                permanent: true,
            }
        ]
    }
}

module.exports = nextConfig
**/
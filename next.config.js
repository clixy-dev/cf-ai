/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'placekitten.com'], // Add both Unsplash and placekitten domains
  },
  typescript: {
    // Exclude Supabase functions from TypeScript checking
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude Supabase functions from webpack build
    config.module.rules.push({
      test: /supabase\/functions/,
      loader: 'ignore-loader',
    });
    if (!isServer) {
      // Client-side only config
      config.resolve.fallback = { 
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }
    return config;
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
        },
        '*.png': {
          loaders: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                mimetype: 'image/png',
                name: 'static/media/[name].[hash:8].[ext]'
              }
            }
          ]
        },
        '*.woff2': {
          loaders: ['file-loader']
        }
      }
    }
  },
  // env: {
  //   NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  //   NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  //   // Add other required environment variables here
  // }
};

module.exports = nextConfig

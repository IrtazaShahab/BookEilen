import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    sassOptions: {
        includePaths: ['./src/styles'],
        silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
    },
};

export default nextConfig;

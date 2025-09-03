/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desabilita completamente ESLint durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Desabilita completamente TypeScript checking durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configurações básicas para produção
  output: 'standalone',
  
  // Desabilita otimizações que podem causar problemas
  swcMinify: false,
  
  // Configurações de imagem simplificadas
  images: {
    unoptimized: true,
  },
  
  // Desabilita compressão que pode causar problemas
  compress: false,
  
  // Configuração webpack para ignorar warnings
  webpack: (config, { isServer }) => {
    // Ignora todos os warnings durante o build
    config.ignoreWarnings = [/.*/];
    
    // Filtra regras ESLint que podem causar problemas
    config.module.rules = config.module.rules.filter(rule => {
      if (rule.use && Array.isArray(rule.use)) {
        rule.use = rule.use.filter(use => {
          if (use.loader && use.loader.includes('eslint')) {
            return false;
          }
          return true;
        });
      }
      return true;
    });
    
    return config;
  },
};

export default nextConfig;

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const logger = require('../utils/logger');

class DeploymentService {
  constructor() {
    this.netlifyToken = process.env.NETLIFY_ACCESS_TOKEN;
    this.siteId = process.env.NETLIFY_SITE_ID;
    this.apiBase = 'https://api.netlify.com/api/v1';
  }

  async deployApp(appId, files, framework = 'react') {
    try {
      logger.info(`Starting deployment for app ${appId}`);

      // Create temporary directory for the app
      const tempDir = path.join(process.cwd(), 'temp', appId);
      await fs.ensureDir(tempDir);

      // Generate project files based on framework
      await this.generateProjectFiles(tempDir, files, framework);

      // Create zip file
      const zipPath = path.join(process.cwd(), 'temp', `${appId}.zip`);
      await this.createZipFile(tempDir, zipPath);

      // Deploy to Netlify
      const deploymentResult = await this.deployToNetlify(zipPath, appId);

      // Clean up temporary files
      await fs.remove(tempDir);
      await fs.remove(zipPath);

      logger.info(`Deployment completed for app ${appId}`);
      return deploymentResult;

    } catch (error) {
      logger.error(`Deployment failed for app ${appId}:`, error);
      throw new Error(`Deployment failed: ${error.message}`);
    }
  }

  async generateProjectFiles(dir, files, framework) {
    switch (framework) {
      case 'react':
        await this.generateReactFiles(dir, files);
        break;
      case 'vue':
        await this.generateVueFiles(dir, files);
        break;
      case 'vanilla':
        await this.generateVanillaFiles(dir, files);
        break;
      case 'nextjs':
        await this.generateNextjsFiles(dir, files);
        break;
      default:
        await this.generateReactFiles(dir, files);
    }
  }

  async generateReactFiles(dir, files) {
    // Create public/index.html
    const indexHtml = files['/index.html'] || `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Generated React App" />
    <title>React App</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;

    await fs.writeFile(path.join(dir, 'public', 'index.html'), indexHtml);

    // Create src/index.js
    const indexJs = files['/index.js'] || `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

    await fs.writeFile(path.join(dir, 'src', 'index.js'), indexJs);

    // Create src/App.js with the generated code
    await fs.writeFile(path.join(dir, 'src', 'App.js'), files['/App.js'] || '');

    // Create package.json
    const packageJson = {
      name: "generated-react-app",
      version: "0.1.0",
      private: true,
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-scripts": "5.0.1"
      },
      scripts: {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
      },
      browserslist: {
        production: [
          ">0.2%",
          "not dead",
          "not op_mini all"
        ],
        development: [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ]
      }
    };

    await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify(packageJson, null, 2));
  }

  async generateVueFiles(dir, files) {
    // Create index.html
    const indexHtml = files['/index.html'] || `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue App</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`;

    await fs.writeFile(path.join(dir, 'index.html'), indexHtml);

    // Create src/main.js
    const mainJs = files['/main.js'] || `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`;

    await fs.writeFile(path.join(dir, 'src', 'main.js'), mainJs);

    // Create src/App.vue with the generated code
    await fs.writeFile(path.join(dir, 'src', 'App.vue'), files['/App.vue'] || '');

    // Create package.json
    const packageJson = {
      name: "generated-vue-app",
      version: "0.1.0",
      type: "module",
      scripts: {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
      },
      dependencies: {
        "vue": "^3.3.0"
      },
      devDependencies: {
        "@vitejs/plugin-vue": "^4.2.0",
        "vite": "^4.3.0"
      }
    };

    await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Create vite.config.js
    const viteConfig = files['/vite.config.js'] || `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})`;

    await fs.writeFile(path.join(dir, 'vite.config.js'), viteConfig);
  }

  async generateVanillaFiles(dir, files) {
    // For vanilla JS, the code should contain HTML, CSS, and JS
    await fs.writeFile(path.join(dir, 'index.html'), files['/index.html'] || '');
  }

  async generateNextjsFiles(dir, files) {
    // Create pages/_app.js
    const appJs = files['/_app.js'] || `import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}`;

    await fs.writeFile(path.join(dir, 'pages', '_app.js'), appJs);

    // Create pages/index.js with the generated code
    await fs.writeFile(path.join(dir, 'pages', 'index.js'), files['/index.js'] || '');

    // Create styles/globals.css
    const globalsCss = files['/globals.css'] || `@tailwind base;
@tailwind components;
@tailwind utilities;`;

    await fs.writeFile(path.join(dir, 'styles', 'globals.css'), globalsCss);

    // Create package.json
    const packageJson = {
      name: "generated-nextjs-app",
      version: "0.1.0",
      private: true,
      scripts: {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
      },
      dependencies: {
        "next": "^13.4.0",
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      },
      devDependencies: {
        "autoprefixer": "^10.4.14",
        "postcss": "^8.4.24",
        "tailwindcss": "^3.3.0"
      }
    };

    await fs.writeFile(path.join(dir, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Create tailwind.config.js
    const tailwindConfig = files['/tailwind.config.js'] || `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

    await fs.writeFile(path.join(dir, 'tailwind.config.js'), tailwindConfig);

    // Create postcss.config.js
    const postcssConfig = files['/postcss.config.js'] || `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

    await fs.writeFile(path.join(dir, 'postcss.config.js'), postcssConfig);

    // Create next.config.js
    const nextConfig = files['/next.config.js'] || `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`;

    await fs.writeFile(path.join(dir, 'next.config.js'), nextConfig);
  }

  async createZipFile(sourceDir, zipPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      output.on('close', () => {
        logger.info(`Archive created: ${archive.pointer()} total bytes`);
        resolve();
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }

  async deployToNetlify(zipPath, appId) {
    try {
      const form = new FormData();
      form.append('zip', fs.createReadStream(zipPath));

      const response = await axios.post(
        `${this.apiBase}/sites/${this.siteId}/deploys`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${this.netlifyToken}`
          }
        }
      );

      const deployUrl = `https://${response.data.ssl_url || response.data.url}`;
      
      logger.info(`Deployment successful: ${deployUrl}`);

      return {
        deployUrl,
        deploymentId: response.data.id,
        status: 'deployed'
      };

    } catch (error) {
      logger.error('Netlify deployment failed:', error.response?.data || error.message);
      throw new Error('Netlify deployment failed');
    }
  }

  async getDeploymentStatus(deploymentId) {
    try {
      const response = await axios.get(
        `${this.apiBase}/sites/${this.siteId}/deploys/${deploymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.netlifyToken}`
          }
        }
      );

      return {
        status: response.data.state,
        url: response.data.ssl_url || response.data.url
      };

    } catch (error) {
      logger.error('Failed to get deployment status:', error);
      throw new Error('Failed to get deployment status');
    }
  }
}

module.exports = new DeploymentService(); 
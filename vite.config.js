import { defineConfig } from 'vite';


// This will forward fetch requests that go to a path like "fetch('/api/scores')" to 
// connect to your backend server running on port 4000.
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
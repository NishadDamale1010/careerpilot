import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: "glass-card",
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            backdropFilter: 'blur(16px)',
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}
export default App;
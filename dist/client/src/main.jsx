import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/ThemeProvider";
createRoot(document.getElementById("root")).render(<ThemeProvider defaultTheme="light" storageKey="quizrevise-theme">
    <App />
  </ThemeProvider>);

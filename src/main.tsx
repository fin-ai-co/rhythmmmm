import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply saved theme before render to avoid flash
const savedMode = localStorage.getItem("discipline-mode") || "dark";
const savedColor = localStorage.getItem("discipline-color-theme") || "blue";
if (savedMode === "dark") document.documentElement.classList.add("dark");
document.documentElement.classList.add(`theme-${savedColor}`);

createRoot(document.getElementById("root")!).render(<App />);

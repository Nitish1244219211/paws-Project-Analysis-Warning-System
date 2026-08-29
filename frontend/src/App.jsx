import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import ProjectAnalysis from "./pages/ProjectAnalysis";
import Results from "./pages/Results";

export default function App() {
  return (
    <div className="paws-app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<ProjectAnalysis />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </main>
    </div>
  );
}

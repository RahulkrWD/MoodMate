import { Routes, Route } from "react-router-dom";

function HomePlaceholder() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-900">MoodMate</h1>
        <p className="mt-2 text-slate-500">Frontend scaffold ready — pages come in M8.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePlaceholder />} />
    </Routes>
  );
}

export default App;

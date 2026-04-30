import { useLocation } from "react-router-dom";

export default function Search() {
  const query = new URLSearchParams(useLocation().search).get("q");

  return (
    <div className="pt-24 p-4">
      <h1 className="text-xl font-bold">
        Search results for: {query}
      </h1>

      {/* later: fetch API results here */}
    </div>
  );
}
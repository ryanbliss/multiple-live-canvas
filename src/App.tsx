import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UIProvider } from "./components";
import { TeamsClientProvider } from "./context";
import { MeetingStagePage } from "./pages";

function App() {
  return (
    <TeamsClientProvider>
      <UIProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MeetingStagePage />} />
          </Routes>
        </Router>
      </UIProvider>
    </TeamsClientProvider>
  );
}

export default App;

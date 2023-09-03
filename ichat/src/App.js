import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // npm i react-router-dom
import Join from "./Component/Join/Join";
import Chat from "./Component/Chat/Chat";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Use the 'element' prop instead of 'Component' */}
          <Route path="/" element={<Join />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import Header from "./components/Header";
import Tabs from "./components/Tabs";
import Home from "./pages/Home";
import Riwayat from "./pages/Riwayat";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [tab, setTab] = useState("home");

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container">
        <Tabs tab={tab} setTab={setTab} />

        {tab === "home" && <Home />}
        {tab === "riwayat" && <Riwayat />}
      </div>
    </>
  );
}

export default App;
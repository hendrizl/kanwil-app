import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Tabs from "./components/common/Tabs";
import Home from "./pages/Home/index";
import Riwayat from "./pages/Riwayat/index";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [tab, setTab] = useState("home");

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3500} theme="colored" />

      <div className="container">
        <div className="page-title-section">
          <h1 className="page-title">Sistem Permohonan Nomor Surat</h1>
          <p className="page-subtitle">
            Ajukan dan pantau permohonan nomor surat resmi Kantor Wilayah Direktorat Jenderal Pemasyarakatan Kalimantan Timur.
          </p>
        </div>

        <Tabs tab={tab} setTab={setTab} />

        {tab === "home" && <Home />}
        {tab === "riwayat" && <Riwayat />}
      </div>

      <Footer />
    </>
  );
}

export default App;
import { useState } from "react";
import logo from "../../assets/logo_pas_outline.png";
import about from "../../assets/ic_about_white.png"; // <- logo kanan
import AboutModal from "../modals/AboutModal";

export default function Header() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <header className="header">
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}

      <div className="header-inner">
        <div className="header-box">

          {/* KIRI */}
          <img src={logo} className="header-logo" />

          <div className="header-text">
            <div className="brand">
              Kantor Wilayah Direktorat Jenderal Pemasyarakatan
            </div>
            <div className="brand-2">Kalimantan Timur</div>
          </div>

          {/* KANAN */}
          <img
            src={about}
            className="header-logo-right"
            onClick={() => setShowAbout(true)}
            style={{ cursor: "pointer", transition: "transform 0.2s" }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            title="Tentang Aplikasi"
          />

        </div>
      </div>
    </header>
  );
}

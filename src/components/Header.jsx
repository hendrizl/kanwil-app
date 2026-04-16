import logo from "../assets/logo_pas.png";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-box">
          <img src={logo} className="header-logo" />

          <div className="header-text">
            <div className="brand">
              Kantor Wilayah Direktorat Jenderal Pemasyarakatan
            </div>
            <div className="brand-2">Kalimantan Timur</div>
            <div className="subtitle">
              Sistem Permohonan Nomor Surat
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
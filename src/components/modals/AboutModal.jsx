import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faDatabase,
  faFileLines,
  faClockRotateLeft,
  faShieldHalved,
  faBook,
  faHeadset,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo_pas_outline.png";

const whatsappAdmin = "https://api.whatsapp.com/send?phone=6289668652403&text=*%23LAPORAN%20ERROR%20SISTEM%20PERMOHONAN%20NOMOR%20SURAT*%0A%0AKode%20Surat%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3A%20(SA.03.04)%0AIsi%20Ringkasan%20Surat%20%20%20%20%3A%20(Surat%20Keterangan......)%0AJumlah%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3A%20(5)";

export default function AboutModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box about-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="about-modal-close" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="about-modal-header">
          <div className="about-modal-icon">
            <img src={logo} style={{ width: "85px", height: "85px" }} className="header-logo" />
          </div>
          <div className="about-modal-title">Sistem Permohonan Nomor Surat</div>
          <div className="about-modal-subtitle">
            Aplikasi ini digunakan untuk digitalisasi permohonan nomor surat guna meningkatkan tertib administrasi
            dan mencegah terjadinya nomor ganda di lingkungan Kantor Wilayah.
          </div>
        </div>

        <div className="about-modal-body">
          <div className="about-grid">
            <div className="about-grid-item about-grid-item-1">
              <div className="about-grid-label">
                <FontAwesomeIcon icon={faCode} /> Developer
              </div>
              <div className="about-grid-value">Pranata Komputer Kanwil Ditjenpas Kaltim</div>
            </div>
            <div className="about-grid-item about-grid-item-2">
              <div className="about-grid-label">
                <FontAwesomeIcon icon={faDatabase} /> Database
              </div>
              <div className="about-grid-value">Cloud Data Management</div>
            </div>
            <div className="about-grid-item about-grid-item-3">
              <div className="about-grid-label">
                <FontAwesomeIcon icon={faFileLines} /> Version
              </div>
              <div className="about-grid-value">Beta 1.0.0</div>
            </div>
            <div className="about-grid-item about-grid-item-4">
              <div className="about-grid-label">
                <FontAwesomeIcon icon={faClockRotateLeft} /> Last Update
              </div>
              <div className="about-grid-value">21 April 2026</div>
            </div>
          </div>

          <div className="about-privacy-box">
            <div className="about-privacy-title">
              <FontAwesomeIcon icon={faShieldHalved} /> Terms & Condition
            </div>
            <ul className="about-privacy-list">
              <li>Data digunakan hanya untuk kepentingan dinas.</li>
              <li>Pengguna bertanggung jawab atas validitas data input.</li>
              <li>Dilarang membagikan hak akses akun kepada orang lain.</li>
              <li>Aktivitas sistem dicatat untuk keperluan audit.</li>
            </ul>
          </div>

          <div className="about-actions">
            <button className="about-btn about-btn-outline">
              <FontAwesomeIcon icon={faBook} /> User Guide
            </button>
            <button
              className="about-btn about-btn-primary"
              onClick={() => window.open(whatsappAdmin)}>
              <FontAwesomeIcon icon={faHeadset} />
              Contact Admin IT
            </button>
          </div>

          <div className="about-footer">
            © 2026 Kantor Wilayah Direktorat Jenderal Pemasyarakatan Kalimantan Timur.
          </div>
        </div>
      </div>
    </div >
  );
}

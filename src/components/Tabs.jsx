import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faClockRotateLeft,
  faPenToSquare
} from "@fortawesome/free-solid-svg-icons";
export default function Tabs({ tab, setTab }) {
  return (
    <div className="tab-nav">
      <div
        className={`tab ${tab === "home" ? "active" : ""}`}
        onClick={() => setTab("home")}
      >
        <FontAwesomeIcon icon={faPenToSquare} style={{ marginRight: 8 }} />
        Permohonan Nomor Surat
      </div>

      <div
        className={`tab ${tab === "riwayat" ? "active" : ""}`}
        onClick={() => setTab("riwayat")}
      >
        <FontAwesomeIcon icon={faClockRotateLeft} style={{ marginRight: 8 }} />
        Riwayat Permohonan
      </div>
    </div>
  );
}
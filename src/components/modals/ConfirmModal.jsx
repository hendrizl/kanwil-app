import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function ConfirmModal({ onConfirm, onCancel, sections }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box confirm-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrapper">
          <div className="confirm-icon-circle">
            <FontAwesomeIcon icon={faFileLines} />
          </div>
        </div>
        <div className="modal-title">Konfirmasi Permohonan</div>
        <div className="modal-body">
          <div className="confirm-summary-list">
            {sections.map((s, i) => (
              <div key={s.id} className="confirm-summary-item">
                {sections.length > 1 && <div className="confirm-summary-badge">{i + 1}</div>}
                <div className="confirm-summary-text" style={{ fontSize: "13px", lineHeight: "1.6", color: "#1e293b", textAlign: "center" }}>
                  <strong>Anda Mengajukan Permohonan {s.jumlah} Nomor Surat {s.indeksKode || "(Indeks belum dipilih)"}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="modal-body-note">
            Pastikan semua data yang diisi sudah benar sebelum permohonan dikirim
          </div>
        </div>
        <div className="modal-actions">
          <button className="modal-btn-cancel" onClick={onCancel}>
            Batal
          </button>
          <button className="modal-btn-confirm" onClick={onConfirm}>
            <FontAwesomeIcon icon={faPaperPlane} />
            &nbsp;Ya, Kirim
          </button>
        </div>
      </div>
    </div>
  );
}

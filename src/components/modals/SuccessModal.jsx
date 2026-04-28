import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCircleCheck, faDownload } from "@fortawesome/free-solid-svg-icons";

export default function SuccessModal({ pdfResults, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box success-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="success-modal-close" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="success-icon-wrapper">
          <div className="success-icon-circle">
            <FontAwesomeIcon icon={faCircleCheck} />
          </div>
        </div>
        <div className="success-modal-title">Permohonan Berhasil</div>
        <div className="success-modal-subtitle">
          Data telah tersimpan dan Hasil permohonan akan diunduh secara otomatis.
          Jika unduhan otomatis tidak bekerja, gunakan tombol di bawah ini.
        </div>
        <div className="success-pdf-list">
          {pdfResults.map((pdf, i) => (
            <a
              key={i}
              className="success-download-btn"
              href={pdf.url}
              download={pdf.filename}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span className="success-download-filename">{"DOWNLOAD HASIL PERMOHONAN"}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

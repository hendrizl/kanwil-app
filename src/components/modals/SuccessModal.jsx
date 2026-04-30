import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCircleCheck, faDownload } from "@fortawesome/free-solid-svg-icons";

export default function SuccessModal({ pdfResults, onClose }) {
  const [progressWidth, setProgressWidth] = useState("100%");

  // Auto-close modal after 5 seconds (5000 ms)
  useEffect(() => {
    // Slight delay to ensure the initial 100% width is rendered before starting the transition
    const progressTimer = setTimeout(() => {
      setProgressWidth("0%");
    }, 50);

    const closeTimer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

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
        
        {/* Progress Bar Container */}
        <div style={{ marginTop: "24px", width: "100%", height: "4px", backgroundColor: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
          {/* Animated Progress Indicator */}
          <div style={{ width: progressWidth, height: "100%", backgroundColor: "#10b981", transition: "width 5s linear" }}></div>
        </div>
      </div>
    </div>
  );
}

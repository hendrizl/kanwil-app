export default function LoadingModal({ message }) {
  return (
    <div className="modal-overlay" style={{ pointerEvents: "none" }}>
      <div className="modal-box loading-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner"></div>
        </div>
        <div className="loading-modal-title">Memproses Permohonan</div>
        <div className="loading-modal-message">{message}</div>
      </div>
    </div>
  );
}

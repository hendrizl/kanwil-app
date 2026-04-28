import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
  faPaperPlane,
  faRotateLeft,
  faUser,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

import { useSuratForm } from "../../hooks/useSuratForm";
import ConfirmModal from "../../components/modals/ConfirmModal";
import LoadingModal from "../../components/modals/LoadingModal";
import SuccessModal from "../../components/modals/SuccessModal";
import FormSection from "./FormSection";

export default function Home() {
  const {
    nip, setNip, nama, sections,
    showModal, setShowModal, isSearching, isSubmitting, loadingMessage,
    pdfResults, showSuccessModal, setShowSuccessModal,
    bidangOptions, kodeOptions, indeksCache, loadingIndeks, isLoadingLists,
    isNipRegistered, handleSearchNip, updateSection, addSection, removeSection,
    handleSubmitClick, handleConfirmSubmit, handleCloseSuccessModal, handleReset
  } = useSuratForm();

  return (
    <>
      {showModal && (
        <ConfirmModal
          sections={sections}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowModal(false)}
        />
      )}

      {isSubmitting && <LoadingModal message={loadingMessage} />}

      {showSuccessModal && (
        <SuccessModal
          pdfResults={pdfResults}
          onClose={handleCloseSuccessModal}
        />
      )}

      <div className="form-main-card">
        <div className="form-main-card-title">Form Permohonan Nomor Surat</div>
        <div className="form-main-card-subtitle">
          Isi data di bawah ini untuk mengajukan permohonan nomor surat resmi.
        </div>

        {/* ── APPLICANT SECTION ── */}
        <div className="applicant-section">
          <div className="field-label">
            NIP<span className="required">*</span>
          </div>
          <div className="nip-search-wrapper">
            <input
              className="nip-input"
              type="text"
              placeholder="Masukkan NIP…"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isSearching && handleSearchNip()}
              maxLength={18}
              disabled={isSearching}
            />
            <button
              className="nip-search-btn"
              type="button"
              onClick={handleSearchNip}
              disabled={isSearching}
              style={{ opacity: isSearching ? 0.7 : 1 }}
            >
              <FontAwesomeIcon
                icon={isSearching ? faSpinner : faMagnifyingGlass}
                spin={isSearching}
              />
              {isSearching ? "Mencari…" : "Cari"}
            </button>
          </div>

          {nama && (
            <div className="nama-display">
              <div className="nama-display-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="nama-display-info">
                <span className="nama-display-label">Nama Pemohon</span>
                <span className="nama-display-value">{nama}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── SECTIONS ── */}
        {isNipRegistered && (
          <>
            {sections.map((section, index) => (
              <FormSection
                key={section.id}
                section={section}
                index={index}
                totalSections={sections.length}
                bidangOptions={bidangOptions}
                kodeOptions={kodeOptions}
                indeksCache={indeksCache}
                loadingIndeks={loadingIndeks}
                updateSection={updateSection}
                removeSection={removeSection}
              />
            ))}

            {/* ── BOTTOM ACTIONS ── */}
            <div className="form-bottom-actions">
              <button className="btn-add-section" type="button" onClick={addSection}>
                <FontAwesomeIcon icon={faPlus} />
                Ambil Nomor Surat Lain
              </button>
              <div className="form-actions-right">
                <button className="btn-reset-form" type="button" onClick={handleReset}>
                  <FontAwesomeIcon icon={faRotateLeft} />
                  &nbsp;Reset
                </button>
                <button className="btn-submit-main" type="button" onClick={handleSubmitClick} disabled={isSubmitting}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Submit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

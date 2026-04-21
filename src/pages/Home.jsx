import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
  faTrash,
  faPaperPlane,
  faRotateLeft,
  faCircleCheck,
  faUser,
  faSpinner,
  faDownload,
  faXmark,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import SearchableDropdown from "../components/SearchableDropdown";
import { getNamaByNIP, isNamaNotFound, getLists, getIndeksByKode, isIndeksNotFound, submitPermohonan } from "../services/api";
import { generatePermohonanPdf, triggerDownload } from "../utils/generatePdf";



let sectionCounter = 1;
function createSection() {
  sectionCounter++;
  return {
    id: sectionCounter,
    bidang: "",
    kodeSurat: "",
    indeksKode: "",
    tanggalPermintaan: "",
    tanggalSurat: "",
    isiSurat: "",
    pengirim: "",
    tujuan: "",
    jumlah: 1,
  };
}

function ConfirmModal({ onConfirm, onCancel, sections }) {
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

/* ── LOADING MODAL ── */
function LoadingModal({ message }) {
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

/* ── SUCCESS MODAL ── */
function SuccessModal({ pdfResults, onClose }) {
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
              <span className="success-download-filename">{pdf.filename}</span>
            </a>
          ))}
        </div>
        <div className="success-modal-actions">
          <button className="modal-btn-confirm" onClick={onClose}>
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [nip, setNip] = useState("");
  const [nama, setNama] = useState("");
  const [sections, setSections] = useState([
    {
      id: 1,
      bidang: "",
      kodeSurat: "",
      indeksKode: "",
      tanggalPermintaan: "",
      tanggalSurat: "",
      isiSurat: "",
      pengirim: "",
      tujuan: "",
      jumlah: 1,
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  /* ── Submit flow states ── */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [pdfResults, setPdfResults] = useState([]); // [{ url, filename }]
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /* ── Dynamic data from API ── */
  const [bidangOptions, setBidangOptions] = useState([]);
  const [kodeOptions, setKodeOptions] = useState([]);
  const [indeksCache, setIndeksCache] = useState({}); // { kodeValue: [{value,label}] }
  const [loadingIndeks, setLoadingIndeks] = useState({}); // { sectionId: boolean }
  const [isLoadingLists, setIsLoadingLists] = useState(true);

  /* ── Load bidang & kode on mount ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getLists();
        if (cancelled) return;

        // Parse bidang: string[] → [{value, label}]
        const bidang = (data.bidang || []).map((b) => ({ value: b, label: b }));
        setBidangOptions(bidang);

        // Parse kode: ["PR (Perencanaan)", ...] → [{value:"PR", label:"PR — Perencanaan"}]
        const kode = (data.kode || [])
          .filter((k) => k && k.trim() && !k.startsWith(" (")) // filter empty " ()" entries
          .map((k) => {
            const match = k.match(/^([A-Z]+)\s*\((.+)\)$/);
            if (match) {
              return { value: match[1], label: `${match[1]} — ${match[2]}` };
            }
            return { value: k, label: k };
          });
        setKodeOptions(kode);
      } catch (err) {
        console.error("Gagal memuat data bidang/kode:", err);
        toast.error("Gagal memuat data dropdown dari server.");
      } finally {
        if (!cancelled) setIsLoadingLists(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const isNipRegistered = Boolean(nama);

  /* ── NIP search via GAS API ── */
  const handleSearchNip = async () => {
    const trimmed = nip.trim();
    if (!trimmed) { toast.error("Masukkan NIP terlebih dahulu."); return; }
    if (!/^\d+$/.test(trimmed)) { toast.error("NIP hanya boleh berisi angka."); return; }
    if (trimmed.length !== 18) { toast.error("NIP harus terdiri dari 18 digit."); return; }

    setIsSearching(true);
    setNama("");

    try {
      const result = await getNamaByNIP(trimmed);

      if (isNamaNotFound(result.nama)) {
        toast.error("NIP tidak ditemukan. Pastikan NIP sudah benar.");
      } else {
        setNama(result.nama);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghubungi server. Periksa koneksi internet Anda.");
    } finally {
      setIsSearching(false);
    }
  };

  /* ── Section management ── */
  const updateSection = (id, field, value) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (field === "kodeSurat") return { ...s, kodeSurat: value, indeksKode: "" };
        return { ...s, [field]: value };
      })
    );

    // When kode changes → fetch indeks from API (if not cached)
    if (field === "kodeSurat" && value) {
      fetchIndeksForKode(value, id);
    }
  };

  const fetchIndeksForKode = async (kode, sectionId) => {
    // Already cached? Skip
    if (indeksCache[kode]) return;

    setLoadingIndeks((prev) => ({ ...prev, [sectionId]: true }));
    try {
      const result = await getIndeksByKode(kode);

      // New API returns { kode, jumlah_ditemukan, daftar_indeks: string[] }
      const raw = result.daftar_indeks || result.indeks;

      if (!raw || (typeof raw === "string" && raw.toLowerCase().includes("tidak ditemukan")) || (Array.isArray(raw) && raw.length === 0)) {
        setIndeksCache((prev) => ({ ...prev, [kode]: [] }));
      } else {
        const list = Array.isArray(raw) ? raw : [raw];
        const options = list
          .filter((i) => i && i.trim())
          .map((i) => ({ value: i, label: i }));
        setIndeksCache((prev) => ({ ...prev, [kode]: options }));
      }
    } catch (err) {
      console.error("Gagal memuat indeks:", err);
      toast.error(`Gagal memuat indeks untuk kode ${kode}.`);
      setIndeksCache((prev) => ({ ...prev, [kode]: [] }));
    } finally {
      setLoadingIndeks((prev) => ({ ...prev, [sectionId]: false }));
    }
  };

  const addSection = () => setSections((prev) => [...prev, createSection()]);

  const removeSection = (id) => {
    if (sections.length === 1) { toast.error("Minimal harus ada 1 permohonan."); return; }
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  /* ── Validation ── */
  const handleSubmitClick = () => {
    if (!nama) { toast.error("Cari dan pilih pemohon terlebih dahulu."); return; }
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const label = sections.length > 1 ? ` pada Section ${i + 1}` : "";
      if (!s.bidang) { toast.error(`Bidang harus dipilih${label}.`); return; }
      if (!s.kodeSurat) { toast.error(`Kode Surat harus dipilih${label}.`); return; }
      if (!s.indeksKode) { toast.error(`Indeks Kode harus dipilih${label}.`); return; }
      if (!s.tanggalPermintaan) { toast.error(`Tanggal Permintaan harus diisi${label}.`); return; }
      if (!s.tanggalSurat) { toast.error(`Tanggal Surat harus diisi${label}.`); return; }
      if (!s.isiSurat.trim()) { toast.error(`Isi Surat harus diisi${label}.`); return; }
      if (!s.pengirim.trim()) { toast.error(`Pengirim harus diisi${label}.`); return; }
      if (!s.tujuan.trim()) { toast.error(`Tujuan harus diisi${label}.`); return; }
      if (!s.jumlah || s.jumlah < 1) { toast.error(`Jumlah tidak valid${label}.`); return; }
    }
    setShowModal(true);
  };

  /* ── Submit flow: API → PDF → Auto-download ── */
  const handleConfirmSubmit = async () => {
    setShowModal(false);
    setIsSubmitting(true);
    setPdfResults([]);

    const generatedPdfs = [];
    let hasError = false;

    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const sectionLabel = sections.length > 1 ? ` (Section ${i + 1})` : "";

      // Step 1: Kirim data ke API
      setLoadingMessage(`Mengirim data permohonan${sectionLabel}…`);

      try {
        // Mapping field UI → field API
        const payload = {
          nip: nip.trim(),
          nama,
          bidang: s.bidang,
          kode: s.kodeSurat,
          indeks: s.indeksKode,
          isi_surat: s.isiSurat,
          pengirim: s.pengirim,
          tujuan: s.tujuan,
          jumlah: s.jumlah,
        };

        const result = await submitPermohonan(payload);

        // Step 2: Generate PDF dari response
        setLoadingMessage(`Membuat PDF bukti permohonan${sectionLabel}…`);

        const detail = result.detail || result;
        const { url, filename } = await generatePermohonanPdf(detail);

        generatedPdfs.push({ url, filename });

        // Step 3: Auto-download
        triggerDownload(url, filename);
      } catch (err) {
        console.error(`Gagal submit${sectionLabel}:`, err);
        toast.error(`Gagal mengirim permohonan${sectionLabel}: ${err.message}`);
        hasError = true;
        break;
      }
    }

    setIsSubmitting(false);

    if (generatedPdfs.length > 0) {
      setPdfResults(generatedPdfs);
      setShowSuccessModal(true);
    }

    if (!hasError) {
      handleReset();
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Cleanup Blob URLs to free memory
    pdfResults.forEach((pdf) => URL.revokeObjectURL(pdf.url));
    setPdfResults([]);
  };

  /* ── Reset ── */
  const handleReset = () => {
    setNip(""); setNama("");
    sectionCounter = 1;
    setSections([{ id: 1, bidang: "", kodeSurat: "", indeksKode: "", tanggalPermintaan: "", tanggalSurat: "", isiSurat: "", pengirim: "", tujuan: "", jumlah: 1 }]);
  };

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
                <span className="nama-display-label">Nama Pegawai</span>
                <span className="nama-display-value">{nama}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── SECTIONS ── */}
        {isNipRegistered && (
          <>
            {sections.map((section, index) => (
              <div className="section-card" key={section.id}>
                <div className="section-header">
                  <div className="section-title-group">
                    {/* <div className="section-badge">{index + 1}</div> */}
                    {/* <div className="section-title-text">Section {index + 1}</div> */}
                  </div>
                  {sections.length > 1 && (
                    <button className="btn-hapus" type="button" onClick={() => removeSection(section.id)}>
                      <FontAwesomeIcon icon={faTrash} size="xs" />
                      HAPUS
                    </button>
                  )}
                </div>

                {/* Row 1: Bidang | Kode Surat */}
                <div className="form-grid-2">
                  <div className="form-field">
                    <div className="field-label">Bidang <span className="required">*</span></div>
                    <select
                      className="form-select"
                      value={section.bidang}
                      onChange={(e) => updateSection(section.id, "bidang", e.target.value)}
                    >
                      <option value="" disabled>Pilih Bidang</option>
                      {bidangOptions.map((o, i) => <option key={`${o.value}-${i}`} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>

                  <div className="form-field">
                    <div className="field-label">Kode Surat <span className="required">*</span></div>
                    <select
                      className="form-select"
                      value={section.kodeSurat}
                      onChange={(e) => updateSection(section.id, "kodeSurat", e.target.value)}
                    >
                      <option value="" disabled>Pilih Kode</option>
                      {kodeOptions.map((o, i) => <option key={`${o.value}-${i}`} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 1b: Indeks Kode — full width */}
                <div className="form-grid-1">
                  <div className="form-field">
                    <div className="field-label">Indeks Kode <span className="required">*</span></div>
                    <SearchableDropdown
                      options={section.kodeSurat ? (indeksCache[section.kodeSurat] ?? []) : []}
                      value={section.indeksKode}
                      onChange={(val) => updateSection(section.id, "indeksKode", val)}
                      placeholder={
                        loadingIndeks[section.id]
                          ? "Memuat indeks…"
                          : section.kodeSurat
                            ? "Pilih Indeks Kode…"
                            : "Pilih Kode Surat dahulu"
                      }
                      disabled={!section.kodeSurat || loadingIndeks[section.id]}
                    />
                  </div>
                </div>

                {/* Row 2: Tanggal Permintaan | Tanggal Surat */}
                <div className="form-grid-2">
                  <div className="form-field">
                    <div className="field-label">Tanggal Permintaan <span className="required">*</span></div>
                    <input
                      type="date"
                      className="form-input"
                      value={section.tanggalPermintaan}
                      onChange={(e) => updateSection(section.id, "tanggalPermintaan", e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <div className="field-label">Tanggal Surat <span className="required">*</span></div>
                    <input
                      type="date"
                      className="form-input"
                      value={section.tanggalSurat}
                      onChange={(e) => updateSection(section.id, "tanggalSurat", e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 3: Isi Surat */}
                <div className="form-grid-1">
                  <div className="form-field">
                    <div className="field-label">Isi Surat<span className="required">*</span></div>
                    <textarea
                      className="form-textarea"
                      placeholder="Deskripsikan isi/perihal surat…"
                      value={section.isiSurat}
                      onChange={(e) => updateSection(section.id, "isiSurat", e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 4: Pengirim | Tujuan | Jumlah */}
                <div className="form-grid-3">
                  <div className="form-field">
                    <div className="field-label">Pengirim<span className="required">*</span></div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nama pengirim…"
                      value={section.pengirim}
                      onChange={(e) => updateSection(section.id, "pengirim", e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <div className="field-label">Tujuan<span className="required">*</span></div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Instansi/pihak tujuan…"
                      value={section.tujuan}
                      onChange={(e) => updateSection(section.id, "tujuan", e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <div className="field-label">Jumlah<span className="required">*</span></div>
                    <input
                      type="number"
                      className="form-input"
                      min="1"
                      max="20"
                      value={section.jumlah}
                      onChange={(e) => updateSection(section.id, "jumlah", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
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
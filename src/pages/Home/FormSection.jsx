import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import SearchableDropdown from "../../components/common/SearchableDropdown";

export default function FormSection({
  section,
  index,
  totalSections,
  bidangOptions,
  kodeOptions,
  indeksCache,
  loadingIndeks,
  updateSection,
  removeSection
}) {
  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-title-group">
          {/* <div className="section-badge">{index + 1}</div> */}
          {/* <div className="section-title-text">Section {index + 1}</div> */}
        </div>
        {totalSections > 1 && (
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
  );
}

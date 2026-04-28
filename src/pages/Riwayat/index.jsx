import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { useRiwayat } from "../../hooks/useRiwayat";
import RiwayatTable from "./RiwayatTable";

export default function Riwayat() {
  const {
    nipSearch, setNipSearch, searchResult, searchedNip, namaResult,
    isSearching, currentPage, setCurrentPage, perPage, setPerPage,
    handleSearch
  } = useRiwayat();

  return (
    <div className="riwayat-card">
      <div className="form-main-card-title">Riwayat Permohonan</div>
      <div className="form-main-card-subtitle">
        Masukkan NIP untuk melihat riwayat permohonan nomor surat.
      </div>

      {/* Search */}
      <div className="riwayat-search-section">
        <div className="applicant-section" style={{ marginBottom: 0 }}>
          <div className="field-label">Cari Berdasarkan NIP<span className="required">*</span></div>
          <div className="nip-search-wrapper">
            <input
              className="nip-input"
              placeholder="Masukkan NIP…"
              type="text"
              value={nipSearch}
              onChange={(e) => setNipSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isSearching && handleSearch()}
              maxLength={18}
              disabled={isSearching}
            />
            <button
              className="nip-search-btn"
              type="button"
              onClick={handleSearch}
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
        </div>
      </div>

      {/* Not found */}
      {searchResult === "not_found" && (
        <div className="alert-not-found">
          <span className="alert-not-found-icon">⚠️</span>
          <span>
            NIP <strong>{searchedNip}</strong> tidak terdaftar dalam sistem.
          </span>
        </div>
      )}

      {/* Found but no records */}
      {Array.isArray(searchResult) && searchResult.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-text">
            Belum ada riwayat permohonan untuk NIP ini.
          </div>
        </div>
      )}

      {/* Table */}
      {Array.isArray(searchResult) && searchResult.length > 0 && (
        <RiwayatTable
          searchResult={searchResult}
          namaResult={namaResult}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      )}

      {/* Initial state */}
      {searchResult === null && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">
            Masukkan NIP di atas lalu klik Cari untuk melihat riwayat permohonan.
          </div>
        </div>
      )}
    </div>
  );
}

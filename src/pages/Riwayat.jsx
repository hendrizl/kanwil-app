import { useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUser,
  faSpinner,
  faChevronLeft,
  faChevronRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { getNamaByNIP, isNamaNotFound, getPermohonanByNIP } from "../services/api";

const PAGE_SIZE_OPTIONS = [10, 50, 100, 500];

export default function Riwayat() {
  const [nipSearch, setNipSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchedNip, setSearchedNip] = useState("");
  const [namaResult, setNamaResult] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Tambahkan fungsi ini di dalam script frontend Anda
  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    const date = new Date(tgl);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  const handleSearch = async () => {
    const trimmed = nipSearch.trim();
    if (!trimmed) { toast.error("Masukkan NIP terlebih dahulu."); return; }
    if (!/^\d+$/.test(trimmed)) { toast.error("NIP hanya boleh berisi angka."); return; }
    if (trimmed.length !== 18) { toast.error("NIP harus terdiri dari 18 digit."); return; }

    setIsSearching(true);
    setSearchResult(null);
    setNamaResult("");
    setCurrentPage(1);

    try {
      // Step 1: Validasi NIP
      const nipResult = await getNamaByNIP(trimmed);

      if (isNamaNotFound(nipResult.nama)) {
        setSearchResult("not_found");
        setSearchedNip(trimmed);
        return;
      }

      setNamaResult(nipResult.nama);
      setSearchedNip(trimmed);

      // Step 2: Ambil riwayat permohonan dari spreadsheet
      const riwayatResult = await getPermohonanByNIP(trimmed);

      if (riwayatResult.count > 0 && Array.isArray(riwayatResult.data)) {
        setSearchResult(riwayatResult.data);
      } else {
        setSearchResult([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghubungi server. Periksa koneksi internet Anda.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="riwayat-card">
      <div className="form-main-card-title">Riwayat Permohonan</div>
      <div className="form-main-card-subtitle">
        Masukkan NIP untuk melihat riwayat permohonan nomor surat.
      </div>

      {/* Search */}
      <div className="riwayat-search-section">
        <div className="applicant-section" style={{ marginBottom: 0 }}>
          <div className="field-label">Cari Berdasarkan NIP</div>
          <div className="nip-search-wrapper">
            <input
              className="nip-input"
              placeholder="Masukkan NIP…"
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
      {Array.isArray(searchResult) && searchResult.length > 0 && (() => {
        const totalItems = searchResult.length;
        const totalPages = Math.ceil(totalItems / perPage);
        const startIdx = (currentPage - 1) * perPage;
        const endIdx = Math.min(startIdx + perPage, totalItems);
        const pageData = searchResult.slice(startIdx, endIdx);

        return (
          <>
            <div className="nama-display" style={{ marginBottom: 16 }}>
              <div className="nama-display-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="nama-display-info">
                <span className="nama-display-label">Nama Pegawai</span>
                <span className="nama-display-value">{namaResult}</span>
              </div>
            </div>

            <div className="riwayat-table-wrapper">
              <table className="riwayat-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Tanggal</th>
                    <th>Indeks</th>
                    <th>Nomor Surat</th>
                    <th>Perihal</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((row, i) => (
                    <tr key={row.id || (startIdx + i)}>
                      <td>{startIdx + i + 1}</td>
                      <td style={{ maxWidth: 260 }}>
                        {formatTanggal(row.tgl_surat)}
                      </td>
                      <td>{row.indeks}</td>
                      <td>{row.nomorSurat}</td>
                      <td>{row.isi_surat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-bar">
              <div className="pagination-info">
                Menampilkan {startIdx + 1}–{endIdx} dari {totalItems} data
              </div>

              <div className="pagination-controls">
                <div className="pagination-perpage">
                  <span className="pagination-perpage-label">Per halaman:</span>
                  <select
                    className="pagination-select"
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {PAGE_SIZE_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div className="pagination-buttons">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    title="Halaman pertama"
                  >
                    <FontAwesomeIcon icon={faAnglesLeft} />
                  </button>
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    title="Sebelumnya"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>

                  <span className="pagination-page-info">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    title="Selanjutnya"
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    title="Halaman terakhir"
                  >
                    <FontAwesomeIcon icon={faAnglesRight} />
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      })()}

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
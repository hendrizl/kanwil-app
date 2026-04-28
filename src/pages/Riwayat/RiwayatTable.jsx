import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faAnglesLeft,
  faAnglesRight,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { formatTanggal, formatWaktu } from "../../utils/formatter";

const PAGE_SIZE_OPTIONS = [10, 50, 100, 500];

export default function RiwayatTable({
  searchResult,
  namaResult,
  currentPage,
  setCurrentPage,
  perPage,
  setPerPage
}) {
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
          <span className="nama-display-label">Nama Pemohon</span>
          <span className="nama-display-value">{namaResult}</span>
        </div>
      </div>

      <div className="riwayat-table-wrapper">
        <table className="riwayat-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Waktu</th>
              <th>Indeks</th>
              <th>Nomor Surat</th>
              <th>Perihal</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => (
              <tr key={`riwayat-${startIdx + i}`}>
                <td>{startIdx + i + 1}</td>
                <td style={{ maxWidth: 120, minWidth: 120 }}>
                  {formatTanggal(row.tgl_surat)}
                </td>
                <td style={{ maxWidth: 120, minWidth: 120 }}>
                  {formatWaktu(row.timestamp)}
                </td>
                <td style={{ maxWidth: 250, minWidth: 250 }}>
                  <div style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }} title={row.indeks}>
                    {row.indeks}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>{row.nomor_surat}</td>
                <td style={{ maxWidth: 250, minWidth: 250 }}>
                  <div style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }} title={row.isi_surat}>
                    {row.isi_surat}
                  </div>
                </td>
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
}

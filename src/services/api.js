/**
 * Konfigurasi API — Google Apps Script Web App
 */
const GAS_BASE_URL =
  "https://script.google.com/macros/s/AKfycbx8PNTSHlye5FN1Uxkof5nMNiD8QXGMrQnVchLV0Ko/dev";

/**
 * Cari nama pegawai berdasarkan NIP.
 * @returns {{ nip: string, nama: string }}
 */
export async function getNamaByNIP(nip) {
  const url = `${GAS_BASE_URL}?action=getNamaByNIP&nip=${encodeURIComponent(nip)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return await response.json();
}

/**
 * Ambil daftar Bidang dan Kode Surat.
 * @returns {{ bidang: string[], kode: string[] }}
 */
export async function getLists() {
  const url = `${GAS_BASE_URL}?action=getLists`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return await response.json();
}

/**
 * Ambil daftar indeks berdasarkan kode surat.
 * @param {string} kode — contoh: "SA", "PR", "KU"
 * @returns {{ kode: string, indeks: string | string[] }}
 */
export async function getIndeksByKode(kode) {
  const url = `${GAS_BASE_URL}?action=getIndeks&kode=${encodeURIComponent(kode)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return await response.json();
}

/**
 * Ambil riwayat permohonan berdasarkan NIP.
 * @param {string} nip
 * @returns {{ count: number, data: object[] }}
 */
export async function getPermohonanByNIP(nip) {
  const url = `${GAS_BASE_URL}?action=getPermohonan&nip=${encodeURIComponent(nip)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return await response.json();
}

/**
 * Endpoint khusus untuk submit permohonan (berbeda dari GAS_BASE_URL).
 */
const GAS_SUBMIT_URL =
  "https://script.google.com/macros/s/AKfycbys8i_Ks8SuJBSh6BdQTNL91QQptxqWQ8WNOqE_tcW-HTC0PAU3HjS2nCINtJxTYqsP/exec";

/**
 * Kirim permohonan nomor surat ke spreadsheet.
 * @param {object} data — { nip, nama, bidang, kode, indeks, isi_surat, pengirim, tujuan, jumlah }
 * @returns {{ code, success, message, detail }}
 */
export async function submitPermohonan(data) {
  const body = JSON.stringify({ action: "tambahPermohonan", data });

  // GAS tidak support CORS preflight, pakai text/plain agar tidak ada OPTIONS request
  const response = await fetch(GAS_SUBMIT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body,
  });

  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Gagal menyimpan permohonan.");
  }

  return result;
}

/**
 * Helper: cek apakah response nama "tidak ditemukan"
 */
export function isNamaNotFound(nama) {
  return (
    !nama ||
    nama.toLowerCase().includes("tidak ditemukan") ||
    nama.toLowerCase().includes("not found")
  );
}

/**
 * Helper: cek apakah response indeks "tidak ditemukan"
 */
export function isIndeksNotFound(indeks) {
  return (
    !indeks ||
    typeof indeks === "string" && indeks.toLowerCase().includes("tidak ditemukan")
  );
}

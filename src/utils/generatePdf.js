import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Convert image URL/path ke base64 data URL untuk jsPDF.
 */
function loadImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      // Fill canvas with white background before drawing (in case PNG is transparent)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      // Export as compressed JPEG to drastically reduce file size
      resolve(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Generate PDF surat permohonan.
 * Mengembalikan { url, filename } — Blob URL agar bisa di-auto-download
 * sekaligus disimpan untuk tombol fallback download di UI.
 *
 * @param {object} detail — response detail dari GAS
 *   { nama_pemohon, kode, indeks, jumlah_dibuat, firs_number, last_number, keterangan }
 * @returns {{ url: string, filename: string }}
 */
export async function generatePermohonanPdf(detail) {
  const {
    nama_pemohon,
    kode,
    indeks,
    jumlah_dibuat,
    firs_number,
    last_number,
    keterangan,
  } = detail;

  // Load logos
  const [logoLeft, logoRight] = await Promise.all([
    loadImageAsBase64(new URL("../assets/logo_imipas.png", import.meta.url).href),
    loadImageAsBase64(new URL("../assets/logo_pas.png", import.meta.url).href),
  ]);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true, // Mengaktifkan kompresi stream bawaan jsPDF
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;

  // ─── LOGOS ───
  const logoSize = 28;
  const logoGap = 2;
  const logoY = 14;
  doc.addImage(logoLeft, "JPEG", centerX - logoGap - logoSize, logoY, logoSize, logoSize, undefined, "FAST");
  doc.addImage(logoRight, "JPEG", centerX + logoGap, logoY, logoSize, logoSize, undefined, "FAST");

  // ─── TITLE ───
  const titleY = logoY + logoSize + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("KANTOR WILAYAH DIREKTORAT JENDERAL PEMASYARAKATAN", centerX, titleY, { align: "center" });
  doc.text("KALIMANTAN TIMUR", centerX, titleY + 7, { align: "center" });

  // ─── TOTAL PERMOHONAN ───
  const infoY = dividerY + 10;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Total Permohonan : ", pageWidth - 40, infoY, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.text(`${jumlah_dibuat}`, pageWidth - 40, infoY);

  // ─── TABLE ───
  // Build rows: nomor urut, kode, nomor surat ("Indeks"-xxxx), keterangan
  const firstNum = parseInt(firs_number, 10);
  const rows = [];
  for (let i = 0; i < jumlah_dibuat; i++) {
    rows.push([
      i + 1,
      indeks,
      firstNum + i,
      keterangan || "-",
    ]);
  }

  const tableStartY = infoY + 8;

  autoTable(doc, {
    startY: tableStartY,
    head: [["No.", "Kode", "Nomor Surat", "Keterangan"]],
    body: rows,
    theme: "grid",
    margin: { left: 10, right: 10 },
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 4,
      valign: "middle",
      lineColor: [60, 60, 60],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [3, 34, 60],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      fontSize: 10,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 14 },
      1: { halign: "center", cellWidth: 56 },
      2: { halign: "center", cellWidth: 22 },
      3: { halign: "left" },
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  // ─── FOOTER — NAMA PEMOHON ───
  const finalY = doc.lastAutoTable.finalY + 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Nama Pemohon : ", 30, finalY);
  doc.setFont("helvetica", "bold");
  doc.text(`${nama_pemohon}`, 73, finalY);

  // ─── GENERATE BLOB URL ───
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const filename = `Nomor Surat_${kode}_${keterangan}_${dateStr}.pdf`;

  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);

  return { url, filename };
}

/**
 * Trigger auto-download dari Blob URL.
 * Mengembalikan true jika berhasil men-trigger download, false jika gagal.
 */
export function triggerDownload(url, filename) {
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch {
    return false;
  }
}

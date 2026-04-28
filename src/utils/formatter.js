export const formatTanggal = (tgl) => {
  if (!tgl) return "-";
  const date = new Date(tgl);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};


export const formatWaktu = (ts) => {
  if (!ts) return "-";

  // Jika formatnya yyyyMMddHHmmss (14 digit)
  const tsStr = String(ts);
  if (tsStr.length === 14 && /^\d+$/.test(tsStr)) {
    const hh = tsStr.substring(8, 10);
    const mm = tsStr.substring(10, 12);
    const ss = tsStr.substring(12, 14);
    return `${hh}:${mm}:${ss}`;
  }

  const date = new Date(ts);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\./g, ':');
};

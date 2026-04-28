import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getNamaByNIP, isNamaNotFound, getLists, getIndeksByKode, submitPermohonan } from "../services/api";
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

export function useSuratForm() {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [pdfResults, setPdfResults] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [bidangOptions, setBidangOptions] = useState([]);
  const [kodeOptions, setKodeOptions] = useState([]);
  const [indeksCache, setIndeksCache] = useState({});
  const [loadingIndeks, setLoadingIndeks] = useState({});
  const [isLoadingLists, setIsLoadingLists] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getLists();
        if (cancelled) return;

        const bidang = (data.bidang || []).map((b) => ({ value: b, label: b }));
        setBidangOptions(bidang);

        const kode = (data.kode || [])
          .filter((k) => k && k.trim() && !k.startsWith(" ("))
          .map((k) => {
            const match = k.match(/^([A-Z]+)\s*\((.+)\)$/);
            if (match) {
              return { value: match[1], label: `${match[1]} (${match[2]})` };
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

  const fetchIndeksForKode = async (kode, sectionId) => {
    if (indeksCache[kode]) return;

    setLoadingIndeks((prev) => ({ ...prev, [sectionId]: true }));
    try {
      const result = await getIndeksByKode(kode);
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

  const updateSection = (id, field, value) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (field === "kodeSurat") return { ...s, kodeSurat: value, indeksKode: "" };
        return { ...s, [field]: value };
      })
    );
    if (field === "kodeSurat" && value) {
      fetchIndeksForKode(value, id);
    }
  };

  const addSection = () => setSections((prev) => [...prev, createSection()]);

  const removeSection = (id) => {
    if (sections.length === 1) { toast.error("Minimal harus ada 1 permohonan."); return; }
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

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

  const handleConfirmSubmit = async () => {
    setShowModal(false);
    setIsSubmitting(true);
    setPdfResults([]);

    const generatedPdfs = [];
    let hasError = false;

    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const sectionLabel = sections.length > 1 ? ` (Section ${i + 1})` : "";
      setLoadingMessage(`Mengirim data permohonan${sectionLabel}…`);

      try {
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
        setLoadingMessage(`Membuat PDF bukti permohonan${sectionLabel}…`);

        const detail = result.detail || result;
        const { url, filename } = await generatePermohonanPdf(detail);

        generatedPdfs.push({ url, filename });
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
      handleCompleteProccess();
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    pdfResults.forEach((pdf) => URL.revokeObjectURL(pdf.url));
    setPdfResults([]);
  };

  const handleReset = () => {
    sectionCounter = 1;
    setSections([{ id: 1, bidang: "", kodeSurat: "", indeksKode: "", tanggalPermintaan: "", tanggalSurat: "", isiSurat: "", pengirim: "", tujuan: "", jumlah: 1 }]);
  };

  const handleCompleteProccess = () => {
    setNip("");
    setNama("");
    sectionCounter = 1;
    setSections([{ id: 1, bidang: "", kodeSurat: "", indeksKode: "", tanggalPermintaan: "", tanggalSurat: "", isiSurat: "", pengirim: "", tujuan: "", jumlah: 1 }]);
  };


  return {
    nip, setNip, nama, sections,
    showModal, setShowModal, isSearching, isSubmitting, loadingMessage,
    pdfResults, showSuccessModal, setShowSuccessModal,
    bidangOptions, kodeOptions, indeksCache, loadingIndeks, isLoadingLists,
    isNipRegistered, handleSearchNip, updateSection, addSection, removeSection,
    handleSubmitClick, handleConfirmSubmit, handleCloseSuccessModal, handleReset
  };
}

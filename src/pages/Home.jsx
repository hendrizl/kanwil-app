import { useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";
import SearchableDropdown from "../components/SearchableDropdown";


export default function Home() {
  const [nip, setNip] = useState("");
  const [nama, setNama] = useState("");
  const [bidang, setBidang] = useState("");
  const [kodeSurat, setKodeSurat] = useState("");
  const [indeksKode, setIndeksKode] = useState("");
  const [ambilLebihDariSatu, setAmbilLebihDariSatu] = useState(false);
  const [jumlahNomorSurat, setJumlahNomorSurat] = useState(1);

  const userData = {
    "199910082025061015": "Hendrizal",
    "123": "Siti Aminah",
    "1122334455": "Agus Priyanto",
  };

  const bidangOptions = [
    { value: "Bidang Perawatan, Pengamanan dan Kepatuhan Internal", label: "Bidang Perawatan, Pengamanan dan Kepatuhan Internal" },
    { value: "Bidang Pembimbingan Kemasyarakatan", label: "Bidang Pembimbingan Kemasyarakatan" },
    { value: "Bidang Tata Usaha dan Umum", label: "Bidang Tata Usaha dan Umum" },
    { value: "Bidang Pelayanan dan Pembinaan", label: "Bidang Pelayanan dan Pembinaan" },
  ];

  const kodeOptions = [
    { value: "PR", label: "PR - Perencanaan" },
    { value: "OT", label: "OT - Organisasi dan Tata Laksana" },
    { value: "SA", label: "SA - Sumber Daya Manusia Aparatur" },
    { value: "KU", label: "KU - Keuangan" },
    { value: "PB", label: "PB - Penatausahaan BMN" },
    { value: "HK", label: "HK - Hukum dan Kerjasama" },
    { value: "UM", label: "UM - Umum" },
    { value: "PW", label: "PW - Pengawasan" },
    { value: "TI", label: "TI - Teknologi dan Informasi" },
    { value: "PK", label: "PK - Pemasyarakatan" },
  ];

  const indeksOptions = [
    { value: "SA.01.01", label: "SA.01.01 (Inventarisasi Jabatan/Peta Jabatan)" },
    { value: "SA.01.02", label: "SA.01.02 (Evaluasi Jabatan)" },
    { value: "SA.01.03", label: "SA.01.03 (Usulan Formasi)" },
    { value: "SA.01.04", label: "SA.01.04 (Alokasi Formasi)" },
    { value: "SA.02.01", label: "SA.02.01 (Proses Penerimaan SDM Aparatur)" },
    { value: "SA.02.02", label: "SA.02.02 (Berkas Lamaran Yang Tidak Diterima)" },
    { value: "SA.02.03", label: "SA.02.03 (Surat Keputusan CPNS/PNS Kolektif)" },
    { value: "SA.02.04", label: "SA.02.04 (Penerimaan Pegawai POLTEKIP/AIM)" },
    { value: "SA.02.05", label: "SA.02.05 (Ujian Dinas dan Ujian Penyesuaian Ijasah)" },
    { value: "SA.03.01", label: "SA.03.01 (Pengangkatan CPNS)" },
    { value: "SA.03.02", label: "SA.03.02 (Pengangkatan PNS)" },
    { value: "SA.03.03", label: "SA.03.03 (Pengangkatan Jabatan Struktural)" },
    { value: "SA.03.04", label: "SA.03.04 (Pengangkatan Jabatan Fungsional)" },
    { value: "SA.04.01", label: "SA.04.01 (Alih Tugas/Diperbantukan/Dipekerjakan/Pelaksana)" },
    { value: "SA.04.02", label: "SA.04.02 (Pelaksana Harian/Pelaksana Tugas)" },
    { value: "SA.04.03", label: "SA.04.03 (Pencantuman Gelar Akademik)" },
    { value: "SA.04.04", label: "SA.04.04 (Kenaikan Gaji Berkala)" },
    { value: "SA.04.05", label: "SA.04.05 (Kenaikan Pangkat/Golongan)" },
    { value: "SA.04.06", label: "SA.04.06 (Peninjauan Masa Kerja)" },
    { value: "SA.04.07", label: "SA.04.07 (Berkas Badan Pertimbangan Jabatan dan Pangkat (Baperjakat))" }, 
    { value: "SA.04.08", label: "SA.04.08 (Pengaktifan Kembali dari CLTN dan Hukuman Disiplin)" },
    { value: "SA.05.01", label: "SA.05.01 (Penilaian Prestasi Kerja Pegawai (PPKP))" },
    { value: "SA.05.02", label: "SA.05.02 (Pembinaan Disiplin dan Kode Etik)" },
    { value: "SA.05.03", label: "SA.05.03 (Pemberian Penghargaan dan Tanda Jasa)" },
    { value: "SA.06.01", label: "SA.06.01 (Pengembangan Kompetensi Jabatan Pimti dan Administrasi)" },
    { value: "SA.06.02", label: "SA.06.02 (Pengembangan Kompetensi Fungsional)" },
    { value: "SA.06.03", label: "SA.06.03 (Pengiriman Peserta Diklat)" },
    { value: "SA.06.04", label: "SA.06.04 (Beasiswa)" },
    { value: "SA.07.01", label: "SA.07.01 (Hukuman Disiplin Tingkat Ringan)" },
    { value: "SA.07.02", label: "SA.07.02 (Hukuman Disiplin Tingkat Sedang)" },
    { value: "SA.07.03", label: "SA.07.03 (Hukuman Disiplin Tingkat Berat)" },
    { value: "SA.08.01", label: "SA.08.01 (Data SDM Aparatur)" },
    { value: "SA.08.02", label: "SA.08.02 (Identitas Pegawai [Karpeg, Karsu, Karis])" },
    { value: "SA.08.03", label: "SA.08.03 (Izin Kepegawaian [Izin Belajar, Tugas Belajar Dalam dan Luar Negeri])" },
    { value: "SA.08.04", label: "SA.08.04 (Keanggotaan SDM Aparatur Dalam Organisasi Sosial)" },
    { value: "SA.08.05", label: "SA.08.05 (Daftar Hadir/Absensi)" },
    { value: "SA.09.01", label: "SA.09.01 (Kesehatan)" },
    { value: "SA.09.02", label: "SA.09.02 (Perumahan [TAPERA, Biaya Uang Muka])" },
    { value: "SA.09.03", label: "SA.09.03 (Taspen)" },
    { value: "SA.09.04", label: "SA.09.04 (Cuti)" },
    { value: "SA.09.05", label: "SA.09.05 (Uang Duka Tewas)" },
    { value: "SA.09.06", label: "SA.09.06 (Pembekalan Purnabhakti)" },
    { value: "SA.09.07", label: "SA.09.07 (Mutasi Keluarga [Nikah, Cerai, Anak, Kematian])" },
    { value: "SA.09.08", label: "SA.09.08 (Laporan Kekayaan LP2P dan LHKPN)" },
    { value: "SA.10.01", label: "SA.10.01 (Pembinaan Jabatan Fungsional Umum)" },
    { value: "SA.10.02", label: "SA.10.02 (Pembinaan Jabatan Fungsional Tertentu)" },
    { value: "SA.11.01", label: "SA.11.01 (Pemberhentian Pegawai Atas Permintaan Sendiri)" },
    { value: "SA.11.02", label: "SA.11.02 (Pemberhentian Karena Batas Usia Pensiun)" },
    { value: "SA.11.03", label: "SA.11.03 (Pemberhentian Karena Kondisi Jasmani dan/atau Rohani)" },
    { value: "SA.11.04", label: "SA.11.04 (Pemberhentian Karena Hilang)" },
    { value: "SA.11.05", label: "SA.11.05 (Pemberhentian Sementara)" },
    { value: "SA.11.06", label: "SA.11.06 (Pensiun Janda/Duda dan Anak)" },
    { value: "SA.12", label: "SA.12 (Berkas PNS/ASN)" },
    { value: "SA.13", label: "SA.13 (Berkas Perseorangan Menteri, Wakil Menteri dan Pejabat Negara Lainnya)" },
    { value: "SA.14.01", label: "SA.14.01 (Organisasi Non Kedinasan (KORPRI))" },
    { value: "SA.14.02", label: "SA.14.02 (Organisasi Non Kedinasan (Dharma Wanita))" },
    { value: "SA.14.03", label: "SA.14.03 (Organisasi Non Kedinasan (Koperasi))" }
    
  ];

  const handleSearchNip = () => {
    const trimmedNip = nip.trim();

    if (trimmedNip.length !== 18) {
      setNama("");
      toast.error("NIP tidak sesuai, Pastikan NIP terdiri dari 18 digit.");
      return;
    }

    if (!/^\d+$/.test(trimmedNip)) {
      setNama("");
      toast.error("NIP hanya boleh berisi angka");
      return;
    }

    const foundName = userData[trimmedNip];

    if (foundName) {
      setNama(foundName);
    } else {
      setNama("");
      toast.error("NIP tidak ditemukan, Pastikan NIP benar.");
    }
  };

  const handleSubmit = () => {
    if (!nip.trim()) {
      toast.error("NIP harus diisi");
      return;
    }
    if (!bidang) {
      toast.error("Bidang harus dipilih");
      return;
    }
    if (!kodeSurat) {
      toast.error("Kode Surat harus dipilih");
      return;
    }
    if (!indeksKode) {
      toast.error("Indeks Kode harus dipilih");
      return;
    }

    const confirmed = window.confirm("Apakah Anda yakin ingin mengirim permohonan ini?");
    if (!confirmed) {
      return;
    }

    toast.success("Permohonan berhasil terkirim");
    handleReset();
  };

  const handleReset = () => {
    setNip("");
    setNama("");
    setBidang("");
    setKodeSurat("");
    setIndeksKode("");
    setAmbilLebihDariSatu(false);
    setJumlahNomorSurat(1);
  };

  const isNipRegistered = Boolean(nama);
  const checkedAmbilLebihDariSatu = Boolean(ambilLebihDariSatu);


  return (
    <div className="card">
      <h2>Form Permohonan</h2>
      <div className="subtitle-2">Silakan isi data di bawah ini.</div>

        <form className="form" onSubmit={(event) => event.preventDefault()}>
          {/* Section 1: NIP dan Nama */}
          <div className="form-section">
            <div className="form-group">
              <label>NIP</label>
              <div className="input-with-button">
                <input
                  placeholder="Masukkan NIP"
                  value={nip}
                  onChange={(event) => setNip(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearchNip();
                    }
                  }}
                />
                <button type="button" className="btn-search" onClick={handleSearchNip}>
                  <FontAwesomeIcon icon={faMagnifyingGlass}  />
                </button>
              </div>
            </div>

          <div className="form-group">
            <label>Nama</label>
            <input value={nama} disabled />
          </div>
        </div>

        {isNipRegistered && (
          <>
            {/* Section 2: Field sisanya */}
            <div className="form-section">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Bidang</label>
                  <select value={bidang} onChange={(event) => setBidang(event.target.value)}>
                    <option value="" disabled>
                      Pilih Bidang
                    </option>
                    {bidangOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Kode Surat</label>
                  <select value={kodeSurat} onChange={(event) => setKodeSurat(event.target.value)}>
                    <option value="" disabled>
                      Pilih Kode
                    </option>
                    {kodeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Dropdown pilih indeks kode */}
            <div className="form-section">
              <div className="form-group">
                <label>Indeks Kode</label>
                <SearchableDropdown
                  options={indeksOptions}
                  value={indeksKode}
                  onChange={(value) => setIndeksKode(value)}
                  placeholder="Pilih Indeks Kode"
                />
              </div>

              <div className="form-row-2">
                <div className="input-checkbox">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={ambilLebihDariSatu}
                      onChange={(event) => setAmbilLebihDariSatu(event.target.checked)}
                    />
                    Ambil lebih dari 1 nomor
                  </label>
                </div>

                <div className="form-group" style={{ visibility: ambilLebihDariSatu ? 'visible' : 'hidden', opacity: ambilLebihDariSatu ? 1 : 0.5 }}>
                  <label>Jumlah Nomor Surat</label>
                  <input
                    type="number"
                    min="1"
                    value={jumlahNomorSurat}
                    disabled={!ambilLebihDariSatu}
                    onChange={(event) => setJumlahNomorSurat(Number(event.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleReset}>
                Hapus
              </button>
              <button type="button" className="btn-submit" onClick={handleSubmit}>
                Kirim
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
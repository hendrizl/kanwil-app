import { useState } from "react";
import { toast } from "react-toastify";
import { getNamaByNIP, isNamaNotFound, getPermohonanByNIP } from "../services/api";

export function useRiwayat() {
  const [nipSearch, setNipSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchedNip, setSearchedNip] = useState("");
  const [namaResult, setNamaResult] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

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
      const nipResult = await getNamaByNIP(trimmed);

      if (isNamaNotFound(nipResult.nama)) {
        setSearchResult("not_found");
        setSearchedNip(trimmed);
        return;
      }

      setNamaResult(nipResult.nama);
      setSearchedNip(trimmed);

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

  return {
    nipSearch, setNipSearch, searchResult, searchedNip, namaResult,
    isSearching, currentPage, setCurrentPage, perPage, setPerPage,
    handleSearch
  };
}

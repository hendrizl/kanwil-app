export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      © {year} Kantor Wilayah Direktorat Jenderal Pemasyarakatan Kalimantan Timur.
    </footer>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      textAlign: "center",
      fontSize: "12px",
      color: "#94a3b8",
      background: "#f0f6ffff",
      padding: "30px 20px",
      marginTop: "50px",
      borderTop: "1px solid #f1f5f9"
    }}>
      © {year} Kantor Wilayah Direktorat Jenderal Pemasyarakatan Kalimantan Timur.
    </footer>
  );
}

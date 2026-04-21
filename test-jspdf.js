import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const doc = new jsPDF();
const result = autoTable(doc, {
  head: [['Name', 'Email']],
  body: [['John', 'john@example.com']],
});

console.log("Result object:", result);
console.log("doc.lastAutoTable:", doc.lastAutoTable);
console.log("doc.previousAutoTable:", doc.previousAutoTable);

import PDFDocument from "pdfkit";
import { COMPANY_ADDRESS, COMPANY_NAME, COMPANY_EMAIL, COMPANY_PHONE } from "../constants";

export type Money = number;
export type ReceiptItem = { description: string; qty: number; rate: Money };
export type Discount = { type: "amount" | "percent"; value: number };
export type Tax = { type: "amount" | "percent"; value: number };

export interface ReceiptData {
  documentType?: "INVOICE" | "RECEIPT";
  reference?: string;
  company?: { name: string; address: string; email?: string; phone?: string; logoUrl?: string };
  customer: { name: string; email?: string; phone?: string };
  serviceDate: string;
  items: ReceiptItem[];
  discount?: Discount;
  tax?: Tax;
  notes?: string;
}

function calcTotals(items: ReceiptItem[], discount?: Discount, tax?: Tax) {
  if (!items?.length || items.some(item => !item.description || item.qty <= 0 || item.rate < 0)) {
    throw new Error("Invalid or empty items list");
  }
  const itemTotal = items.reduce((sum, it) => sum + it.qty * it.rate, 0);
  const discountVal = discount?.type === "amount" ? Math.min(discount.value, itemTotal) : 
                     discount?.type === "percent" ? (Math.max(0, Math.min(100, discount.value)) / 100) * itemTotal : 0;
  const preTax = Math.max(0, itemTotal - discountVal);
  let subtotal = preTax, taxVal = 0, total = preTax;
  if (tax?.type === "percent" && tax.value > 0) {
    subtotal = preTax / (1 + tax.value / 100);
    taxVal = preTax - subtotal;
    total = preTax;
  } else if (tax?.type === "amount" && tax.value > 0) {
    subtotal = preTax - tax.value;
    taxVal = tax.value;
    total = preTax;
  }
  return { subtotal, discountVal, taxVal, total };
}

export async function generateReceiptPDF(data: ReceiptData): Promise<Buffer> {
  const {
    documentType = "INVOICE",
    reference,
    company = { address: COMPANY_ADDRESS, name: COMPANY_NAME, email: COMPANY_EMAIL, phone: COMPANY_PHONE },
    customer,
    serviceDate,
    items,
    discount,
    tax,
    notes,
  } = data;

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const buffers: Buffer[] = [];
  doc.on("data", (chunk) => buffers.push(chunk));
  const promise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });

  doc.registerFont("Bold", "Helvetica-Bold");
  doc.registerFont("Regular", "Helvetica");
  doc.registerFont("Light", "Helvetica-Oblique");

  doc.fillColor("#1E40AF").font("Bold").fontSize(22).text(company.name, 40, 30);
  doc.fillColor("#6B7280").font("Light").fontSize(10);
  [company.address, company.email, company.phone].filter(Boolean).forEach((line, i) => {
    doc.text(line!, 40, 60 + i * 12);
  });

  doc.fillColor("#1E40AF").font("Bold").fontSize(26).text(documentType, 0, 30, { align: "right" });
  doc.fillColor("#6B7280").font("Light").fontSize(10);
  if (reference) doc.text(`Ref #: ${reference}`, 0, 60, { align: "right" });
  doc.text(`Date: ${serviceDate}`, 0, 72, { align: "right" });

  doc.moveTo(40, 100).lineTo(555, 100).lineWidth(1).strokeColor("#E5E7EB").dash(3, { space: 3 }).stroke();

  doc.fillColor("#111827").font("Bold").fontSize(12).text("Bill To", 40, 120);
  doc.font("Regular").fontSize(11).text(customer.name, 40, 138);
  if (customer.email) doc.fillColor("#6B7280").font("Light").fontSize(10).text(customer.email, 40, 150);
  if (customer.phone) doc.text(customer.phone, 40, 162);

  const tableTop = 190;
  doc.rect(40, tableTop, 515, 28).fill("#F3F4F6");
  doc.fillColor("#1E40AF").font("Bold").fontSize(11);
  doc.text("Description", 50, tableTop + 10);
  doc.text("Qty", 320, tableTop + 10);
  doc.text("Rate", 390, tableTop + 10);
  doc.text("Amount", 470, tableTop + 10);

  let y = tableTop + 28;
  doc.fillColor("#111827").font("Regular").fontSize(10);
  const { subtotal, discountVal, taxVal, total } = calcTotals(items, discount, tax);

  items.forEach((item, index) => {
    if (index % 2 === 1) doc.rect(40, y, 515, 22).fill("#F9FAFB");
    doc.moveTo(40, y).lineTo(555, y).lineWidth(0.5).strokeColor("#E5E7EB").stroke();
    doc.text(item.description, 50, y + 6, { width: 250 });
    doc.text(`${item.qty}`, 320, y + 6);
    doc.text(`INR ${item.rate.toFixed(2)}`, 390, y + 6);
    doc.text(`INR ${(item.qty * item.rate).toFixed(2)}`, 470, y + 6);
    y += 22;
  });

  doc.moveTo(40, y).lineTo(555, y).stroke();
  y += 10;

  doc.fillColor("#6B7280").font("Regular").fontSize(10);
  doc.text("Subtotal", 390, y);
  doc.text(`INR ${subtotal.toFixed(2)}`, 470, y);
  y += 16;
  if (discountVal > 0) {
    doc.text("Discount", 390, y);
    doc.text(`- ₹ ${discountVal.toFixed(2)}`, 470, y);
    y += 16;
  }
  if (taxVal > 0) {
    doc.text("Tax", 390, y);
    doc.text(`INR ${taxVal.toFixed(2)}`, 470, y);
    y += 16;
  }
  doc.moveTo(390, y + 5).lineTo(555, y + 5).lineWidth(1).strokeColor("#1E40AF").stroke();
  doc.fillColor("#111827").font("Bold").fontSize(11).text("Total", 390, y + 10);
  doc.text(`INR ${total.toFixed(2)}`, 470, y + 10);

  if (notes) {
    y += 30;
    doc.fillColor("#111827").font("Bold").fontSize(12).text("Notes", 40, y);
    doc.fillColor("#6B7280").font("Light").fontSize(10).text(notes, 40, y + 14, { width: 515 });
  }

  doc.rect(40, 760, 515, 30).fill("#F3F4F6");
  doc.fillColor("#1E40AF").font("Light").fontSize(10).text("Thank you for your business!", 0, 772, { align: "center" });

  doc.end();
  return promise;
}
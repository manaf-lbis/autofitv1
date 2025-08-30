// import PDFDocument from "pdfkit";
// import { COMPANY_ADDRESS, COMPANY_NAME, COMPANY_EMAIL, COMPANY_PHONE } from "../constants";

// export interface CheckItem { feature: string; condition: string; remarks?: string; needsAction: boolean };

// export interface InspectionReportData {
//   reference?: string;
//   company?: { name: string; address: string; email?: string; phone?: string };
//   vehicle: { regNo: string; model: string; brand: string; ownerName: string };
//   customer: { name: string; email?: string; mobile?: string };
//   reportDate: string;
//   preparedBy: { mechanicName: string; email: string; address: string };
//   plan: { name: string; description: string; price: number };
//   checks: CheckItem[];
//   overallReport: string;
// }

// function validateData(data: InspectionReportData) {
//   if (!data.checks?.length || !data.vehicle.regNo) throw new Error("Missing required data");
// }

// export async function generateInspectionReportPDF(data: InspectionReportData): Promise<Buffer> {
//   validateData(data);
//   const { reference, company = { name: COMPANY_NAME, address: COMPANY_ADDRESS, email: COMPANY_EMAIL, phone: COMPANY_PHONE },
//     vehicle, customer, reportDate, preparedBy, plan, checks, overallReport } = data;

//   const doc = new PDFDocument({ size: "A4", margin: 40 });
//   const buffers: Buffer[] = [];
//   doc.on("data", buffers.push.bind(buffers));
//   const promise = new Promise<Buffer>(resolve => doc.on("end", () => resolve(Buffer.concat(buffers))));

//   doc.registerFont("Bold", "Helvetica-Bold");
//   doc.registerFont("Regular", "Helvetica");
//   doc.registerFont("Light", "Helvetica-Oblique");

//   // Header
//   doc.fillColor("#1E40AF").font("Bold").fontSize(22).text(company.name, 40, 30);
//   doc.fillColor("#6B7280").font("Light").fontSize(10);
//   [company.address, company.email, company.phone].filter(Boolean).forEach((line, i) => doc.text(line!, 40, 60 + i * 12));

//   doc.fillColor("#1E40AF").font("Bold").fontSize(26).text("INSPECTION REPORT", 0, 30, { align: "right" });
//   doc.fillColor("#6B7280").font("Light").fontSize(10);
//   if (reference) doc.text(`Ref #: ${reference}`, 0, 60, { align: "right" });
//   doc.text(`Date: ${reportDate}`, 0, 72, { align: "right" });

//   doc.moveTo(40, 100).lineTo(555, 100).lineWidth(1).strokeColor("#E5E7EB").dash(3, { space: 3 }).stroke();

//   // Vehicle Info
//   let y = 120;
//   doc.fillColor("#111827").font("Bold").fontSize(12).text("Vehicle Details", 40, y);
//   y += 18;
//   doc.font("Regular").fontSize(11);
//   doc.text(`Reg No: ${vehicle.regNo}`, 40, y);
//   y += 12; doc.text(`Model: ${vehicle.model}`, 40, y);
//   y += 12; doc.text(`Brand: ${vehicle.brand}`, 40, y);
//   y += 12; doc.text(`Owner: ${vehicle.ownerName}`, 40, y);

//   // Customer & Prepared By (side by side?)
//   y += 30;
//   doc.text("Customer Details", 40, y);
//   y += 18; doc.text(customer.name, 40, y);
//   if (customer.email) { y += 12; doc.text(customer.email, 40, y); }
//   if (customer.mobile) { y += 12; doc.text(customer.mobile, 40, y); }

//   y += 30;
//   doc.text("Prepared By", 40, y);
//   y += 18; doc.text(preparedBy.mechanicName, 40, y);
//   y += 12; doc.text(preparedBy.email, 40, y);
//   y += 12; doc.text(preparedBy.address, 40, y);

//   // Plan Details
//   y += 30;
//   doc.text("Plan Details", 40, y);
//   y += 18; doc.text(plan.name, 40, y);
//   y += 12; doc.text(plan.description, 40, y, { width: 515 });
//   y += 12; doc.text(`Price: INR ${plan.price.toFixed(2)}`, 40, y);

//   // Checks Table
//   y += 30;
//   const tableTop = y;
//   doc.rect(40, tableTop, 515, 28).fill("#F3F4F6");
//   doc.fillColor("#1E40AF").font("Bold").fontSize(11);
//   doc.text("Feature", 50, tableTop + 10);
//   doc.text("Condition", 200, tableTop + 10);
//   doc.text("Remarks", 300, tableTop + 10);
//   doc.text("Needs Action", 450, tableTop + 10);

//   y = tableTop + 28;
//   doc.fillColor("#111827").font("Regular").fontSize(10);
//   checks.forEach((check, index) => {
//     if (index % 2 === 1) doc.rect(40, y, 515, 22).fill("#F9FAFB");
//     doc.moveTo(40, y).lineTo(555, y).lineWidth(0.5).strokeColor("#E5E7EB").stroke();
//     doc.text(check.feature, 50, y + 6, { width: 140 });
//     doc.text(check.condition, 200, y + 6);
//     doc.text(check.remarks || "-", 300, y + 6, { width: 140 });
//     doc.text(check.needsAction ? "Yes" : "No", 450, y + 6);
//     y += 22;
//   });
//   doc.moveTo(40, y).lineTo(555, y).stroke();

//   // Overall Report
//   y += 20;
//   doc.fillColor("#111827").font("Bold").fontSize(12).text("Overall Report", 40, y);
//   doc.fillColor("#6B7280").font("Light").fontSize(10).text(overallReport, 40, y + 14, { width: 515 });

//   // Signature
//   y += 40;
//   doc.text("Authorised by Autofil", 40, y);
//   doc.moveTo(40, y + 20).lineTo(200, y + 20).stroke();  // Signature line

//   // Footer
//   doc.rect(40, 760, 515, 30).fill("#F3F4F6");
//   doc.fillColor("#1E40AF").font("Light").fontSize(10).text("Thank you for choosing us!", 0, 772, { align: "center" });

//   doc.end();
//   return promise;
// }









import PDFDocument from "pdfkit";
import {
  COMPANY_ADDRESS,
  COMPANY_NAME,
  COMPANY_EMAIL,
  COMPANY_PHONE,
} from "../constants";

export interface CheckItem {
  feature: string;
  condition: string;
  remarks?: string;
  needsAction: boolean;
}

export interface InspectionReportData {
  reference?: string;
  company?: { name: string; address: string; email?: string; phone?: string };
  vehicle: { regNo: string; model: string; brand: string; ownerName: string };
  customer: { name: string; email?: string; mobile?: string };
  reportDate: string; // ISO or Date parsable string
  preparedBy: { mechanicName: string; email: string; address: string };
  plan: { name: string; description: string; price: number };
  checks: CheckItem[];
  overallReport: string;
}

function validateData(data: InspectionReportData) {
  if (!data.checks?.length) throw new Error("Missing checks array");
  if (!data.vehicle?.regNo) throw new Error("Missing vehicle.regNo");
}

/**
 * Draws the small header at the top of the page (company name + title).
 * Returns new Y position (top margin).
 */
function drawPageHeader(doc: typeof PDFDocument, dataCompany: { name: string }) {
  const top = doc.page.margins.top;
  doc.fillColor("#1E40AF").font("Helvetica-Bold").fontSize(16).text(dataCompany.name, 40, top);
  doc.fillColor("#1E40AF").font("Helvetica-Bold").fontSize(20).text("INSPECTION REPORT", 0, top, { align: "right" });
  // small meta line under header
  doc.fillColor("#6B7280").font("Helvetica-Oblique").fontSize(9);
  doc.text("", 40, top + 20); // spacing
  return top + 36; // return Y after header
}

/**
 * Draw the checks table header at given Y, returns headerHeight.
 */
function drawChecksTableHeader(doc: typeof PDFDocument, tableX: number, topY: number, tableWidth: number) {
  const headerHeight = 28;
  doc.rect(tableX, topY, tableWidth, headerHeight).fill("#F3F4F6");
  doc.fillColor("#1E40AF").font("Helvetica-Bold").fontSize(11);
  doc.text("Feature", tableX + 10, topY + 8);
  doc.text("Condition", tableX + 160, topY + 8);
  doc.text("Remarks", tableX + 310, topY + 8);
  doc.text("Needs Action", tableX + 430, topY + 8);
  // vertical separators for header
  doc.strokeColor("#E5E7EB").lineWidth(0.5);
  doc.moveTo(tableX + 150, topY).lineTo(tableX + 150, topY + headerHeight).stroke();
  doc.moveTo(tableX + 300, topY).lineTo(tableX + 300, topY + headerHeight).stroke();
  doc.moveTo(tableX + 420, topY).lineTo(tableX + 420, topY + headerHeight).stroke();
  // reset fill for text
  doc.fillColor("#111827").font("Helvetica").fontSize(10);
  return headerHeight;
}

export async function generateInspectionReportPDF(data: InspectionReportData): Promise<Buffer> {
  validateData(data);
  // destructure and fill defaults
  const {
    reference,
    company = { name: COMPANY_NAME, address: COMPANY_ADDRESS, email: COMPANY_EMAIL, phone: COMPANY_PHONE },
    vehicle,
    customer,
    reportDate,
    preparedBy,
    plan,
    checks,
    overallReport,
  } = data;

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const buffers: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => buffers.push(chunk));
  const promise = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));
  });

  // Initial page header
  let y = drawPageHeader(doc, company);

  // Company address block (left) and meta (right)
  doc.fillColor("#6B7280").font("Helvetica-Oblique").fontSize(9);
  const leftColX = 40;
  doc.text(company.address || "", leftColX, y);
  if (company.email) doc.text(company.email, leftColX, y + 12);
  if (company.phone) doc.text(company.phone, leftColX, y + 24);

  doc.fillColor("#6B7280").font("Helvetica-Oblique").fontSize(10);
  doc.text(`Ref #: ${reference || "-"}`, 0, y, { align: "right" });
  doc.text(`Date: ${reportDate || "-"}`, 0, y + 12, { align: "right" });

  // Move Y down before vehicle details
  y += 48;

  // Vehicle Info
  doc.fillColor("#111827").font("Helvetica-Bold").fontSize(12).text("Vehicle Details", leftColX, y);
  y += 18;
  doc.font("Helvetica").fontSize(11).fillColor("#111827");
  doc.text(`Reg No: ${vehicle.regNo}`, leftColX, y);
  y += 12; doc.text(`Model: ${vehicle.model}`, leftColX, y);
  y += 12; doc.text(`Brand: ${vehicle.brand}`, leftColX, y);
  y += 12; doc.text(`Owner: ${vehicle.ownerName}`, leftColX, y);

  // Customer & Prepared By side by side
  y += 20;
  const startY = y;
  let leftY = startY;
  let rightY = startY;

  // Left: Customer Details
  doc.fillColor("#111827").font("Helvetica-Bold").fontSize(12).text("Customer Details", leftColX, leftY);
  leftY += 18;
  doc.font("Helvetica").fontSize(11);
  doc.fillColor("#111827");
  doc.text(customer.name, leftColX, leftY, { width: 240 });
  leftY += 12;
  if (customer.email) { doc.text(customer.email, leftColX, leftY, { width: 240 }); leftY += 12; }
  if (customer.mobile) { doc.text(customer.mobile, leftColX, leftY, { width: 240 }); leftY += 12; }

  // Right: Prepared By
  const rightColX = 300;
  doc.fillColor("#111827").font("Helvetica-Bold").fontSize(12).text("Prepared By", rightColX, rightY);
  rightY += 18;
  doc.font("Helvetica").fontSize(11);
  doc.text(preparedBy.mechanicName, rightColX, rightY, { width: 240 }); rightY += 12;
  doc.text(preparedBy.email, rightColX, rightY, { width: 240 }); rightY += 12;
  doc.text(preparedBy.address, rightColX, rightY, { width: 240 }); rightY += 12;

  y = Math.max(leftY, rightY) + 16;

  // Plan Details
  doc.fillColor("#111827").font("Helvetica-Bold").fontSize(12).text("Plan Details", leftColX, y);
  y += 18;
  doc.font("Helvetica").fontSize(11);
  doc.fillColor("#111827");
  doc.text(plan.name, leftColX, y);
  y += 12;
  const descHeight = doc.heightOfString(plan.description, { width: 515 });
  doc.text(plan.description, leftColX, y, { width: 515 });
  y += descHeight + 12;
  doc.text(`Price: INR ${plan.price.toFixed(2)}`, leftColX, y);
  y += 20;

  // Checks table — set table geometry
  const tableX = 40;
  const tableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right; // ~515
  let tableTop = y;
  const headerHeight = drawChecksTableHeader(doc, tableX, tableTop, tableWidth);
  y = tableTop + headerHeight;

  // Constants for page bottom limit (reserve for footer)
  const bottomLimit = doc.page.height - doc.page.margins.bottom - 80;

  // Render each check with pagination
  doc.fillColor("#111827").font("Helvetica").fontSize(10);
  for (let i = 0; i < checks.length; i++) {
    const check = checks[i];

    // compute required row height (padding included)
    const featureHeight = doc.heightOfString(check.feature, { width: 140 });
    const conditionHeight = doc.heightOfString(check.condition, { width: 140 });
    const remarksHeight = doc.heightOfString(check.remarks || "-", { width: 110 });
    const computedRowHeight = Math.max(featureHeight, conditionHeight, remarksHeight, 12) + 12;

    // if it won't fit on current page, create new page and redraw header
    if (y + computedRowHeight > bottomLimit) {
      doc.addPage();
      y = drawPageHeader(doc, company);
      // small spacing after header
      y += 20;
      tableTop = y;
      const headerH = drawChecksTableHeader(doc, tableTop, tableTop, tableWidth); // draw header on new page
      y = tableTop + headerH;
    }

    // alternate row background
    if (i % 2 === 1) {
      doc.rect(tableX, y, tableWidth, computedRowHeight).fill("#F9FAFB");
      // reset text color after fill
      doc.fillColor("#111827");
    }

    // thin row top line
    doc.strokeColor("#E5E7EB").lineWidth(0.5);
    doc.moveTo(tableX, y).lineTo(tableX + tableWidth, y).stroke();

    // draw text columns
    doc.fillColor("#111827").font("Helvetica").fontSize(10);
    doc.text(check.feature, tableX + 10, y + 6, { width: 140 });
    doc.text(check.condition, tableX + 160, y + 6, { width: 140 });
    doc.text(check.remarks || "-", tableX + 310, y + 6, { width: 110 });
    doc.text(check.needsAction ? "Yes" : "No", tableX + 430, y + 6);

    // draw vertical separators for this row (segments)
    doc.strokeColor("#E5E7EB").lineWidth(0.5);
    doc.moveTo(tableX + 150, y).lineTo(tableX + 150, y + computedRowHeight).stroke();
    doc.moveTo(tableX + 300, y).lineTo(tableX + 300, y + computedRowHeight).stroke();
    doc.moveTo(tableX + 420, y).lineTo(tableX + 420, y + computedRowHeight).stroke();
    doc.moveTo(tableX + tableWidth, y).lineTo(tableX + tableWidth, y + computedRowHeight).stroke();

    // advance Y
    y += computedRowHeight;
  }

  // bottom line after table
  doc.moveTo(tableX, y).lineTo(tableX + tableWidth, y).stroke();

  // Overall Report — ensure room and pagination
  y += 20;
  if (y + 120 > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
    y = drawPageHeader(doc, company) + 20;
  }

  doc.fillColor("#111827").font("Helvetica-Bold").fontSize(12).text("Overall Report", tableX, y);
  y += 14;
  doc.fillColor("#6B7280").font("Helvetica-Oblique").fontSize(10);
  const reportHeight2 = doc.heightOfString(overallReport, { width: tableWidth });
  doc.text(overallReport, tableX, y, { width: tableWidth });
  y += reportHeight2 + 20;

  // Signature
  doc.fillColor("#111827").font("Helvetica").fontSize(11).text("Authorised by Autofit", tableX, y);
  doc.moveTo(tableX, y + 20).lineTo(tableX + 160, y + 20).stroke();

  // Footer (place at bottom of page if space, otherwise new page)
  if (y + 80 > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
    y = doc.page.margins.top;
  } else {
    y = doc.page.height - doc.page.margins.bottom - 40;
  }
  doc.rect(tableX, y, tableWidth, 30).fill("#F3F4F6");
  doc.fillColor("#1E40AF").font("Helvetica-Oblique").fontSize(10).text("Thank you for choosing us!", 0, y + 10, { align: "center" });

  doc.end();
  return promise;
}
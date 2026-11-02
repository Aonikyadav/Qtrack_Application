import { jsPDF } from "jspdf"
import type { ConsultationRecord } from "../types"

export function generatePrescriptionPdf(record: ConsultationRecord): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Primary colors
  const tealDark = [17, 94, 89] as const // #115e59
  const tealPrimary = [13, 148, 136] as const // #0d9488
  const inkDark = [15, 23, 42] as const // #0f172a
  const mutedGray = [100, 116, 139] as const // #64748b
  const lightBg = [248, 250, 252] as const // #f8fafc

  // Border top header bar
  doc.setFillColor(...tealDark)
  doc.rect(0, 0, pageWidth, 7, "F")

  // Clinic Header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.setTextColor(...tealDark)
  doc.text("AAROGYA FAMILY CLINIC", 16, 18)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(...mutedGray)
  doc.text("NABH Accredited Multi-Speciality Primary Care Centre", 16, 23)
  doc.text("42, Medical Enclave, Civil Lines · Helpline: +91 80 4912 3456 · care@aarogya.in", 16, 28)

  // Header Right: Prescription Badge
  doc.setFillColor(240, 253, 250)
  doc.roundedRect(pageWidth - 62, 12, 46, 18, 3, 3, "F")
  doc.setDrawColor(204, 251, 241)
  doc.roundedRect(pageWidth - 62, 12, 46, 18, 3, 3, "S")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(...tealPrimary)
  doc.text("DIGITAL PRESCRIPTION", pageWidth - 59, 18)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(...mutedGray)
  doc.text(`Ref: ${record.tokenId || "RX-8421"}`, pageWidth - 59, 23)
  doc.text(`Date: ${record.date}`, pageWidth - 59, 27)

  // Horizontal Divider Line
  doc.setDrawColor(...tealPrimary)
  doc.setLineWidth(0.8)
  doc.line(16, 33, pageWidth - 16, 33)

  // Patient & Doctor Info Grid
  let y = 40

  // Left Box: Patient Details
  doc.setFillColor(...lightBg)
  doc.roundedRect(16, y, 85, 28, 2, 2, "F")
  doc.setDrawColor(226, 232, 240)
  doc.roundedRect(16, y, 85, 28, 2, 2, "S")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(...tealDark)
  doc.text("PATIENT INFORMATION", 20, y + 6)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(...inkDark)
  doc.text(record.patientName || "Patient", 20, y + 12)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(...mutedGray)
  doc.text(`Patient ID: ${record.patientId || "P-8421"}   Token: ${record.tokenId || "A-012"}`, 20, y + 18)
  doc.text(`Visit Date: ${record.date}  ·  Duration: ${record.durationMinutes || 12} mins`, 20, y + 24)

  // Right Box: Doctor Details
  const rightBoxX = pageWidth - 16 - 85
  doc.setFillColor(...lightBg)
  doc.roundedRect(rightBoxX, y, 85, 28, 2, 2, "F")
  doc.setDrawColor(226, 232, 240)
  doc.roundedRect(rightBoxX, y, 85, 28, 2, 2, "S")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(...tealDark)
  doc.text("ATTENDING CONSULTANT", rightBoxX + 4, y + 6)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(...inkDark)
  doc.text(record.doctorName || "Dr. Meera Nair", rightBoxX + 4, y + 12)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(...mutedGray)
  doc.text("MBBS, MD · General Medicine", rightBoxX + 4, y + 18)
  doc.text("NMC Reg. No: KMC-48291 · Room 2", rightBoxX + 4, y + 24)

  y += 35

  // Diagnosis Section
  doc.setFillColor(254, 242, 242)
  doc.setDrawColor(254, 202, 202)
  doc.roundedRect(16, y, pageWidth - 32, 14, 2, 2, "FD")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(185, 28, 28) // red-700
  doc.text("PROVISIONAL DIAGNOSIS:", 20, y + 6)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10.5)
  doc.setTextColor(...inkDark)
  doc.text(record.diagnosis || "Clinical assessment completed", 70, y + 6)

  y += 20

  // Clinical Notes Section
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9.5)
  doc.setTextColor(...tealDark)
  doc.text("CLINICAL NOTES & OBSERVATIONS", 16, y)

  y += 5
  doc.setFillColor(...lightBg)
  doc.setDrawColor(226, 232, 240)
  doc.roundedRect(16, y, pageWidth - 32, 16, 2, 2, "FD")

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(51, 65, 85)
  const notesText = record.clinicalNotes || "Advised rest, hydration, and steam inhalation. Review if fever recurs."
  doc.text(doc.splitTextToSize(notesText, pageWidth - 40), 20, y + 6)

  y += 24

  // Rx Section Header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.setTextColor(...tealDark)
  doc.text("Rx", 16, y)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9.5)
  doc.setTextColor(...mutedGray)
  doc.text("PRESCRIBED MEDICINES", 26, y)

  y += 4

  // Table Header
  const tableX = 16
  const tableWidth = pageWidth - 32
  doc.setFillColor(...tealDark)
  doc.rect(tableX, y, tableWidth, 8, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.setTextColor(255, 255, 255)
  doc.text("#", tableX + 3, y + 5.5)
  doc.text("Medicine Name", tableX + 12, y + 5.5)
  doc.text("Dosage", tableX + 85, y + 5.5)
  doc.text("Frequency", tableX + 115, y + 5.5)
  doc.text("Duration", tableX + 148, y + 5.5)

  y += 8

  // Prescription Items
  if (record.prescriptions && record.prescriptions.length > 0) {
    record.prescriptions.forEach((item, index) => {
      const isEven = index % 2 === 0
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252)
      doc.rect(tableX, y, tableWidth, 9, "F")
      doc.setDrawColor(226, 232, 240)
      doc.line(tableX, y + 9, tableX + tableWidth, y + 9)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(...inkDark)
      doc.text(String(index + 1), tableX + 4, y + 6)

      doc.setFont("helvetica", "bold")
      doc.text(item.medicine, tableX + 12, y + 6)

      doc.setFont("helvetica", "normal")
      doc.setTextColor(51, 65, 85)
      doc.text(item.dose || "1 tab", tableX + 85, y + 6)
      doc.text(item.frequency || "TDS (Thrice daily)", tableX + 115, y + 6)
      doc.text(item.duration || "3 days", tableX + 148, y + 6)

      y += 9
    })
  } else {
    doc.setFillColor(255, 255, 255)
    doc.rect(tableX, y, tableWidth, 10, "F")
    doc.setFont("helvetica", "italic")
    doc.setFontSize(9)
    doc.setTextColor(...mutedGray)
    doc.text("No pharmacological medications prescribed. Advised symptomatic rest & follow-up.", tableX + 12, y + 6.5)
    y += 10
  }

  y += 10

  // General Instructions Box
  doc.setFillColor(240, 253, 250)
  doc.setDrawColor(204, 251, 241)
  doc.roundedRect(16, y, pageWidth - 32, 20, 2, 2, "FD")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.setTextColor(...tealDark)
  doc.text("GENERAL PATIENT ADVICE & PRECAUTIONS:", 20, y + 6)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(30, 41, 59)
  doc.text("1. Complete full antibiotic/medication dosage as indicated without premature cessation.", 20, y + 11)
  doc.text("2. Drink adequate warm oral fluids; avoid chilled beverages and oily food for 3 days.", 20, y + 15)
  doc.text("3. Emergency warning: Report to hospital casualty immediately if temperature >102°F or breathlessness occurs.", 20, y + 19)

  // Doctor Signature & Verification Seal at bottom
  const bottomY = pageHeight - 38

  doc.setDrawColor(226, 232, 240)
  doc.line(16, bottomY - 4, pageWidth - 16, bottomY - 4)

  // Left footer: QTrack Verification
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.setTextColor(...tealDark)
  doc.text("QTRACK CLINICAL SYSTEM VERIFIED", 16, bottomY + 4)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.5)
  doc.setTextColor(...mutedGray)
  doc.text("Digitally authenticated electronic medical record.", 16, bottomY + 9)
  doc.text(`Unique Prescription Hash: #${record.id.slice(0, 8).toUpperCase()}-${Date.now().toString().slice(-6)}`, 16, bottomY + 13)

  // Right footer: Doctor Signature Box
  const sigX = pageWidth - 65
  doc.setFont("helvetica", "italic")
  doc.setFontSize(10)
  doc.setTextColor(...tealPrimary)
  doc.text("Dr. Meera Nair", sigX, bottomY + 2)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(...inkDark)
  doc.text("Authorized Medical Practitioner", sigX, bottomY + 8)
  doc.setFontSize(7.5)
  doc.setTextColor(...mutedGray)
  doc.text("Aarogya Family Clinic", sigX, bottomY + 12)

  // Bottom Notice
  doc.setFillColor(15, 23, 42)
  doc.rect(0, pageHeight - 6, pageWidth, 6, "F")
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(203, 213, 225)
  doc.text("This computer-generated clinical prescription is recognized under Section 65B of the Indian Evidence Act & Telemedicine Guidelines 2020.", pageWidth / 2, pageHeight - 2, { align: "center" })

  // Trigger real file download
  const cleanPatientName = (record.patientName || "Patient").replace(/[^a-zA-Z0-9]/g, "_")
  const cleanDate = (record.date || "Visit").replace(/[^a-zA-Z0-9]/g, "_")
  doc.save(`Prescription_${cleanPatientName}_${cleanDate}.pdf`)
}

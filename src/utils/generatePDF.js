import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePDF(quizData) {
    const { studentInfo, assessmentName, results, score, totalQuestions, submittedAt } = quizData;
    const percentage = ((score / totalQuestions) * 100).toFixed(1);
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // --- Header ---
    doc.setFillColor(69, 90, 100); // Blue Grey 700 #455a64
    doc.rect(0, 0, pageWidth, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("QuanHack Intern Assessment", margin, 16);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Assessment Result Report", margin, 24);

    const submittedDate = new Date(submittedAt);
    doc.text(
        `Generated: ${submittedDate.toLocaleDateString()} at ${submittedDate.toLocaleTimeString()}`,
        margin,
        31
    );

    // --- Student Info ---
    let yPos = 45;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Student Details", margin, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${studentInfo.name}`, margin, yPos);
    yPos += 6;
    doc.text(`Email: ${studentInfo.email}`, margin, yPos);
    yPos += 6;
    doc.text(`College: ${studentInfo.collegeName}`, margin, yPos);
    yPos += 6;
    doc.text(`College ID: ${studentInfo.collegeId}`, margin, yPos);
    yPos += 6;
    doc.text(`department/Degree: ${studentInfo.department}`, margin, yPos);
    yPos += 6;
    doc.text(`Assessment Type: ${assessmentName || "N/A"}`, margin, yPos);

    // --- Score Summary ---
    yPos += 12;
    doc.setFillColor(236, 239, 241); // very light blue-grey #eceff1
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 20, 3, 3, "F");

    yPos += 8;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Score: ${score} / ${totalQuestions}`, margin + 8, yPos);

    doc.setFontSize(14);
    const percentText = `${percentage}%`;
    const percentWidth = doc.getTextWidth(percentText);
    doc.text(
        percentText,
        pageWidth - margin - 8 - percentWidth,
        yPos
    );

    yPos += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const gradeText =
        percentage >= 80
            ? "Excellent"
            : percentage >= 60
                ? "Good"
                : percentage >= 40
                    ? "Average"
                    : "Needs Improvement";

    if (percentage >= 80) doc.setTextColor(46, 125, 50);
    else if (percentage >= 60) doc.setTextColor(237, 108, 2);
    else if (percentage >= 40) doc.setTextColor(237, 108, 2);
    else doc.setTextColor(211, 47, 47);

    doc.text(gradeText, margin + 8, yPos);
    doc.setTextColor(0, 0, 0);

    // --- Question Breakdown Table ---
    yPos += 14;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Question-by-Question Breakdown", margin, yPos);
    yPos += 4;

    const tableData = results.map((r, index) => {
        const studentAnswerText =
            r.studentAnswer.length > 0
                ? r.studentAnswer.map((i) => r.options[i]).join(", ")
                : "Not answered";
        const correctAnswerText = r.correctAnswers
            .map((i) => r.options[i])
            .join(", ");

        return [
            `Q${index + 1}`,
            r.question.length > 60 ? r.question.substring(0, 57) + "..." : r.question,
            studentAnswerText.length > 30
                ? studentAnswerText.substring(0, 27) + "..."
                : studentAnswerText,
            correctAnswerText.length > 30
                ? correctAnswerText.substring(0, 27) + "..."
                : correctAnswerText,
            r.isCorrect ? "✓" : "✗",
        ];
    });

    autoTable(doc, {
        startY: yPos,
        head: [["#", "Question", "Your Answer", "Correct Answer", ""]],
        body: tableData,
        margin: { left: margin, right: margin },
        styles: {
            fontSize: 8,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [69, 90, 100],
            textColor: [255, 255, 255],
            fontStyle: "bold",
        },
        columnStyles: {
            0: { cellWidth: 12, halign: "center" },
            1: { cellWidth: 65 },
            2: { cellWidth: 40 },
            3: { cellWidth: 40 },
            4: { cellWidth: 12, halign: "center", fontStyle: "bold" },
        },
        didParseCell: (data) => {
            if (data.section === "body" && data.column.index === 4) {
                if (data.cell.raw === "✓") {
                    data.cell.styles.textColor = [46, 125, 50];
                } else {
                    data.cell.styles.textColor = [211, 47, 47];
                }
            }
        },
        didDrawPage: (data) => {
            // Footer on each page
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                "QuanHack Intern Assessment — Confidential",
                margin,
                pageHeight - 10
            );
            doc.text(
                `Page ${doc.internal.getNumberOfPages()}`,
                pageWidth - margin - 15,
                pageHeight - 10
            );
        },
    });

    // --- Return or Save ---
    if (quizData.returnOutput) {
        return doc.output("arraybuffer");
    }

    const fileName = `QuanHack_Assessment_${studentInfo.name.replace(/\s+/g, "_")}_${studentInfo.collegeName.replace(/\s+/g, "_")}.pdf`;
    doc.save(fileName);
}

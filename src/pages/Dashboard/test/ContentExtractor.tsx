import React, { useState, useCallback } from "react";
import FileUpload from "../../../components/ui/FileUpload";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;
import mammoth from "mammoth";

interface ContentExtractionProps {
  onContentExtracted: (content: string) => void;
}

const ContentExtractor: React.FC<ContentExtractionProps> = ({
  onContentExtracted,
}) => {
  const handleFilesChange = useCallback(
    async (files: File[]) => {
      if (files && files.length > 0) {
        const file = files[0];
        const fileExtension = file.name.split(".").pop()?.toLowerCase();

        if (["pdf", "doc", "docx"].includes(fileExtension || "")) {
          try {
            const extractedContent = await extractFileContent(file);
            onContentExtracted(extractedContent);
            console.log("Extracted Content:", extractedContent);
          } catch (error) {
            console.error("Error extracting file content:", error);
            alert("Failed to extract content from the file.");
          }
        } else if (
          ["jpg", "jpeg", "png", "gif"].includes(fileExtension || "")
        ) {
          alert("Image files are selected. No text extraction performed.");
        } else {
          alert(
            "Only PDF, DOC/DOCX, and image files (JPG, JPEG, PNG, GIF) are accepted."
          );
        }
      }
    },
    [onContentExtracted]
  );

  const extractTextFromPDF = useCallback(
    async (file: File): Promise<string> => {
      const fileReader = new FileReader();
      return new Promise((resolve, reject) => {
        fileReader.onload = async function () {
          const typedarray = new Uint8Array(this.result as ArrayBuffer);
          try {
            const pdf = await pdfjsLib.getDocument({ data: typedarray })
              .promise;
            let extractedText = "";
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
              const page = await pdf.getPage(pageNum);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item: any) => item.str)
                .join(" ");
              extractedText += pageText + "\n";
            }
            resolve(extractedText);
          } catch (error) {
            reject(error);
          }
        };
        fileReader.onerror = function (error) {
          reject(error);
        };
        fileReader.readAsArrayBuffer(file);
      });
    },
    []
  );

  const extractTextFromDoc = useCallback(
    async (file: File): Promise<string> => {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    },
    []
  );

  const extractFileContent = useCallback(
    async (file: File): Promise<string> => {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (fileExtension === "pdf") {
        return await extractTextFromPDF(file);
      } else if (fileExtension === "doc" || fileExtension === "docx") {
        return await extractTextFromDoc(file);
      } else {
        return "";
      }
    },
    [extractTextFromPDF, extractTextFromDoc]
  );

  return (
    <FileUpload
      onFilesChange={handleFilesChange}
      multiple={false}
      maxFiles={1}
      onlyDocuments
    />
  );
};

export default ContentExtractor;

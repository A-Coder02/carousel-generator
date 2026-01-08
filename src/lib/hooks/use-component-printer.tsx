import React from "react";
import { useReactToPrint } from "react-to-print";
import { SIZE } from "@/lib/page-size";
import { useFieldArrayValues } from "@/lib/hooks/use-field-array-values";
import { useFormContext } from "react-hook-form";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { toCanvas } from "html-to-image";
import { Options as HtmlToImageOptions } from "html-to-image/lib/types";
import { jsPDF, jsPDFOptions } from "jspdf";

// TODO: Create a reusable component and package with this code

type HtmlToPdfOptions = {
  margin: [number, number, number, number];
  filename: string;
  image: { type: string; quality: number };
  htmlToImage: HtmlToImageOptions;
  jsPDF: jsPDFOptions;
};

// Convert units to px using the conversion value 'k' from jsPDF.
export const toPx = function toPx(val: number, k: number) {
  return Math.floor(((val * k) / 72) * 96);
};

function getPdfPageSize(opt: HtmlToPdfOptions) {
  // Retrieve page-size based on jsPDF settings, if not explicitly provided.
  // @ts-expect-error function not explicitly exported
  const pageSize = jsPDF.getPageSize(opt.jsPDF);

  // Add 'inner' field if not present.
  if (!Object.prototype.hasOwnProperty.call(pageSize, "inner")) {
    pageSize.inner = {
      width: pageSize.width - opt.margin[1] - opt.margin[3],
      height: pageSize.height - opt.margin[0] - opt.margin[2],
    };
    pageSize.inner.px = {
      width: toPx(pageSize.inner.width, pageSize.k),
      height: toPx(pageSize.inner.height, pageSize.k),
    };
    pageSize.inner.ratio = pageSize.inner.height / pageSize.inner.width;
  }

  // Attach pageSize to this.
  return pageSize;
}

function canvasToPdf(canvas: HTMLCanvasElement, opt: HtmlToPdfOptions) {
  const pdfPageSize = getPdfPageSize(opt);

  // Calculate the number of pages.
  const pxFullHeight = canvas.height;
  const pxPageHeight = Math.floor(canvas.width * pdfPageSize.inner.ratio);
  const nPages = Math.ceil(pxFullHeight / pxPageHeight);

  // Define pageHeight separately so it can be trimmed on the final page.
  let pageHeight = pdfPageSize.inner.height;

  // Create a one-page canvas to split up the full image.
  const pageCanvas = document.createElement("canvas");
  const pageCtx = pageCanvas.getContext("2d");
  if (!pageCtx) {
    throw Error("Canvas context of created element not found");
  }
  pageCanvas.width = canvas.width;
  pageCanvas.height = pxPageHeight;

  // Initialize the PDF.
  const pdf = new jsPDF(opt.jsPDF);

  for (let page = 0; page < nPages; page++) {
    // Trim the final page to reduce file size.
    if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
      pageCanvas.height = pxFullHeight % pxPageHeight;
      pageHeight =
        (pageCanvas.height * pdfPageSize.inner.width) / pageCanvas.width;
    }

    // Display the page.
    const w = pageCanvas.width;
    const h = pageCanvas.height;

    pageCtx.fillStyle = "white";
    pageCtx.fillRect(0, 0, w, h);
    pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

    // Add the page to the PDF.
    if (page) pdf.addPage();
    const imgData = pageCanvas.toDataURL(
      "image/" + opt.image.type,
      opt.image.quality
    );
    pdf.addImage(
      imgData,
      opt.image.type,
      opt.margin[1],
      opt.margin[0],
      pdfPageSize.inner.width,
      pageHeight
    );
  }
  return pdf;
}

export function useComponentPrinter() {
  const { numPages } = useFieldArrayValues("slides");
  const { watch }: DocumentFormReturn = useFormContext();

  const [isPrinting, setIsPrinting] = React.useState(false);
  // TODO: Show animation on loading
  const componentRef = React.useRef(null);

  // Packages and references
  // react-to-print: https://github.com/gregnb/react-to-print
  // html-to-image: https://github.com/bubkoo/html-to-image
  // jsPDF: https://rawgit.com/MrRio/jsPDF/master/docs/jsPDF.html

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onBeforePrint: async () => setIsPrinting(true),
    pageStyle: `@page { size: ${SIZE.width}px ${SIZE.height}px;  margin: 0; } @media print { body { -webkit-print-color-adjust: exact; }}`,
    print: async (printIframe) => {
      const contentDocument = printIframe.contentDocument;
      if (!contentDocument) {
        console.error("iFrame does not have a document content");
        return;
      }

      const html = contentDocument.getElementById("element-to-download-as-pdf");
      if (!html) {
        console.error("Couldn't find element to convert to PDF");
        return;
      }

      const SCALE_TO_LINKEDIN_INTRINSIC_SIZE = 1.8;
      // const fontEmbedCss = await getFontEmbedCSS(html);
      const options: HtmlToPdfOptions = {
        margin: [0, 0, 0, 0],
        filename: watch("filename"),
        image: { type: "webp", quality: 0.98 },
        htmlToImage: {
          height: SIZE.height * numPages,
          width: SIZE.width,
          canvasHeight:
            SIZE.height * numPages * SCALE_TO_LINKEDIN_INTRINSIC_SIZE,
          canvasWidth: SIZE.width * SCALE_TO_LINKEDIN_INTRINSIC_SIZE,
        },
        jsPDF: { unit: "px", format: [SIZE.width, SIZE.height] },
      };

      // TODO Create buttons to download as png / svg / etc from 'html-to-image'
      const canvas = await toCanvas(html, options.htmlToImage).catch((err) => {
        console.error(err);
      });
      if (!canvas) {
        console.error("Failed to create canvas");
        return;
      }
      // DEBUG:
      // document.body.appendChild(canvas);
      const pdf = canvasToPdf(canvas, options);
      pdf.save(options.filename);
    },
  });

  return {
    componentRef,
    handlePrint,
    isPrinting,
  };
}

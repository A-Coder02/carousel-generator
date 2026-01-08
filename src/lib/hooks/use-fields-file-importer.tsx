import { DocumentFormReturn } from "@/lib/document-form-types";
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { ConfigSchema } from "@/lib/validation/document-schema";
import { MultiSlideSchema } from "@/lib/validation/slide-schema";

export function useFieldsFileImporter(field: "config" | "slides") {
  const { setValue }: DocumentFormReturn = useFormContext(); // retrieve those props
  const fileReaderRef = useRef<FileReader | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = function (e: ProgressEvent) {
      if (!e.target) {
        console.error("Failed to load file input");
        return;
      }

      // @ts-expect-error file has result
      const result = JSON.parse(e.target.result);
      // Validate input and add to form
      if (field == "config") {
        const parsedValues = ConfigSchema.parse(result);
        if (parsedValues) {
          setValue(field, parsedValues);
        }
      } else if (field == "slides") {
        const parsedValues = MultiSlideSchema.parse(result);

        if (parsedValues) {
          console.log({ parsedValues });
          setValue(field, parsedValues);
        }
      } else {
        console.error("field provided is incorrect");
      }
    };
    fileReaderRef.current = reader;
  }, [field, setValue]);

  const handleFileSubmission = (files: FileList) => {
    if (files && files.length > 0) {
      if (fileReaderRef.current) {
        fileReaderRef.current.readAsText(files[0]);
      }
    }

    // setOpen(false);
  };
  return { handleFileSubmission };
}

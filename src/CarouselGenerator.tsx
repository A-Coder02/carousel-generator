import Editor from "@/components/editor";
import { DocumentProvider } from "@/lib/providers/document-provider";

import "./App.css";
import "./index.css";

function CarouselGenerator() {
  return (
    <main className="flex-1 h-full min-h-full flex flex-col justify-stretch">
      <DocumentProvider>
        <Editor />
      </DocumentProvider>
    </main>
  );
}

export { CarouselGenerator };

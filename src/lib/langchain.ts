import { z } from "zod";
import { MultiSlideSchema } from "@/lib/validation/slide-schema";

// API Response type
interface CarouselAPIResponse {
  data: {
    slide_count: number;
    hook_type: string;
    slides: Array<{
      slide_number: number;
      slide_purpose: string;
      headline: string;
      body_copy: string;
      word_count: number;
      breadcrumb_text?: string;
    }>;
  };
}

/**
 * Transforms API response to match our MultiSlideSchema format
 */
function transformAPIResponseToSlides(apiResponse: CarouselAPIResponse) {
  return apiResponse.data.slides.map((slide) => {
    const elements = [];

    // Add headline as Title
    if (slide.headline) {
      elements.push({
        type: "Title" as const,
        text: slide.headline,
      });
    }

    // Add breadcrumb as Subtitle (if available)
    if (slide.breadcrumb_text) {
      elements.push({
        type: "Subtitle" as const,
        text: slide.breadcrumb_text,
      });
    }

    // Add body_copy as Description
    // Replace pipe separators with line breaks
    if (slide.body_copy) {
      const formattedBody = slide.body_copy.replace(/\|/g, "\n");
      elements.push({
        type: "Description" as const,
        text: formattedBody,
      });
    }

    return {
      elements,
    };
  });
}

export async function generateCarouselSlides(
  topicPrompt: string
): Promise<z.infer<typeof MultiSlideSchema> | null> {
  try {
    console.log("Generating carousel slides for:", topicPrompt);
    const response = await fetch("URL_HERE", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: topicPrompt,
      }),
    });
    console.log("API response:", response);

    if (!response.ok) {
      console.error(
        "API request failed:",
        response.status,
        response.statusText
      );
      return null;
    }

    const apiResponse: CarouselAPIResponse = await response.json();

    // Transform API response to our schema
    const transformedSlides = transformAPIResponseToSlides(apiResponse);

    // Validate against our schema
    const parseResult = MultiSlideSchema.safeParse(transformedSlides);

    if (parseResult.success) {
      return parseResult.data;
    } else {
      console.error("Schema validation failed:", parseResult.error);
      console.log("Transformed data:", transformedSlides);
      return null;
    }
  } catch (error) {
    console.error("Error generating carousel slides:", error);
    return null;
  }
}

"use server";
import { generateCarouselSlides } from "@/lib/langchain";
// import { headers } from "next/headers";

export async function generateCarouselSlidesAction(userPrompt: string) {
  // Optional rate limit to avoid abuse when using the server action
  // if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  //   const ip = headers().get("x-real-ip") ?? "local";
  //   const rl = await messageRateLimit.limit(ip);

  //   if (!rl.success) {
  //     // Rate limit exceeded
  //     return null;
  //   }
  // }

  try {
    const generatedSlides = await generateCarouselSlides(userPrompt);
    return generatedSlides;
  } catch (error) {
    console.error("Error in generateCarouselSlidesAction:", error);
    return null;
  }
}

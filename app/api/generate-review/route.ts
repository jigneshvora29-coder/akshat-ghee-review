import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface GenerateReviewRequest {
  stars: number;
  tags: string[];
  productType?: string;
  packagingType?: string;
  brandName?: string;
}

function getFallbackReview(
  stars: number,
  tags: string[],
  productType: string = "cow",
  packagingType: string = "pouch",
  brandName: string = "Akshat Ghee"
): string {
  const isBuffalo = productType === "buffalo";
  const isBoth = productType === "both";
  const isPouch = packagingType === "pouch";
  const isGlass = packagingType === "glass-jar";

  const productName = isBuffalo
    ? "pure buffalo ghee"
    : isBoth
    ? "cow and buffalo ghee"
    : "desi cow ghee";

  const packDesc = isPouch
    ? "pouch pack"
    : isGlass
    ? "glass jar"
    : "plastic jar";

  const hasAroma = tags.some((t) => /aroma|khushbu/i.test(t));
  const hasDanedar = tags.some((t) => /danedar|texture/i.test(t));
  const hasCooking = tags.some((t) => /paratha|dal|halwa|sweets/i.test(t));
  const hasValue = tags.some((t) => /value|money|pouch/i.test(t));

  if (stars >= 4) {
    if (isBuffalo) {
      if (hasCooking) {
        return `We ordered the Akshat buffalo ghee in ${packDesc} and used it for daily parathas and sweets. It is rich, thick, and has a strong natural aroma without any artificial aftertaste. Definitely worth buying.`;
      }
      return `The white buffalo ghee from Akshat Ghee is genuinely rich and has proper danedar grains. It melts nicely over hot dal and rice. Very happy with the quality and honesty of the product.`;
    }

    if (isPouch || hasValue) {
      return `Ordered the refill pouch of ${brandName}. The pouch arrived securely sealed with zero leakage, and the ghee inside is fresh with a nice granular texture. Good value for everyday family cooking.`;
    }

    if (isGlass) {
      return `The glass jar arrived very securely packed. ${brandName} ${productName} has an authentic aroma and rich granular texture. Real homemade taste that makes a big difference in daily meals.`;
    }

    if (hasDanedar && hasAroma) {
      return `The aroma and danedar texture of ${brandName} ${productName} are truly authentic. You can immediately tell it is pure without any blending. Adds great flavor to parathas and dal.`;
    }

    return `Very satisfied with ${brandName} ${productName}. The ${packDesc} was sealed well and the taste feels clean and homemade. Will definitely be ordering regularly.`;
  } else {
    // 1-3 stars
    if (isPouch) {
      return `The pouch pack was slightly messy to pour into our kitchen container. The ghee taste is decent, but packaging handling could be improved.`;
    }
    return `The ghee was decent for daily use, but the aroma was slightly milder than what we expected from fresh churned ghee. Hope future batches have stronger flavor.`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateReviewRequest = await req.json();
    const {
      stars,
      tags = [],
      productType = "cow",
      packagingType = "pouch",
      brandName = "Akshat Ghee",
    } = body;

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    const productName =
      productType === "buffalo"
        ? "Pure Buffalo Ghee"
        : productType === "both"
        ? "Desi Cow & Buffalo Ghee"
        : "Desi A2 Cow Ghee";

    const packName =
      packagingType === "pouch"
        ? "Pouch"
        : packagingType === "glass-jar"
        ? "Glass Jar"
        : "Plastic Jar";

    // If no API key configured, use our tailored natural template
    if (!apiKey || apiKey === "your_gemini_api_key") {
      const fallback = getFallbackReview(
        stars,
        tags,
        productType,
        packagingType,
        brandName
      );
      return NextResponse.json({ review: fallback, source: "template" });
    }

    // Strict prompt to Gemini: human-written, NO em-dash, NO emojis, NO robotic marketing
    const prompt = `You are an everyday customer in India writing a genuine Google Maps review for ${brandName} (${productName}, purchased in a ${packName}).
Customer rating: ${stars} out of 5 stars.
Details noted by the customer: ${
      tags.length > 0 ? tags.join(", ") : "daily cooking quality and clean taste"
    }.

MANDATORY RULES:
1. Write 2 to 3 short, natural sentences as if typed on a mobile phone keyboard.
2. NEVER use em-dashes (—) or en-dashes (–). Use ordinary commas or periods only.
3. NEVER use any emojis or smileys.
4. NEVER use flowery words or marketing clichés like "liquid gold", "culinary delight", "game changer", "testament to purity", "elevates every dish", or "sacred".
5. Use grounded, human terms like "danedar texture", "paratha", "dal", "sealed well", "good aroma", "family liked it".
6. Return ONLY the plain text of the review. No quotation marks around it.`;

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const generatedText = response.text?.trim();

      if (generatedText && generatedText.length > 15) {
        // Strict post-processing to clean any LLM artifacts
        const cleanedText = generatedText
          .replace(/^["'«“]+/, "")
          .replace(/["'»”]+$/, "")
          .replace(/[\u2014\u2013]/g, ", ") // Strip em-dash and en-dash
          .replace(/\s*,\s*,+/g, ",")
          // Remove any emojis
          .replace(
            /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu,
            ""
          )
          .trim();

        return NextResponse.json({
          review: cleanedText,
          source: "gemini_ai",
        });
      }
    } catch (geminiError) {
      console.warn("Gemini API call error, using fallback:", geminiError);
    }

    const fallback = getFallbackReview(
      stars,
      tags,
      productType,
      packagingType,
      brandName
    );
    return NextResponse.json({ review: fallback, source: "fallback" });
  } catch (err: unknown) {
    console.error("API error in generate-review:", err);
    return NextResponse.json(
      {
        review:
          "The aroma and danedar texture of Akshat Ghee are genuinely good. Feels pure and clean for everyday home cooking.",
      },
      { status: 500 }
    );
  }
}

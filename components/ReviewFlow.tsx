"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Copy, ExternalLink, RotateCcw, Check } from "lucide-react";
import { StarRating } from "./StarRating";
import { TagSelector } from "./TagSelector";
import { ProductSelector } from "./ProductSelector";

interface ReviewFlowProps {
  brandName?: string;
  googlePlaceId?: string;
  directGoogleReviewUrl?: string;
}

export const ReviewFlow: React.FC<ReviewFlowProps> = ({
  brandName = "Akshat Ghee",
  googlePlaceId = "",
  directGoogleReviewUrl = "",
}) => {
  const [rating, setRating] = useState<number>(5);
  const [productType, setProductType] = useState<string>("cow");
  const [packagingType, setPackagingType] = useState<string>("pouch");
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Rich Danedar Texture",
    "Authentic Desi Khushbu",
    "Great for Parathas & Roti",
  ]);
  const [reviewText, setReviewText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Computed Google Review target URL (supports direct link or placeid)
  const googleReviewUrl =
    directGoogleReviewUrl?.trim() ||
    (googlePlaceId?.trim()
      ? `https://search.google.com/local/writereview?placeid=${googlePlaceId.trim()}`
      : `https://www.google.com/search?q=${encodeURIComponent(
          `${brandName} reviews`
        )}`);

  // Handle star rating click
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  // Handle tag toggle
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // AI Review generation
  const handleGenerateReview = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: rating,
          tags: selectedTags,
          productType,
          packagingType,
          brandName,
        }),
      });

      const data = await res.json();
      if (data?.review) {
        setReviewText(data.review);
        setHasGeneratedOnce(true);
      }
    } catch (err) {
      console.error("Failed to generate review:", err);
      setReviewText(
        `We ordered from ${brandName} and the danedar texture and aroma are genuinely good. Tastes clean and homemade for daily cooking. Very happy with the purchase.`
      );
      setHasGeneratedOnce(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy and redirect to Google
  const handleCopyAndRedirect = async () => {
    const textToCopy =
      reviewText.trim() ||
      `The aroma and danedar texture of ${brandName} are genuinely good. Adds great flavor to parathas and dal. Recommended.`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const el = document.createElement("textarea");
        el.value = textToCopy;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
    } catch (copyErr) {
      console.warn("Clipboard copy fallback:", copyErr);
    }

    // Trigger subtle celebration only for 4-5 stars
    if (rating >= 4) {
      try {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.8 },
          colors: ["#af4930", "#f3d5cd", "#d97706", "#ffffff"],
        });
      } catch {
        // ignore
      }
    }

    // Show floating toast
    setCopiedToast(true);

    // Open Google Review window after short micro-delay
    setTimeout(() => {
      window.open(googleReviewUrl, "_blank", "noopener,noreferrer");
    }, 400);

    setTimeout(() => {
      setCopiedToast(false);
    }, 4000);
  };

  const charCount = reviewText.length;
  const wordCount = reviewText.trim() ? reviewText.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full space-y-4 relative">
      {/* Floating Success Toast */}
      {copiedToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm animate-toast-enter">
          <div className="bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-700 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#af4930] text-white flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex-1 text-xs font-medium">
              <p className="font-semibold text-white">Review copied</p>
              <p className="text-stone-300 text-[11px]">
                Paste it on the Google page that just opened.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Review Card */}
      <div className="w-full bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-5">
        {/* Star Rating */}
        <div className="space-y-1 text-center">
          <label className="text-[11px] font-semibold tracking-wider uppercase text-stone-500 block">
            Rate your experience
          </label>
          <div className="pt-1">
            <StarRating rating={rating} onRatingChange={handleRatingChange} />
          </div>
        </div>

        {/* Product & Packaging Selector (Pouch, Plastic Jar, Glass Jar) */}
        <div className="pt-3 border-t border-stone-100">
          <ProductSelector
            selectedProduct={productType}
            onSelectProduct={setProductType}
            selectedPackaging={packagingType}
            onSelectPackaging={setPackagingType}
            disabled={isGenerating}
          />
        </div>

        {/* Tags Selector */}
        <div className="pt-3 border-t border-stone-100">
          <TagSelector
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            disabled={isGenerating}
          />
        </div>

        {/* Generate / Draft Button */}
        {!hasGeneratedOnce && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerateReview}
              disabled={isGenerating}
              className="w-full min-h-[48px] px-5 py-3 bg-[#af4930] hover:bg-[#913a24] active:scale-[0.98] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all touch-manipulation cursor-pointer disabled:opacity-70"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2 text-white">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Preparing review draft...</span>
                </div>
              ) : (
                <span>Draft My Review</span>
              )}
            </button>
            <p className="text-center text-[11px] text-stone-400 mt-2">
              Creates a quick draft from your choices so you don’t have to type.
            </p>
          </div>
        )}

        {/* Output Card with Editable Textarea & Direct Google CTA */}
        {hasGeneratedOnce && (
          <div className="space-y-3.5 pt-2 border-t border-stone-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                Review Text (Edit as you like)
              </label>
              <button
                type="button"
                onClick={handleGenerateReview}
                disabled={isGenerating}
                className="inline-flex items-center gap-1 text-xs text-[#af4930] hover:text-[#913a24] font-medium px-2 py-1 rounded hover:bg-[#fcf4f2] active:scale-95 transition-all"
              >
                <RotateCcw
                  className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`}
                />
                <span>Try another wording</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Review text will appear here..."
                className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-stone-300 focus:border-[#af4930] focus:ring-1 focus:ring-[#af4930] outline-none transition-all resize-none text-stone-900 placeholder:text-stone-400 bg-stone-50/60 leading-relaxed font-sans"
              />

              {isGenerating && (
                <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-stone-700">
                  <div className="w-4 h-4 border-2 border-[#af4930] border-t-transparent rounded-full animate-spin" />
                  <span>Drafting new version...</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 px-0.5">
              <span>You have full control to edit or add words</span>
              <span>
                {wordCount} words • {charCount} chars
              </span>
            </div>

            {/* Direct Google Post CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCopyAndRedirect}
                className="w-full min-h-[50px] px-5 py-3.5 bg-[#af4930] hover:bg-[#913a24] active:scale-[0.98] text-white font-semibold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#af4930]/20 transition-all touch-manipulation cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy & Open Google Review</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
              </button>

              <p className="text-center text-[11px] text-stone-500 mt-2">
                Copies text to clipboard and opens our Google Maps page to post.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Honest business note */}
      <div className="bg-white rounded-xl p-3.5 border border-stone-200/80 text-center">
        <p className="text-xs text-stone-600 leading-relaxed">
          We are an honest local dairy producer. Whether you loved it or had an issue, your honest review helps us maintain quality and helps other families choose pure ghee.
        </p>
      </div>
    </div>
  );
};

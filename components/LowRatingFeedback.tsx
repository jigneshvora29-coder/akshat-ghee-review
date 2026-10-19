"use client";

import React, { useState } from "react";
import { MessageSquare, HeartHandshake, ExternalLink, Send, CheckCircle2 } from "lucide-react";

interface LowRatingFeedbackProps {
  rating: number;
  brandName: string;
  whatsappNumber: string;
  googleReviewUrl: string;
}

export const LowRatingFeedback: React.FC<LowRatingFeedbackProps> = ({
  rating,
  brandName,
  whatsappNumber,
  googleReviewUrl,
}) => {
  const [feedbackText, setFeedbackText] = useState("");
  const [submittedDirectly, setSubmittedDirectly] = useState(false);

  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "") || "919876543210";

  const handleSendWhatsapp = () => {
    const message = `Hello ${brandName} Support, I rated my recent order ${rating}/5 stars.\nFeedback: ${
      feedbackText.trim() || "I had an issue with my ghee order and would appreciate assistance."
    }`;
    const url = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmitInternal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setSubmittedDirectly(true);
  };

  return (
    <div className="w-full bg-white rounded-2xl p-5 border border-amber-200/90 shadow-lg shadow-amber-950/5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 flex-shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-stone-900 leading-tight">
            We are so sorry we didn’t meet your expectations.
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Your trust is sacred to us. Please give us a chance to make it right!
          </p>
        </div>
      </div>

      {submittedDirectly ? (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center space-y-2 animate-in fade-in duration-200">
          <div className="w-9 h-9 rounded-full bg-amber-500 text-white mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-stone-900">
            Thank you for your valuable feedback
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Our founder and artisan care team have received your notes. We will review batch records and contact you promptly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmitInternal} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
              Tell us what went wrong
            </label>
            <textarea
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Was it the aroma, grain texture, delivery packaging, or something else? Please let us know..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all resize-none text-stone-800 placeholder:text-stone-400 bg-stone-50/50"
            />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {/* WhatsApp direct support button */}
            <button
              type="button"
              onClick={handleSendWhatsapp}
              className="w-full min-h-[48px] px-4 py-3 bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20 transition-all touch-manipulation"
            >
              <MessageSquare className="w-4 h-4" />
              <span>💬 Speak Directly on WhatsApp Support</span>
            </button>

            {/* Internal submission button */}
            {feedbackText.trim() && (
              <button
                type="submit"
                className="w-full min-h-[44px] px-4 py-2.5 bg-stone-800 hover:bg-stone-900 active:scale-[0.98] text-white font-medium text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Private Feedback</span>
              </button>
            )}
          </div>
        </form>
      )}

      {/* Google Review Transparency Compliance */}
      <div className="pt-2 border-t border-stone-100 text-center">
        <a
          href={googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 underline decoration-stone-300 hover:decoration-stone-600 transition-colors py-1 px-2"
        >
          <span>Prefer to leave a public review on Google anyway? Click here</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

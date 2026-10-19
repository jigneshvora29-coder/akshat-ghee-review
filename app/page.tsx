import React from "react";
import Image from "next/image";
import { ReviewFlow } from "@/components/ReviewFlow";

export default function Home() {
  const brandName =
    process.env.NEXT_PUBLIC_BRAND_NAME || "Akshat Ghee";
  const googleReviewUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "";
  const googlePlaceId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || "";

  return (
    <main className="min-h-screen min-h-[100dvh] bg-[#FAF8F5] relative flex flex-col justify-between py-5 px-4 sm:px-6">
      {/* Mobile-first centered container */}
      <div className="max-w-md w-full mx-auto flex flex-col items-center flex-1 space-y-4">
        {/* Brand Header */}
        <header className="w-full flex flex-col items-center text-center space-y-2.5 pt-1">
          {/* Official Akshat Ghee Logo */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white shadow-sm border border-[#f3d5cd] p-1 flex items-center justify-center">
            <Image
              src="/akshat-ghee-logo.jpg"
              alt="Akshat Ghee Logo"
              width={128}
              height={128}
              priority
              className="object-contain w-full h-full"
            />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-normal text-[#af4930] font-display">
              {brandName}
            </h1>
            <p className="text-xs sm:text-sm text-stone-700 font-medium">
              Pure Desi Cow Ghee & Buffalo Ghee
            </p>
            {/* Exactly the 3 packagings: Pouch, Plastic Jar, Glass Jar */}
          </div>

          <div className="pt-0.5 max-w-xs">
            <h2 className="text-sm sm:text-base font-semibold text-stone-900">
              How was your ghee?
            </h2>
            <p className="text-xs text-stone-500">
              Select your options below to draft a quick, honest Google review.
            </p>
          </div>
        </header>

        {/* Interactive Review Flow */}
        <section className="w-full">
          <ReviewFlow
            brandName={brandName}
            googlePlaceId={googlePlaceId}
            directGoogleReviewUrl={googleReviewUrl}
          />
        </section>

        {/* Footer */}
        <footer className="w-full text-center pt-3 pb-2 text-[11px] text-stone-400 space-y-1">
          <p>© 2026 {brandName}. Traditional Preparation.</p>
          <p className="text-[10px] text-stone-400">
            Direct Google review helper for verified customers
          </p>
        </footer>
      </div>
    </main>
  );
}

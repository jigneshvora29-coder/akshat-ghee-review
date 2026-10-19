"use client";

import React from "react";
import { Check } from "lucide-react";

export const AVAILABLE_TAGS = [
  "Rich Danedar Texture",
  "Authentic Desi Khushbu",
  "Pure White Buffalo Ghee",
  "Golden A2 Cow Ghee",
  "Great for Parathas & Roti",
  "Brings Richness to Dal",
  "Perfect for Halwa & Sweets",
  "Fresh Churned Flavor",
  "Leak-Proof Pouch Pack",
  "Sturdy Plastic Jar",
  "Premium Glass Jar",
  "Zero Adulteration Taste",
  "Fast & Clean Delivery",
  "Repeat Family Order",
];

interface TagSelectorProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  disabled?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onToggleTag,
  disabled = false,
}) => {
  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wider text-stone-800 uppercase block">
          Key points you noticed
        </label>
        <span className="text-[11px] font-medium text-[#af4930] bg-[#fcf4f2] px-2 py-0.5 rounded-md border border-[#f3d5cd]">
          {selectedTags.length > 0
            ? `${selectedTags.length} selected`
            : "Tap to select"}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {AVAILABLE_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag);

          return (
            <button
              key={tag}
              type="button"
              disabled={disabled}
              onClick={() => onToggleTag(tag)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 border touch-manipulation select-none active:scale-[0.98] ${
                isSelected
                  ? "bg-[#af4930] text-white border-[#af4930] shadow-sm"
                  : "bg-white hover:bg-[#fcf4f2] text-stone-700 border-stone-200"
              } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span>{tag}</span>
              {isSelected && (
                <Check className="w-3.5 h-3.5 stroke-[2.5] text-amber-200" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

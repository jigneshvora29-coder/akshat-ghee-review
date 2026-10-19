"use client";

import React from "react";

export const PRODUCT_OPTIONS = [
  { id: "cow", label: "Desi Cow Ghee (A2)", subtitle: "Golden & aromatic" },
  { id: "buffalo", label: "Pure Buffalo Ghee", subtitle: "Rich white & danedar" },
  { id: "both", label: "Both", subtitle: "Cow + Buffalo" },
];

export const PACKAGING_OPTIONS = [
  { id: "pouch", label: "Pouch" },
  { id: "plastic-jar", label: "Plastic Jar" },
  { id: "glass-jar", label: "Glass Jar" },
];

interface ProductSelectorProps {
  selectedProduct: string;
  onSelectProduct: (id: string) => void;
  selectedPackaging: string;
  onSelectPackaging: (id: string) => void;
  disabled?: boolean;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedProduct,
  onSelectProduct,
  selectedPackaging,
  onSelectPackaging,
  disabled = false,
}) => {
  return (
    <div className="w-full space-y-3.5">
      {/* Product Type Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider block">
          Which ghee did you buy?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PRODUCT_OPTIONS.map((prod) => {
            const isSelected = selectedProduct === prod.id;
            return (
              <button
                key={prod.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelectProduct(prod.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-150 touch-manipulation active:scale-[0.98] ${
                  isSelected
                    ? "bg-[#af4930] text-white border-[#af4930] shadow-sm"
                    : "bg-white hover:bg-[#fcf4f2] text-stone-700 border-stone-200"
                } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span className="text-xs font-semibold leading-tight">
                  {prod.label}
                </span>
                <span
                  className={`text-[10px] mt-0.5 ${
                    isSelected ? "text-amber-100/90" : "text-stone-400"
                  }`}
                >
                  {prod.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Packaging Selection (Strictly: Pouch, Plastic Jar, Glass Jar) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider block">
          Packaging
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PACKAGING_OPTIONS.map((pack) => {
            const isSelected = selectedPackaging === pack.id;
            return (
              <button
                key={pack.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelectPackaging(pack.id)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all duration-150 touch-manipulation active:scale-[0.98] ${
                  isSelected
                    ? "bg-[#af4930] text-white border-[#af4930] shadow-sm"
                    : "bg-white hover:bg-[#fcf4f2] text-stone-700 border-stone-200"
                } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {pack.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

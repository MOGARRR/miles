const ProductSkeletonCard = () => {
  return (
    <div
      className="
        flex flex-col
        rounded-lg
        border border-[#3a3a41]
        bg-kilodarkgrey
        animate-pulse opacity-70
      "
    >
      {/* IMAGE SKELETON */}
      <div className="pt-3 pb-3 bg-[#3F3F46] rounded-t-lg">
        <div className="relative w-full aspect-[1/1] overflow-hidden">
          <div className="w-full h-full bg-[#52525B]" />
        </div>
      </div>

      {/* CONTENT SKELETON */}
      <div className="flex flex-col py-4 px-6 gap-3">
        {/* Category badge */}
        <div className="w-20 h-5 rounded-full bg-[#6B2D2D]" />

        {/* Title */}
        <div className="w-3/4 h-5 rounded bg-[#52525B]" />

        {/* Description lines */}
        <div className="w-full h-3 rounded bg-[#3F3F46]" />
        <div className="w-5/6 h-3 rounded bg-[#3F3F46]" />
      </div>

      {/* PRICE + BUTTON ROW */}
      <div className="mt-auto flex items-center justify-between px-6 pb-6 pt-2">
        {/* Price */}
        <div className="w-16 h-5 rounded bg-[#6B2D2D]" />

        {/* Button */}
        <div className="w-24 h-9 rounded-lg bg-[#6B2D2D]" />
      </div>
    </div>
  );
};

export default ProductSkeletonCard;

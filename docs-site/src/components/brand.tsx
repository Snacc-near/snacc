/** The Snacc logo on its black rounded "sticker" chip (the artwork is made for black, so the chip stays black in both themes). */
export function BrandChip({ size = 'md' }: { size?: 'md' | 'sm' }) {
  const height = size === 'md' ? 30 : 26;
  return (
    <span className="sn-brandchip" data-size={size}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/snacc-logo.webp" alt="Snacc" width={Math.round((height * 1200) / 403)} height={height} decoding="async" />
    </span>
  );
}

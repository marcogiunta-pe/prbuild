'use client';

const BRANDS = [
  { name: 'TechCrunch' },
  { name: 'Forbes' },
  { name: 'Wired' },
  { name: 'VentureBeat' },
  { name: 'Inc.' },
];

function SvgWordmark({ name }: { name: string }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 min-w-[100px] group">
      <span className="text-base font-bold tracking-tight text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>
        {name}
      </span>
    </div>
  );
}

export function LogoBar() {
  return (
    <div className="mt-16 text-center overflow-hidden">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Trusted by teams at</p>
      <div className="relative w-full">
        <div className="flex animate-marquee gap-12 md:gap-20 items-center justify-start min-w-max px-4">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <SvgWordmark key={`${brand.name}-${i}`} name={brand.name} />
          ))}
        </div>
      </div>
    </div>
  );
}

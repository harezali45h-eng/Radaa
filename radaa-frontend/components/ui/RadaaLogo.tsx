import Image from "next/image";

interface RadaaLogoMarkProps {
  className?: string;
}

export function RadaaLogoMark({ className }: RadaaLogoMarkProps) {
  return (
    <Image
      src="/radaa-logo.png"
      alt="Radaa logo"
      width={28}
      height={28}
      className={className}
      priority
    />
  );
}

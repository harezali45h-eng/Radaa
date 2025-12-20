import { RadaaLogoMark as InnerRadaaLogoMark } from "@/radaa-frontend/radaa-frontend/components/ui/RadaaLogo";

export interface RadaaLogoMarkProps {
  className?: string;
}

export function RadaaLogoMark({ className }: RadaaLogoMarkProps) {
  return <InnerRadaaLogoMark className={className} />;
}

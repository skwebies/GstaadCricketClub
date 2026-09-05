import { Metadata } from "next";
import { MarketingHomeContent } from "@/shared/components/marketing/MarketingHomeContent";

export const metadata: Metadata = {
  title: "Gstaad Cricket Club | Cricket for Our Community",
  description:
    "Gstaad Cricket Club welcomes children, adults, families and beginners. Join our free Cricket Festival at Ebnit School on 26 September 2026.",
};

export default function HomePage() {
  return <MarketingHomeContent />;
}

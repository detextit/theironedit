import type { Metadata } from "next";
import OwnerDashboard from "@/components/site/owner-dashboard";

export const metadata: Metadata = {
  title: "Coach dashboard · The Iron Edit",
  robots: { index: false, follow: false },
};

export default function OwnerPage() {
  return (
    <div className="min-h-screen bg-[#161517] text-[#eeeef0]">
      <OwnerDashboard />
    </div>
  );
}

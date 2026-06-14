import type { Metadata } from "next";
import UnsubscribeForm from "@/components/site/unsubscribe-form";

export const metadata: Metadata = {
  title: "Unsubscribe · The Iron Edit",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams?: Promise<{ e?: string; t?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#161517] px-6 text-[#eeeef0]">
      <UnsubscribeForm email={params?.e ?? ""} token={params?.t ?? ""} />
    </div>
  );
}

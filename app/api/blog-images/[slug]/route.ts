import { NextResponse } from "next/server";
import { getBlogPostImage, isStaticSlug } from "@/lib/server/blog-posts";

// Public cover-image stream for DB-backed blog posts. Static posts use
// their /public images directly and never hit this route.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!slug || isStaticSlug(slug)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const image = await getBlogPostImage(slug);
  if (!image) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(image.bytes), {
    status: 200,
    headers: {
      "Content-Type": image.mimeType || "application/octet-stream",
      "Content-Length": String(image.bytes.length),
      // Posts are immutable from the public's POV; if the owner re-publishes
      // they'll use a new slug. A modest cache is safe and cheap.
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}

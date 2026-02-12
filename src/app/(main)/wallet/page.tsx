import Wallet from "@/components/wallet";
import { serverWebsiteService } from "@/lib/api/services/websiteService";
import { headers } from "next/headers";

export default async function WalletPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const paymentId = typeof resolvedSearchParams.paymentId === 'string' ? resolvedSearchParams.paymentId : null;
  const event = typeof resolvedSearchParams.event === 'string' ? resolvedSearchParams.event : null;

  const headersList = await headers();
  const websiteId = headersList.get("x-website-id") as string;
  const websiteService = serverWebsiteService(websiteId);
  const website = await websiteService.getWebsite({ id: websiteId || "" });

  return <Wallet paymentId={paymentId} event={event} currency={website.currency} />;
}

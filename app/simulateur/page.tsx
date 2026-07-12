// Force dynamic rendering - no static prerendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import SimulateurClient from "./SimulateurClient";

export default function SimulateurPage() {
  return <SimulateurClient />;
}
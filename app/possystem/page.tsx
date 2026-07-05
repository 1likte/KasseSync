import { redirect } from 'next/navigation';

export default function PosSystemRootPage() {
  // Redirect to the admin page or home page so they can select a restaurant
  // Since possystem requires a restaurant slug, we can't show anything here.
  redirect('/admin');
}

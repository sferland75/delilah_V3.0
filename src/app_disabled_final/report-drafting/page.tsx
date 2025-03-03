import { redirect } from 'next/navigation';

/**
 * Redirect to the Pages Router path
 */
export default function RedirectToPages() {
  redirect('/report-drafting');
}

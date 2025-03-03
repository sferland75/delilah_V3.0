import { redirect } from 'next/navigation';

/**
 * Redirect to the correct Pages Router path
 */
export default function RedirectToPages() {
  redirect('/import-pdf');
}

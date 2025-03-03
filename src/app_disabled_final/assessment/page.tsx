import { redirect } from 'next/navigation';

/**
 * Prevent redirect loop by adding a query parameter
 * This will ensure the browser doesn't get stuck in a loop
 */
export default function RedirectToPages() {
  redirect('/assessment?source=app');
}

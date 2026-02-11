import { redirect } from 'next/navigation';

export default function RequestFreeAccessPage() {
  redirect('/contact?message=Free+access+is+granted+by+admins.+Contact+us+to+get+started.');
}

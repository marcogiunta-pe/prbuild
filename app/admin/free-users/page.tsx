import { redirect } from 'next/navigation';

export default function FreeUsersPage() {
  redirect('/admin/users');
}

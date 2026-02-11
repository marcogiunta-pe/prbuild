'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SetPasswordPage() {
  return (
    <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Link no longer used</CardTitle>
        <CardDescription>
          This flow has been replaced. Contact your admin — they will add you and send a temporary password. Sign in and you&apos;ll be prompted to reset it.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href="/login" className="w-full">
          <Button className="w-full bg-secondary hover:bg-secondary/90">Sign in</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

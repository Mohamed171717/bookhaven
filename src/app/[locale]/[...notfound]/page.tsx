
// app/[locale]/[[...notfound]]/page.tsx
import { notFound } from 'next/navigation';

export default function CatchAllNotFound() {
  notFound(); // This triggers [locale]/not-found.tsx
}
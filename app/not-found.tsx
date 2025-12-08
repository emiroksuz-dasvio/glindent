import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h2 className="text-2xl font-bold mb-4">Sayfa Bulunamadı</h2>
      <p className="mb-4">Aradığınız sayfa mevcut değil.</p>
      <Link href="/" className="text-primary hover:underline">
        Ana Sayfaya Dön
      </Link>
    </div>
  )
}

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Luxury stays',
    description: 'Boutique rooms with premium amenities, calm interiors, and a refined hotel experience.',
  },
  {
    title: 'Fast reservations',
    description: 'Browse room types, check availability, and move from discovery to booking in minutes.',
  },
  {
    title: 'Admin control',
    description: 'A practical dashboard for staff and administrators to manage the property with ease.',
  },
];

const page = () => {
  return (
    <div className="space-y-10 py-10 md:py-16">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 dark:bg-zinc-900 shadow-xl">
        <div className="grid items-center gap-8 px-6 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-14 lg:px-14">
          <div className="space-y-5">
            <h1 className="text-2xl font-semibold leading-tight md:text-5xl lg:text-6xl">
              Experience a stay that feels effortless from start to finish.
            </h1>
            <p className="max-w-xl text-base md:text-lg">
              Discover elegant rooms, seamless booking flows, and a polished management experience for every guest.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-lg">
                <Link href="/rooms">Explore rooms</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-2 shadow-sm backdrop-blur">
            <Image
              src="/images/room.jpg"
              alt="hero-image"
              width={700}
              height={450}
              loading="eager"
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="rounded-2xl border border-slate-200 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Why HOLLIS</p>
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">A hotel experience designed for comfort, clarity, and convenience.</h2>
          </div>
          <Button asChild className="rounded-lg">
            <Link href="/rooms">View available rooms</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default page
import PageHeader from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (value: Date) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20'
    case 'Cancelled':
      return 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20'
    default:
      return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20'
  }
}

const bookings = await prisma.booking.findMany({
  orderBy: {
    createdAt: 'desc',
  },
  include: {
    room: {
      select: {
        id: true,
        room_number: true,
        type: true,
        pricePerNight: true,
        images: true,
      },
    },
    guest: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
})

const page = () => {
  const totalSpend = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

  return (
    <div className="py-10">
      <PageHeader
        title="My Bookings"
        subtitle="A polished summary of your recent stays, payment totals, and arrival details."
      />

      <div className="mt-8 space-y-6">
        <Card className="border-none shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em]">Overview</p>
              <h2 className="mt-2 text-2xl font-semibold">You have {bookings.length} booking{bookings.length === 1 ? '' : 's'} in your account</h2>
              <p className="mt-2 max-w-2xl text-sm">
                Keep track of upcoming stays, booking status, and your total spend in one place.
              </p>
            </div>
            <div className="rounded-2xl border px-4 py-3 backdrop-blur">
              <p className="text-sm">Total spend</p>
              <p className="text-xl font-semibold">{formatCurrency(totalSpend)}</p>
            </div>
          </CardContent>
        </Card>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No bookings made yet. Your stays will appear here as soon as you reserve a room.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {bookings.map((booking) => {
              const nights = Math.max(
                1,
                Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))
              )

              return (
                <Card key={booking.id} className="overflow-hidden border border-slate-200/70 bg-white shadow-sm transition-transform hover:-translate-y-1">
                  <div className="relative w-full">
                    {booking.room?.images && booking.room.images.length > 0 ? (
                      <img
                        src={booking.room.images[0]}
                        alt={booking.room?.type || 'Room image'}
                        className="h-full rounded-md w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                        No image available
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-800">
                      {booking.room?.type || 'Standard Room'}
                    </div>
                  </div>

                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {booking.room?.room_number || 'Room'}
                        </h3>
                        <p className="text-sm text-slate-500">{booking.guest?.name || 'Guest'}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${getStatusClasses(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Check-in</span>
                        <span className="font-medium text-slate-800">{formatDate(booking.checkIn)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Check-out</span>
                        <span className="font-medium text-slate-800">{formatDate(booking.checkOut)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Stay</span>
                        <span className="font-medium text-slate-800">{nights} night{nights === 1 ? '' : 's'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
                        <p className="text-base font-semibold text-slate-900">{formatCurrency(booking.totalPrice)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Booked</p>
                        <p className="text-sm font-medium text-slate-700">{formatDate(booking.createdAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default page
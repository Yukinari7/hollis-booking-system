import PageHeader from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSession } from '@/lib/auth/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await getSession();

  if (!session.data?.user.id) {
    redirect('/auth/sign-in');
  }

  const guest = await prisma.guest.findUnique({
    where: {
      id: session.data.user.id,
    },
  });

  if (!guest) {
    throw new Error('Guest profile not found.');
  }

  const payments = await prisma.payment.findMany({
    where: {
      guestId: guest.id,
    },
    include: {
      booking: {
        include: {
          room: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (value: Date | null | undefined) => {
    if (!value) return '—';

    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusClasses = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20'
    case 'Failed':
      return 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20'
    default:
      return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20'
  }
}

  return (
    <div className="py-10">
      <PageHeader
        title="My Payments"
        subtitle="Track your booking payments and payment status in one place."
      />

      <div className="pt-10">
        {payments.length === 0 ? (
          <Card className="max-w-xl">
            <CardContent className="py-6 text-sm text-muted-foreground">
              No payments made yet. Your completed reservations will appear here.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Payment history</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Paid on</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.reference}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell><Badge variant="secondary" className={getStatusClasses(payment.status)}>
                        {payment.status}
                      </Badge></TableCell>
                      <TableCell>{payment.booking?.room?.room_number ?? '—'}</TableCell>
                      <TableCell>{formatDate(payment.booking?.checkIn)}</TableCell>
                      <TableCell>{formatDate(payment.booking?.checkOut)}</TableCell>
                      <TableCell>{formatDate(payment.paidAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default page
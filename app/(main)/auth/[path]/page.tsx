
import { Dialog } from "@/components/ui/dialog";
import { AuthView } from "@neondatabase/auth/react";

export const dynamicParams = false

export default async function AuthPage({ params }: {params: Promise<{path: string}>}) {
const {path} = await params;

  return (
    <Dialog>
      <main className="flex items-center justify-center h-screen">
        <AuthView path={path} redirectTo="/dashboard" />
      </main>
    </Dialog>
  );
}

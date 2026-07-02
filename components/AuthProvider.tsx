

import { NeonAuthUIProvider } from "@neondatabase/auth/react";

import React from 'react'

type AuthClient = React.ComponentProps<typeof NeonAuthUIProvider>["authClient"];

export default function AuthProvider({
    children,
    auth
}: {
    children: React.ReactNode;
    auth: AuthClient;
}) {
  return (
    <NeonAuthUIProvider authClient={auth}>
        {children}
    </NeonAuthUIProvider>
  );
}

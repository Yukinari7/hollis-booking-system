

import { NeonAuthUIProvider } from "@neondatabase/auth/react";

import React from 'react'

export default function AuthProvider({
    children,
    auth
}: {
    children: React.ReactNode;
    auth: any;
}) {
  return (
    <NeonAuthUIProvider authClient={auth}>
        {children}
    </NeonAuthUIProvider>
  );
}

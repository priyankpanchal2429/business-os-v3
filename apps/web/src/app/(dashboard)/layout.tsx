import { Sidebar } from '../../components/Sidebar';
import { RedirectToSignIn, SignedOut, SignedIn } from '@clerk/nextjs';
import React from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
            <SignedIn>
                <div style={{ display: 'flex' }}>
                    <Sidebar />
                    <main style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--background)', minHeight: '100vh', color: 'var(--foreground)' }}>
                        {children}
                    </main>
                </div>
            </SignedIn>
        </>
    );
}

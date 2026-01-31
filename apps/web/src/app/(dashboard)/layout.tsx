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
                    <main style={{ flex: 1, padding: '2rem', backgroundColor: '#fff', minHeight: '100vh' }}>
                        {children}
                    </main>
                </div>
            </SignedIn>
        </>
    );
}

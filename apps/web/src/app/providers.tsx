'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { trpc } from '../utils/trpc';
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import superjson from 'superjson';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/trpc',
                    transformer: superjson,
                    // You can pass headers here if needed, but Clerk handles auth token usually via headers or cookie?
                    // We need to pass the Clerk token.
                    async headers() {
                        // We can't access `useAuth` hook here easily inside `useState` init if we need reactive token.
                        // But httpBatchLink callback runs on every request.
                        // However, we need to access the token.
                        // Best way is to wrap TRPCProvider inside a component that uses Auth.
                        return {};
                    },
                }),
            ],
            transformer: superjson,
        })
    );

    return (
        <ClerkProvider>
            <AuthenticatedTRPCProvider>
                {children}
            </AuthenticatedTRPCProvider>
        </ClerkProvider>
    );
}

function AuthenticatedTRPCProvider({ children }: { children: React.ReactNode }) {
    const { getToken } = useAuth();
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/trpc',
                    transformer: superjson,
                    async headers() {
                        const token = await getToken();
                        return {
                            Authorization: token ? `Bearer ${token}` : undefined,
                        };
                    },
                }),
            ],
            transformer: superjson,
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    );
}

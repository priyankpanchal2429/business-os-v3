'use client';

import Link from 'next/link';
import { SignInButton, SignUpButton, useUser, UserButton } from '@clerk/nextjs';

export function Navbar() {
    const { isSignedIn } = useUser();

    return (
        <nav className="flex items-center justify-between p-6 bg-white shadow-sm">
            <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-gray-800">
                    BusinessOS
                </Link>
            </div>
            <div className="flex items-center space-x-4">
                <Link href="/#contact" className="text-gray-600 hover:text-gray-900">
                    Contact Us
                </Link>
                {isSignedIn ? (
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Go to Dashboard
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                ) : (
                    <>
                        <Link
                            href="/sign-in"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/sign-up"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Sign up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

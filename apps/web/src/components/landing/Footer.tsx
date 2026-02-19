export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="px-6 py-12 mx-auto max-w-7xl lg:px-8">
                <div className="text-center">
                    <p className="text-xs leading-5 text-gray-400">
                        &copy; {new Date().getFullYear()} BusinessOS, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

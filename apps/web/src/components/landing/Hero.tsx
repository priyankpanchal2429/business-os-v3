export function Hero() {
    return (
        <section className="bg-white">
            <div className="px-6 py-24 mx-auto max-w-7xl lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        Manage your business with ease
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Everything you need to run your company, all in one place.
                        Streamline operations, manage clients, and track finances seamlessly.
                    </p>
                    <div className="flex items-center justify-center mt-10 gap-x-6">
                        <a
                            href="/dashboard"
                            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Get started
                        </a>
                        <a href="#contact" className="text-sm font-semibold leading-6 text-gray-900">
                            Contact sales <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

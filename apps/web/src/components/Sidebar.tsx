'use client';

import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import styles from './Sidebar.module.css';
import { useEffect, useState } from 'react';

export function Sidebar() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored) {
            setTheme(stored);
            document.documentElement.setAttribute('data-theme', stored);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>BusinessOS</div>
            <nav className={styles.nav}>
                <Link href="/" className={styles.link}>Dashboard</Link>
                <Link href="/table" className={styles.link}>Editable Table</Link>
                <Link href="/blank" className={styles.link}>Blank Page</Link>
            </nav>
            <div className={styles.footer}>
                <div className={styles.themeToggle} onClick={toggleTheme}>
                    {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </div>
                <UserButton />
            </div>
        </aside>
    );
}

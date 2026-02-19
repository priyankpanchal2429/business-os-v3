'use client';

import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import styles from './Sidebar.module.css';
import { useEffect, useState } from 'react';
import { ThemeManager, ThemeMode } from '../lib/ThemeClass';

export function Sidebar() {
    const [theme, setTheme] = useState<ThemeMode>('system');

    useEffect(() => {
        // Initialize theme
        const manager = ThemeManager.getInstance();
        setTheme(manager.getTheme());

        // Optional: Listen for storage changes if you want multi-tab sync
    }, []);

    const toggleTheme = () => {
        const manager = ThemeManager.getInstance();
        manager.toggle();
        setTheme(manager.getTheme()); // Update local state for UI icon
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>BusinessOS</div>
            <nav className={styles.nav}>
                <Link href="/dashboard" className={styles.link}>Dashboard</Link>
                <Link href="/table" className={styles.link}>Editable Table</Link>
                <Link href="/blank" className={styles.link}>Blank Page</Link>
            </nav>
            <div className={styles.footer}>
                <div className={styles.themeToggle} onClick={toggleTheme}>
                    {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </div>
                <UserButton showName />
            </div>
        </aside>
    );
}

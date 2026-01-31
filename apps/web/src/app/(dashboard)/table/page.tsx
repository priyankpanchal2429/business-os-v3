'use client';

import { trpc } from '../../../utils/trpc';
import { useState } from 'react';
import styles from './page.module.css';

export default function TablePage() {
    const ctx = trpc.useUtils();
    const { data: rows, isLoading } = trpc.tableData.list.useQuery();
    const createMutation = trpc.tableData.create.useMutation({
        onSuccess: () => ctx.tableData.list.invalidate(),
    });
    const updateMutation = trpc.tableData.update.useMutation({
        onSuccess: () => ctx.tableData.list.invalidate(),
    });
    const deleteMutation = trpc.tableData.delete.useMutation({
        onSuccess: () => ctx.tableData.list.invalidate(),
    });

    const [newText, setNewText] = useState('');
    const [newImage, setNewImage] = useState('');

    const handleAdd = async () => {
        if (!newText) return;
        await createMutation.mutateAsync({ text: newText, imageUrl: newImage || undefined });
        setNewText('');
        setNewImage('');
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure?')) {
            deleteMutation.mutate({ id });
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Editable Table</h1>

            <div className={styles.inputGroup}>
                <input
                    placeholder="Text Content"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className={styles.input}
                />
                <input
                    placeholder="Image URL (optional)"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className={styles.input}
                />
                <button onClick={handleAdd} className={styles.button}>Add Row</button>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Text</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows?.map((row) => (
                        <tr key={row.id}>
                            <td>{row.text}</td>
                            <td>
                                {row.imageUrl ? (
                                    <img src={row.imageUrl} alt="preview" style={{ width: 50, height: 50, objectFit: 'cover' }} />
                                ) : 'No Image'}
                            </td>
                            <td>
                                <button onClick={() => handleDelete(row.id)} className={styles.deleteBtn}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

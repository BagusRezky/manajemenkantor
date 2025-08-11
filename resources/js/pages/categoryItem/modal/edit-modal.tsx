import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CategoryItem } from '@/types/categoryItem';

import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface EditCategoryItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryItem: CategoryItem | null;
}

const EditCategoryItemModal: React.FC<EditCategoryItemModalProps> = ({ isOpen, onClose, categoryItem }) => {
    const { data, setData, put, processing, errors } = useForm<CategoryItem>({
        id: '',
        kode_category_item: '',
        nama_category_item: '',
    });

    useEffect(() => {
        if (categoryItem) {
            setData({
                id: categoryItem.id,
                kode_category_item: categoryItem.kode_category_item,
                nama_category_item: categoryItem.nama_category_item,
            });
        }
    }, [categoryItem, setData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/categoryItems/${data.id}`, {
            onSuccess: () => {
                toast.success('Category Item updated successfully');
                onClose();
            },
            onError: () => {
                toast.error('Failed to update category item');
                console.error(errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2">
                    {errors.kode_category_item && <div className="text-sm text-red-500">{errors.kode_category_item}</div>}
                    <Input
                        type="text"
                        name="kode_category_item"
                        value={data.kode_category_item}
                        onChange={handleChange}
                        placeholder="Kode Category Item"
                        required
                    />

                    {errors.nama_category_item && <div className="text-sm text-red-500">{errors.nama_category_item}</div>}
                    <Input
                        type="text"
                        name="nama_category_item"
                        value={data.nama_category_item}
                        onChange={handleChange}
                        placeholder="Nama Category"
                        required
                    />

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Supplier'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditCategoryItemModal;

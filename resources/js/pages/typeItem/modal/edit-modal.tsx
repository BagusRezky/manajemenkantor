import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CategoryItem } from '@/types/categoryItem';
import { TypeItem } from '@/types/typeItem';

import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface EditTypeItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    typeItem: TypeItem | null;
    categoryItems: CategoryItem[];
}

const EditTypeItemModal: React.FC<EditTypeItemModalProps> = ({ isOpen, onClose, typeItem, categoryItems }) => {
    const { data, setData, put, processing, errors } = useForm<TypeItem>({
        id: '',
        id_category_item: '',
        kode_type_item: '',
        nama_type_item: '',
    });

    useEffect(() => {
        if (typeItem) {
            setData({
                id: typeItem.id,
                id_category_item: typeItem.id_category_item,
                kode_type_item: typeItem.kode_type_item,
                nama_type_item: typeItem.nama_type_item,
            });
        }
    }, [typeItem, setData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setData({
            ...data,
            [name]: value,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/typeItems/${data.id}`, {
            onSuccess: () => {
                toast.success('Type Item updated successfully');
                onClose();
            },
            onError: () => {
                toast.error('Failed to update Type Item');
                console.error(errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Type Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2">
                    {errors.kode_type_item && <div className="text-sm text-red-500">{errors.kode_type_item}</div>}
                    <Input
                        type="text"
                        name="kode_type_item"
                        value={data.kode_type_item}
                        onChange={handleChange}
                        placeholder="Kode Type Item"
                        required
                    />

                    {errors.nama_type_item && <div className="text-sm text-red-500">{errors.nama_type_item}</div>}
                    <Input
                        type="text"
                        name="nama_type_item"
                        value={data.nama_type_item}
                        onChange={handleChange}
                        placeholder="Nama Type Item"
                        required
                    />

                    {errors.id_category_item && <div className="text-sm text-red-500">{errors.id_category_item}</div>}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="col-span-4">
                            <Select value={data.id_category_item} onValueChange={(value) => handleSelectChange('id_category_item', value)} required>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryItems.map((categoryitem) => (
                                        <SelectItem key={categoryitem.id} value={String(categoryitem.id)}>
                                            {categoryitem.nama_category_item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Type Item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditTypeItemModal;

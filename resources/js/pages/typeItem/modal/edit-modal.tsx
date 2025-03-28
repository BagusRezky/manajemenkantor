import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { TypeItem } from '../table/columns';

interface EditTypeItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    typeItem: TypeItem | null;
}

const EditTypeItemModal: React.FC<EditTypeItemModalProps> = ({ isOpen, onClose, typeItem }) => {
    const { data, setData, put, processing, errors } = useForm<TypeItem>({
        id: '',
        kode_type_item: '',
        nama_type_item: '',
    });

    useEffect(() => {
        if (typeItem) {
            setData({
                id: typeItem.id,
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
                    <Input type="text" name="kode_type_item" value={data.kode_type_item} onChange={handleChange} placeholder="Kode Supplier" required />

                    {errors.nama_type_item && <div className="text-sm text-red-500">{errors.nama_type_item}</div>}
                    <Input type="text" name="nama_type_item" value={data.nama_type_item} onChange={handleChange} placeholder="Nama Supplier" required />
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

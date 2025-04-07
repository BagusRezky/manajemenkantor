import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TypeOffice } from '@/types/typeOffice';

import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface EditTypeOfficeModalProps {
    isOpen: boolean;
    onClose: () => void;
    typeOffice: TypeOffice | null;
}

const EditTypeOfficeModal: React.FC<EditTypeOfficeModalProps> = ({ isOpen, onClose, typeOffice }) => {
    const { data, setData, put, processing, errors } = useForm<TypeOffice>({
        id: '',
        kode_type_office: '',
        nama_type_office: '',
    });

    useEffect(() => {
        if (typeOffice) {
            setData({
                id: typeOffice.id,
                kode_type_office: typeOffice.kode_type_office,
                nama_type_office: typeOffice.nama_type_office,
            });
        }
    }, [typeOffice, setData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/typeOffices/${data.id}`, {
            onSuccess: () => {
                toast.success('Type Office updated successfully');
                onClose();
            },
            onError: () => {
                toast.error('Failed to update Type Office');
                console.error(errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Type Office</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2">
                    {errors.kode_type_office && <div className="text-sm text-red-500">{errors.kode_type_office}</div>}
                    <Input type="text" name="kode_type_office" value={data.kode_type_office} onChange={handleChange} placeholder="Kode Supplier" required />

                    {errors.nama_type_office && <div className="text-sm text-red-500">{errors.nama_type_office}</div>}
                    <Input type="text" name="nama_type_office" value={data.nama_type_office} onChange={handleChange} placeholder="Nama Supplier" required />
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Item Office'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditTypeOfficeModal;

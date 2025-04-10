import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Unit } from '@/types/unit';

import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';


interface EditUnitModalProps {
    isOpen: boolean;
    onClose: () => void;
    unit: Unit | null;
}

const EditUnitModal: React.FC<EditUnitModalProps> = ({ isOpen, onClose, unit }) => {
    const { data, setData, put, processing, errors } = useForm<Unit>({
        id: '',
        kode_satuan: '',
        nama_satuan: '',
    });

    useEffect(() => {
        if (unit) {
            setData({
                id: unit.id,
                kode_satuan: unit.kode_satuan,
                nama_satuan: unit.nama_satuan,
            });
        }
    }, [unit, setData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/units/${data.id}`, {
            onSuccess: () => {
                toast.success('Unit updated successfully');
                onClose();
            },
            onError: () => {
                toast.error('Failed to update unit');
                console.error(errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Unit</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2">
                    {errors.kode_satuan && <div className="text-sm text-red-500">{errors.kode_satuan}</div>}
                    <Input type="text" name="kode_satuan" value={data.kode_satuan} onChange={handleChange} placeholder="Kode Supplier" required />

                    {errors.nama_satuan && <div className="text-sm text-red-500">{errors.nama_satuan}</div>}
                    <Input type="text" name="nama_satuan" value={data.nama_satuan} onChange={handleChange} placeholder="Nama Supplier" required />
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

export default EditUnitModal;

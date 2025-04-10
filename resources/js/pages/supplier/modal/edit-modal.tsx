import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Supplier } from '@/types/supplier';
import { Textarea } from '@headlessui/react';

import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface EditSupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplier: Supplier | null;
}

const EditSupplierModal: React.FC<EditSupplierModalProps> = ({ isOpen, onClose, supplier }) => {
    const { data, setData, put, processing, errors } = useForm<Supplier>({
        id: '',
        kode_suplier: '',
        nama_suplier: '',
        jenis_suplier: '',
        keterangan: '',
        alamat_lengkap: '',
    });

    useEffect(() => {
        if (supplier) {
            setData({
                id: supplier.id,
                kode_suplier: supplier.kode_suplier,
                nama_suplier: supplier.nama_suplier,
                jenis_suplier: supplier.jenis_suplier,
                keterangan: supplier.keterangan,
                alamat_lengkap: supplier.alamat_lengkap,
            });
        }
    }, [supplier, setData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/suppliers/${data.id}`, {
            onSuccess: () => {
                toast.success('Supplier updated successfully');
                onClose();
            },
            onError: () => {
                toast.error('Failed to update supplier');
                console.error(errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Supplier</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2">
                    {errors.kode_suplier && <div className="text-sm text-red-500">{errors.kode_suplier}</div>}
                    <Input type="text" name="kode_suplier" value={data.kode_suplier} onChange={handleChange} placeholder="Kode Supplier" required />

                    {errors.nama_suplier && <div className="text-sm text-red-500">{errors.nama_suplier}</div>}
                    <Input type="text" name="nama_suplier" value={data.nama_suplier} onChange={handleChange} placeholder="Nama Supplier" required />

                    {errors.jenis_suplier && <div className="text-sm text-red-500">{errors.jenis_suplier}</div>}
                    <Input
                        type="text"
                        name="jenis_suplier"
                        value={data.jenis_suplier}
                        onChange={handleChange}
                        placeholder="Jenis Supplier"
                        required
                    />

                    {errors.alamat_lengkap && <div className="text-sm text-red-500">{errors.alamat_lengkap}</div>}
                    <Textarea
                        id="alamat_lengkap"
                        name="alamat_lengkap"
                        value={data.alamat_lengkap}
                        onChange={handleChange}
                        className="col-span-3 rounded-md border border-gray-400 w-full p-2"
                        rows={3}
                        required
                    />

                    {errors.keterangan && <div className="text-sm text-red-500">{errors.keterangan}</div>}
                    <Input type="text" name="keterangan" value={data.keterangan} onChange={handleChange} placeholder="Keterangan" required />

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

export default EditSupplierModal;

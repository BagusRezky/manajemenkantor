import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Mesin } from '@/types/mesin';

import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';


interface EditMesinModalProps {
    isOpen: boolean;
    onClose: () => void;
    mesin: Mesin | null;
}

const EditMesinModal: React.FC<EditMesinModalProps> = ({ isOpen, onClose, mesin }) => {
    const { data, setData, put, processing, errors } = useForm<Mesin>({
        id: '',
        nama_mesin: '',
        jenis_mesin: '',
        kapasitas: 0,
        proses: '',
        status: '',
    });

    useEffect(() => {
        if (mesin) {
            setData({
                id: mesin.id,
                nama_mesin: mesin.nama_mesin,
                jenis_mesin: mesin.jenis_mesin,
                kapasitas: mesin.kapasitas,
                proses: mesin.proses,
                status: mesin.status,
            });
        }
    }, [mesin, setData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/mesins/${data.id}`, {
            onSuccess: () => {
                toast('succes Mesin updated successfully');
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
                    <DialogTitle>EdMesin</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2">


                    {errors.nama_mesin && <div className="text-sm text-red-500">{errors.nama_mesin}</div>}
                    <Input type="text" name="nama_mesin" value={data.nama_mesin} onChange={handleChange} placeholder="Nama Mesin" required />
                    {errors.jenis_mesin && <div className="text-sm text-red-500">{errors.jenis_mesin}</div>}
                    <Input type="text" name="jenis_mesin" value={data.jenis_mesin} onChange={handleChange} placeholder="Jenis Mesin" required />
                    {errors.kapasitas && <div className="text-sm text-red-500">{errors.kapasitas}</div>}
                    <Input
                        type="number"
                        name="kapasitas"
                        value={data.kapasitas}
                        onChange={handleChange}
                        placeholder="Kapasitas"
                        required
                    />
                    {errors.proses && <div className="text-sm text-red-500">{errors.proses}</div>}
                    <Input type="text" name="proses" value={data.proses} onChange={handleChange} placeholder="Proses" required />
                    {errors.status && <div className="text-sm text-red-500">{errors.status}</div>}
                    <Input type="text" name="status" value={data.status} onChange={handleChange} placeholder="Status" required />
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

export default EditMesinModal;

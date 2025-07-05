import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MesinDiemaking } from '@/types/mesinDiemaking';


import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';


interface EditMesinModalProps {
    isOpen: boolean;
    onClose: () => void;
    mesinDiemaking: MesinDiemaking | null;
}

const EditMesinDiemakingModal: React.FC<EditMesinModalProps> = ({ isOpen, onClose, mesinDiemaking }) => {
    const { data, setData, put, processing, errors } = useForm<MesinDiemaking>({
        id: '',
        nama_mesin_diemaking: '',
        jenis_mesin_diemaking: '',
        kapasitas_diemaking: 0,
        proses_diemaking: '',
        status_diemaking: '',
    });

    useEffect(() => {
        if (mesinDiemaking) {
            setData({
                id: mesinDiemaking.id,
                nama_mesin_diemaking: mesinDiemaking.nama_mesin_diemaking,
                jenis_mesin_diemaking: mesinDiemaking.jenis_mesin_diemaking,
                kapasitas_diemaking: mesinDiemaking.kapasitas_diemaking,
                proses_diemaking: mesinDiemaking.proses_diemaking,
                status_diemaking: mesinDiemaking.status_diemaking,
            });
        }
    }, [mesinDiemaking, setData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/mesinDiemakings/${data.id}`, {
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
                    <DialogTitle> Mesin Diemaking</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2">


                    {errors.nama_mesin_diemaking && <div className="text-sm text-red-500">{errors.nama_mesin_diemaking}</div>}
                    <Input type="text" name="nama_mesin_diemaking" value={data.nama_mesin_diemaking} onChange={handleChange} placeholder="Nama Mesin" required />
                    {errors.jenis_mesin_diemaking && <div className="text-sm text-red-500">{errors.jenis_mesin_diemaking}</div>}
                    <Input type="text" name="jenis_mesin_diemaking" value={data.jenis_mesin_diemaking} onChange={handleChange} placeholder="Jenis Mesin" required />
                    {errors.kapasitas_diemaking && <div className="text-sm text-red-500">{errors.kapasitas_diemaking}</div>}
                    <Input
                        type="number"
                        name="kapasitas_diemaking"
                        value={data.kapasitas_diemaking}
                        onChange={handleChange}
                        placeholder="Kapasitas"
                        required
                    />
                    {errors.proses_diemaking && <div className="text-sm text-red-500">{errors.proses_diemaking}</div>}
                    <Input type="text" name="proses_diemaking" value={data.proses_diemaking} onChange={handleChange} placeholder="Proses" required />
                    {errors.status_diemaking && <div className="text-sm text-red-500">{errors.status_diemaking}</div>}
                    <Input type="text" name="status_diemaking" value={data.status_diemaking} onChange={handleChange} placeholder="Status" required />
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

export default EditMesinDiemakingModal;

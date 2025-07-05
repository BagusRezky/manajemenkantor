import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MesinFinishing } from '@/types/mesinFinishing';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';


interface EditMesinModalProps {
    isOpen: boolean;
    onClose: () => void;
    mesinFinishing: MesinFinishing | null;
}

const EditMesinFinishingModal: React.FC<EditMesinModalProps> = ({ isOpen, onClose, mesinFinishing }) => {
    const { data, setData, put, processing, errors } = useForm<MesinFinishing>({
        id: '',
        nama_mesin_finishing: '',
        jenis_mesin_finishing: '',
        kapasitas_finishing: 0,
        proses_finishing: '',
        status_finishing: '',
    });

    useEffect(() => {
        if (mesinFinishing) {
            setData({
                id: mesinFinishing.id,
                nama_mesin_finishing: mesinFinishing.nama_mesin_finishing,
                jenis_mesin_finishing: mesinFinishing.jenis_mesin_finishing,
                kapasitas_finishing: mesinFinishing.kapasitas_finishing,
                proses_finishing: mesinFinishing.proses_finishing,
                status_finishing: mesinFinishing.status_finishing,
            });
        }
    }, [mesinFinishing, setData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/mesinFinishings/${data.id}`, {
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


                    {errors.nama_mesin_finishing && <div className="text-sm text-red-500">{errors.nama_mesin_finishing}</div>}
                    <Input type="text" name="nama_mesin_finishing" value={data.nama_mesin_finishing} onChange={handleChange} placeholder="Nama Mesin" required />
                    {errors.jenis_mesin_finishing && <div className="text-sm text-red-500">{errors.jenis_mesin_finishing}</div>}
                    <Input type="text" name="jenis_mesin_finishing" value={data.jenis_mesin_finishing} onChange={handleChange} placeholder="Jenis Mesin" required />
                    {errors.kapasitas_finishing && <div className="text-sm text-red-500">{errors.kapasitas_finishing}</div>}
                    <Input
                        type="number"
                        name="kapasitas_finishing"
                        value={data.kapasitas_finishing}
                        onChange={handleChange}
                        placeholder="Kapasitas"
                        required
                    />
                    {errors.proses_finishing && <div className="text-sm text-red-500">{errors.proses_finishing}</div>}
                    <Input type="text" name="proses_finishing" value={data.proses_finishing} onChange={handleChange} placeholder="Proses" required />
                    {errors.status_finishing && <div className="text-sm text-red-500">{errors.status_finishing}</div>}
                    <Input type="text" name="status_finishing" value={data.status_finishing} onChange={handleChange} placeholder="Status" required />
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

export default EditMesinFinishingModal;

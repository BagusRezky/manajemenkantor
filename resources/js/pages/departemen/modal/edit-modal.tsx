import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Departemen } from '@/types/departemen';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface EditDepartemenModalProps {
    isOpen: boolean;
    onClose: () => void;
    departemen: Departemen | null;
}

const EditDepartemenModal: React.FC<EditDepartemenModalProps> = ({ isOpen, onClose, departemen }) => {
    const { data, setData, put, processing, errors } = useForm<Departemen>({
        id: '',
        kode_departemen: '',
        nama_departemen: '',
    });

    useEffect(() => {
        if (departemen) {
            setData({
                id: departemen.id,
                kode_departemen: departemen.kode_departemen,
                nama_departemen: departemen.nama_departemen,
            });
        }
    }, [departemen, setData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/departemens/${data.id}`, {
            onSuccess: () => {
                toast.success('Departemen updated successfully');
                onClose();
            },
            onError: () => {
                toast.error('Failed to update departemen');
                console.error(errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Departemen</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2">
                    {errors.kode_departemen && <div className="text-sm text-red-500">{errors.kode_departemen}</div>}
                    <Input type="text" name="kode_departemen" value={data.kode_departemen} onChange={handleChange} placeholder="Kode Category Item" required />

                    {errors.nama_departemen && <div className="text-sm text-red-500">{errors.nama_departemen}</div>}
                    <Input type="text" name="nama_departemen" value={data.nama_departemen} onChange={handleChange} placeholder="Nama Category" required />


                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Departemen'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditDepartemenModal;

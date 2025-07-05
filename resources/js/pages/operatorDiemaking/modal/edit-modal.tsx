import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { OperatorDiemaking } from '@/types/operatorDiemaking';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';


interface EditMesinModalProps {
    isOpen: boolean;
    onClose: () => void;
    operatorDiemaking: OperatorDiemaking | null;
}

const EditOperatorDiemakingModal: React.FC<EditMesinModalProps> = ({ isOpen, onClose, operatorDiemaking }) => {
    const { data, setData, put, processing, errors } = useForm<OperatorDiemaking>({
        id: '',
        nama_operator_diemaking: '',
    });

    useEffect(() => {
        if (operatorDiemaking) {
            setData({
                id: operatorDiemaking.id,
                nama_operator_diemaking: operatorDiemaking.nama_operator_diemaking,

            });
        }
    }, [operatorDiemaking, setData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/operatorDiemakings/${data.id}`, {
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
                    <DialogTitle>Edit Operator</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2">


                    {errors.nama_operator_diemaking && <div className="text-sm text-red-500">{errors.nama_operator_diemaking}</div>}
                    <Input type="text" name="nama_operator_diemaking" value={data.nama_operator_diemaking} onChange={handleChange} placeholder="Nama Operator" required />
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

export default EditOperatorDiemakingModal;

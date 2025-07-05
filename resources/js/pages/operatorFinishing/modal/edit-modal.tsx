import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { OperatorFinishing } from '@/types/operatorFinishing';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';


interface EditMesinModalProps {
    isOpen: boolean;
    onClose: () => void;
    operatorFinishing: OperatorFinishing | null;
}

const EditOperatorFinishingModal: React.FC<EditMesinModalProps> = ({ isOpen, onClose, operatorFinishing }) => {
    const { data, setData, put, processing, errors } = useForm<OperatorFinishing>({
        id: '',
        nama_operator_finishing: '',
    });

    useEffect(() => {
        if (operatorFinishing) {
            setData({
                id: operatorFinishing.id,
                nama_operator_finishing: operatorFinishing.nama_operator_finishing,

            });
        }
    }, [operatorFinishing, setData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/operatorFinishings/${data.id}`, {
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


                    {errors.nama_operator_finishing && <div className="text-sm text-red-500">{errors.nama_operator_finishing}</div>}
                    <Input type="text" name="nama_operator_finishing" value={data.nama_operator_finishing} onChange={handleChange} placeholder="Nama Operator" required />
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

export default EditOperatorFinishingModal;


import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { OperatorDiemaking } from '@/types/operatorDiemaking';



type OperatorFormData = Omit<OperatorDiemaking, 'id'>;

export function OperatorFormModal() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<OperatorFormData>({
        nama_operator_diemaking: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const upperCaseFields = ['nama_operator_diemaking'];
        const newValue = upperCaseFields.includes(name) ? value.toUpperCase() : value;
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Submit form data using Inertia
        router.post('/operatorDiemakings', formData, {
            onSuccess: () => {
                // Close the modal and reset form after successful submission
                toast.success('Operator added successfully');
                setOpen(false);
                setFormData({
                    nama_operator_diemaking: '',
                });
            },
            onError: () => {
                toast.error('Failed to add Operator');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add New Operator Diemaking</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Operator Diemaking</DialogTitle>
                        <DialogDescription>Fill in the Operator details and click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama_operator_diemaking" className="text-right">
                                Nama Operator
                            </Label>
                            <Input
                                id="nama_operator_diemaking"
                                name="nama_operator_diemaking"
                                value={formData.nama_operator_diemaking}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Add</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

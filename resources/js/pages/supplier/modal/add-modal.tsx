import { Supplier } from '@/types/supplier';
import { Textarea } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

type SupplierFormData = Omit<Supplier, 'id'>;

export function SupplierFormModal() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<SupplierFormData>({
        kode_suplier: '',
        nama_suplier: '',
        jenis_suplier: '',
        keterangan: '',
        alamat_lengkap: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        const upperCaseFields = ['kode_suplier', 'nama_suplier'];

        const newValue = upperCaseFields.includes(name) ? value.toUpperCase() : value;
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Submit form data using Inertia
        router.post('/suppliers', formData, {
            onSuccess: () => {
                // Close the modal and reset form after successful submission
                toast.success('Supplier added successfully');

                setOpen(false);
                setFormData({
                    kode_suplier: '',
                    nama_suplier: '',
                    jenis_suplier: '',
                    keterangan: '',
                    alamat_lengkap: '',
                });
            },
            onError: () => {
                toast.error('Failed to add Supplier');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add New Supplier</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Supplier</DialogTitle>
                        <DialogDescription>Fill in the supplier details and click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kode_suplier" className="text-right">
                                Kode Supplier
                            </Label>
                            <Input
                                id="kode_suplier"
                                name="kode_suplier"
                                value={formData.kode_suplier}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama_suplier" className="text-right">
                                Nama Supplier
                            </Label>
                            <Input
                                id="nama_suplier"
                                name="nama_suplier"
                                value={formData.nama_suplier}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="jenis_suplier" className="text-right">
                                Jenis Supplier
                            </Label>
                            <Input
                                id="jenis_suplier"
                                name="jenis_suplier"
                                value={formData.jenis_suplier}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alamat_lengkap" className="text-right">
                                Alamat
                            </Label>
                            <Textarea
                                id="alamat_lengkap"
                                name="alamat_lengkap"
                                value={formData.alamat_lengkap}
                                onChange={handleChange}
                                className="col-span-3 rounded-md border border-gray-400 p-2"
                                rows={3}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="keterangan" className="text-right">
                                Keterangan
                            </Label>
                            <Textarea
                                id="keterangan"
                                name="keterangan"
                                value={formData.keterangan}
                                onChange={handleChange}
                                className="col-span-3 rounded-md border border-gray-400 p-2"
                                rows={3}
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

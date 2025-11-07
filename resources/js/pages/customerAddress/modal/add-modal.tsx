import { CustomerAddress } from '@/types/customerAddress';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

type CustomerAddressFormData = Omit<CustomerAddress, 'id'>;

export function CustomerAddressFormModal() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<CustomerAddressFormData>({
        kode_customer: '',
        nama_customer: '',
        alamat_lengkap: '',
        alamat_kedua: '',
        alamat_ketiga: '',
        kode_group: '',
        nama_group_customer: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        const upperCaseFields = ['kode_customer', 'nama_customer'];
        const newValue = upperCaseFields.includes(name) ? value.toUpperCase() : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Submit form data using Inertia
        router.post('/customerAddresses', formData, {
            onSuccess: () => {
                // Close the modal and reset form after successful submission
                setOpen(false);
                setFormData({
                    kode_customer: '',
                    nama_customer: '',
                    alamat_lengkap: '',
                    alamat_kedua: '',
                    alamat_ketiga: '',
                    kode_group: '',
                    nama_group_customer: '',
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add New Customer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Customer</DialogTitle>
                        <DialogDescription>Fill in the Customer details and click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kode_customer" className="text-right">
                                Kode Customer
                            </Label>
                            <Input
                                id="kode_customer"
                                name="kode_customer"
                                value={formData.kode_customer}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama_customer" className="text-right">
                                Nama Customer
                            </Label>
                            <Input
                                id="nama_customer"
                                name="nama_customer"
                                value={formData.nama_customer}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alamat_lengkap" className="text-right">
                                Alamat Lengkap
                            </Label>
                            <Input
                                id="alamat_lengkap"
                                name="alamat_lengkap"
                                value={formData.alamat_lengkap}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alamat_kedua" className="text-right">
                                Alamat Kedua
                            </Label>
                            <Input
                                id="alamat_kedua"
                                name="alamat_kedua"
                                value={formData.alamat_kedua}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alamat_ketiga" className="text-right">
                                Alamat Ketiga
                            </Label>
                            <Input
                                id="alamat_ketiga"
                                name="alamat_ketiga"
                                value={formData.alamat_ketiga}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kode_group" className="text-right">
                                Kode Group
                            </Label>
                            <Input
                                id="kode_group"
                                name="kode_group"
                                value={formData.kode_group}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama_group_customer" className="text-right">
                                Nama Group Customer
                            </Label>
                            <Input
                                id="nama_group_customer"
                                name="nama_group_customer"
                                value={formData.nama_group_customer}
                                onChange={handleChange}
                                className="col-span-3"
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

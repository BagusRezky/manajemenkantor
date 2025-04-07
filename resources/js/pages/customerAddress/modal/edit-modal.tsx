import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CustomerAddress } from '@/types/customerAddress';

import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';


interface EditCustomerAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerAddress: CustomerAddress | null;
}

const EditCustomerAddressModal: React.FC<EditCustomerAddressModalProps> = ({ isOpen, onClose, customerAddress }) => {
    const { data, setData, put, processing, errors } = useForm<CustomerAddress>({
        id: '',
        kode_customer: '',
        nama_customer: '',
        alamat_lengkap: '',
        alamat_kedua: '',
        alamat_ketiga: '',
    });

    useEffect(() => {
        if (customerAddress) {
            setData({
                id: customerAddress.id,
                kode_customer: customerAddress.kode_customer,
                nama_customer: customerAddress.nama_customer,
                alamat_lengkap: customerAddress.alamat_lengkap,
                alamat_kedua: customerAddress.alamat_kedua,
                alamat_ketiga: customerAddress.alamat_ketiga,
            });
        }
    }, [customerAddress, setData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/customerAddresses/${data.id}`, {
            onSuccess: () => {
                toast.success('Customer updated successfully');
                onClose();
            },
            onError: () => {
                toast.error('Failed to update Customer');
                console.error(errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2">
                    {errors.kode_customer && <div className="text-sm text-red-500">{errors.kode_customer}</div>}
                    <Input type="text" name="kode_customer" value={data.kode_customer} onChange={handleChange} placeholder="Kode Customer" required />

                    {errors.nama_customer && <div className="text-sm text-red-500">{errors.nama_customer}</div>}
                    <Input type="text" name="nama_customer" value={data.nama_customer} onChange={handleChange} placeholder="Nama Customer" required />

                    {errors.alamat_lengkap && <div className="text-sm text-red-500">{errors.alamat_lengkap}</div>}
                    <Input
                        type="text"
                        name="alamat_lengkap"
                        value={data.alamat_lengkap}
                        onChange={handleChange}
                        placeholder="Alamat Lengkap"
                        required
                    />
                    {errors.alamat_kedua && <div className="text-sm text-red-500">{errors.alamat_kedua}</div>}
                    <Input type="text" name="alamat_kedua" value={data.alamat_kedua} onChange={handleChange} placeholder="Alamat Kedua" />
                    {errors.alamat_ketiga && <div className="text-sm text-red-500">{errors.alamat_ketiga}</div>}
                    <Input type="text" name="alamat_ketiga" value={data.alamat_ketiga} onChange={handleChange} placeholder="Alamat Ketiga" />
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Customer'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditCustomerAddressModal;

import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { MasterKonversi } from '@/types/masterKonversi';
import { Unit } from '@/types/unit';
import { TypeItem } from '@/types/typeItem';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';


type MasterKonversiFormData = Omit<MasterKonversi, 'id'>;

type MasterKonversiFormModalProps = {
    typeItems: TypeItem[];
    units: Unit[];
};

export function MasterKonversiFormModal({ typeItems, units }: MasterKonversiFormModalProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<MasterKonversiFormData>({
        id_type_item: '',
        satuan_satu_id: '',
        satuan_dua_id: '',
        jumlah_satuan_konversi: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Submit form data using Inertia
        router.post('/masterKonversis', formData, {
            onSuccess: () => {
                // Close the modal and reset form after successful submission
                toast.success('Konversi added successfully');
                setOpen(false);
                setFormData({
                    id_type_item: '',
                    satuan_satu_id: '',
                    satuan_dua_id: '',
                    jumlah_satuan_konversi: '',
                });
            },
            onError: () => {
                toast.error('Failed to add Konversi');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add Master Konversi</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Master Konversi</DialogTitle>
                        <DialogDescription>Fill in the Type Item details and click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="id_type_item" className="text-right">
                                Tipe Barang
                            </Label>
                            <div className="col-span-3">
                                <Select value={formData.id_type_item} onValueChange={(value) => handleSelectChange('id_type_item', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Tipe Barang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {typeItems.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.nama_type_item}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="satuan_satu_id" className="text-right">
                                Satuan Satu
                            </Label>
                            <div className="col-span-3">
                                <Select value={formData.satuan_satu_id} onValueChange={(value) => handleSelectChange('satuan_satu_id', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Satuan Asal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((unit) => (
                                            <SelectItem key={unit.id} value={String(unit.id)}>
                                                {unit.nama_satuan}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="satuan_dua_id" className="text-right">
                                Satuan Dua
                            </Label>
                            <div className="col-span-3">
                                <Select value={formData.satuan_dua_id} onValueChange={(value) => handleSelectChange('satuan_dua_id', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Satuan Asal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((unit) => (
                                            <SelectItem key={unit.id} value={String(unit.id)}>
                                                {unit.nama_satuan}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="jumlah_satuan_konversi" className="text-right">
                                Jumlah Satuan Konversi
                            </Label>
                            <Input
                                id="jumlah_satuan_konversi"
                                name="jumlah_satuan_konversi"
                                value={formData.jumlah_satuan_konversi}
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

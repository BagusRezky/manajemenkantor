import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MasterKonversi } from '@/types/masterKonversi';
import { TypeItem } from '@/types/typeItem';

import { Unit } from '@/types/unit';

import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface EditMasterKonversiModalProps {
    isOpen: boolean;
    onClose: () => void;
    typeItems: TypeItem[];
    units: Unit[];
    masterKonversi: MasterKonversi | null;
}

const EditMasterKonversiModal: React.FC<EditMasterKonversiModalProps> = ({ isOpen, onClose, masterKonversi, typeItems, units }) => {
    const { data, setData, put, processing, errors } = useForm<MasterKonversi>({
        id: masterKonversi ? masterKonversi.id : '',
        id_type_item: masterKonversi ? masterKonversi.id_type_item : '',
        satuan_satu_id: masterKonversi ? masterKonversi.satuan_satu_id : '',
        satuan_dua_id: masterKonversi ? masterKonversi.satuan_dua_id : '',
        jumlah_satuan_konversi: '',
    });

    useEffect(() => {
        if (masterKonversi) {
            setData({
                id: masterKonversi.id,
                id_type_item: masterKonversi.id_type_item,
                satuan_satu_id: masterKonversi.satuan_satu_id,
                satuan_dua_id: masterKonversi.satuan_dua_id,
                jumlah_satuan_konversi: masterKonversi.jumlah_satuan_konversi,
            });
        }
    }, [masterKonversi, setData]);

    const handleSelectChange = (name: string, value: string) => {
        setData({
            ...data,
            [name]: value,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/masterKonversis/${data.id}`, {
            onSuccess: () => {
                toast.success('Type Item updated successfully');
                onClose();
            },
            onError: () => {
                toast.error('Failed to update Type Item');
                console.error(errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Konversi Satuan</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="space-y-2">
                        <Label htmlFor="id_type_item">Tipe Barang</Label>
                        <Select value={data.id_type_item} onValueChange={(value) => handleSelectChange('id_type_item', value)}>
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
                        {errors.id_type_item && <div className="text-sm text-red-500">{errors.id_type_item}</div>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="satuan_satu_id">Satuan Asal</Label>
                        <Select value={data.satuan_satu_id} onValueChange={(value) => handleSelectChange('satuan_satu_id', value)}>
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
                        {errors.satuan_satu_id && <div className="text-sm text-red-500">{errors.satuan_satu_id}</div>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="satuan_dua_id">Satuan Tujuan</Label>
                        <Select value={data.satuan_dua_id} onValueChange={(value) => handleSelectChange('satuan_dua_id', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Satuan Tujuan" />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((unit) => (
                                    <SelectItem key={unit.id} value={String(unit.id)} >
                                        {unit.nama_satuan}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.satuan_dua_id && <div className="text-sm text-red-500">{errors.satuan_dua_id}</div>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jumlah_satuan_konversi">Jumlah Satuan Konversi</Label>
                        <Input
                            type="text"
                            name="jumlah_satuan_konversi"
                            value={data.jumlah_satuan_konversi}
                            onChange={handleChange}
                            required
                        />
                        {errors.jumlah_satuan_konversi && <div className="text-sm text-red-500">{errors.jumlah_satuan_konversi}</div>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Master Konversi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditMasterKonversiModal;

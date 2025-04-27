/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Departemen } from '@/types/departemen';
import { MasterItem } from '@/types/masterItem';

import { SearchableSelect } from '@/components/search-select';

import { BomItem } from '@/types/billOfMaterial';
import { useState } from 'react';
import { toast } from 'sonner';

interface BillOfMaterialFormProps {
    masterItems: MasterItem[];
    departements: Departemen[];
    bomItems: BomItem[];
    setBomItems: React.Dispatch<React.SetStateAction<BomItem[]>>;
}

export default function BillOfMaterialForm({ masterItems, departements, bomItems, setBomItems }: BillOfMaterialFormProps) {
    const [showBomSection, setShowBomSection] = useState(false);
    const [selectedMasterItemUnit, setSelectedMasterItemUnit] = useState<string>('');
    const [selectedDepartemen, setSelectedDepartemen] = useState<string>('');
    const [currentBomItem, setCurrentBomItem] = useState<BomItem>({
        id_master_item: '',
        id_departemen: '',
        waste: '0',
        qty: '',
        keterangan: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentBomItem({
            ...currentBomItem,
            [name]: value,
        });
    };

    const handleMasterItemChange = (value: string) => {
        setCurrentBomItem({
            ...currentBomItem,
            id_master_item: value,
        });

        // Find the selected master item to get its unit
        const selectedItem = masterItems.find((item) => String(item.id) === value);
        if (selectedItem && selectedItem.unit?.nama_satuan) {
            setSelectedMasterItemUnit(selectedItem.unit?.nama_satuan);
        } else {
            setSelectedMasterItemUnit('');
        }
    };

    const handleDepartemenChange = (value: string) => {
        setCurrentBomItem({
            ...currentBomItem,
            id_departemen: value,
        });

        // Find the selected departemen
        const selectedDep = departements.find((dep) => String(dep.id) === value);
        if (selectedDep) {
            setSelectedDepartemen(selectedDep.nama_departemen);
        } else {
            setSelectedDepartemen('');
        }
    };

    const handleAddBomItem = () => {
        if (currentBomItem.id_master_item && currentBomItem.id_departemen && currentBomItem.waste && currentBomItem.qty) {
            // Find the full objects for better display
            const masterItem = masterItems.find((item) => String(item.id) === currentBomItem.id_master_item);
            const departemen = departements.find((dep) => String(dep.id) === currentBomItem.id_departemen);

            const newBomItem: BomItem = {
                ...currentBomItem,
                id: String(Date.now()), // Generate a unique ID for the new item
                master_item: masterItem, // Add the full object for display purposes
                departemen: departemen, // Add the full object for display purposes
            };

            console.log('Adding BOM item:', newBomItem);
            setBomItems([...bomItems, newBomItem]);
            toast.success('Material added to BOM successfully!');

            // Reset form
            setCurrentBomItem({
                id_master_item: '',
                id_departemen: '',
                waste: '',
                qty: '',
                keterangan: '',
            });
        } else {
            toast.error('Please fill in all required fields for BOM item');
        }
    };

    const handleRemoveBomItem = (id: string) => {
        setBomItems(bomItems.filter((item) => String(item.id) !== id));
        toast.success('Material removed from BOM successfully!');
    };

    return (
        <div className="mt-6">
            <Button type="button" onClick={() => setShowBomSection(!showBomSection)} className="bg-blue-500 text-white">
                {showBomSection ? 'Sembunyikan Bill of Material' : 'Tambah Bill of Material'}
            </Button>

            {showBomSection && (
                <div className="mt-4 rounded-md border p-4">
                    <h3 className="mb-4 text-lg font-medium">Bill of Materials</h3>

                    {/* BOM items list */}
                    {bomItems.length > 0 && (
                        <div className="mt-4 rounded-md border">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="text-white-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">Material</th>
                                        <th className="text-white-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                            Departemen
                                        </th>
                                        <th className="text-white-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">Waste</th>
                                        <th className="text-white-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">Qty</th>
                                        <th className="text-white-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">Satuan</th>
                                        <th className="text-white-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                            Keterangan
                                        </th>
                                        <th className="text-white-500 px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {bomItems.map((item) => {
                                        const masterItem = masterItems.find((mi) => String(mi.id) === item.id_master_item);
                                        const departemen = departements.find((d) => String(d.id) === item.id_departemen);

                                        return (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {masterItem ? `${masterItem.kode_master_item} - ${masterItem.nama_master_item}` : ''}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{departemen?.nama_departemen || ''}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.waste}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.qty}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{masterItem?.unit?.nama_satuan || ''}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.keterangan}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveBomItem(item.id || '')}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* BOM input form */}
                    <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="id_master_item">Material</Label>
                            <SearchableSelect
                                items={masterItems.map((item) => ({
                                    key: String(item.id),
                                    value: String(item.id),
                                    label: `${item.kode_master_item} - ${item.nama_master_item}`,
                                }))}
                                value={currentBomItem.id_master_item}
                                placeholder="Pilih Material"
                                onChange={handleMasterItemChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="id_departemen">Departemen</Label>
                            <SearchableSelect
                                items={departements.map((item) => ({
                                    key: String(item.id),
                                    value: String(item.id),
                                    label: item.nama_departemen,
                                }))}
                                value={currentBomItem.id_departemen}
                                placeholder="Pilih Departemen"
                                onChange={handleDepartemenChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="waste">Waste</Label>
                            <Input id="waste" name="waste" type="number" value={currentBomItem.waste} onChange={handleInputChange} disabled />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="qty">Qty</Label>
                            <Input id="qty" name="qty" type="number" step={0.01} value={currentBomItem.qty} onChange={handleInputChange} />
                        </div>
                        {/*
                        <div className="space-y-2">
                            <Label htmlFor="satuan">Satuan</Label>
                            <Input id="satuan" name="satuan" value={selectedMasterItemUnit} disabled />
                        </div> */}

                        <div className="space-y-2">
                            <Label htmlFor="keterangan">Keterangan</Label>
                            <Input id="keterangan" name="keterangan" value={currentBomItem.keterangan} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="mt-4">
                        <Button type="button" onClick={handleAddBomItem} className="bg-green-500 text-white">
                            Tambah Material
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

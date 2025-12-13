/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import EditFormPO from './components/edit/edit-form-po';
import EditPrItems from './components/edit/edit-pr-item';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase Order',
        href: '/purchaseOrders',
    },
    {
        title: 'Edit Purchase Order',
        href: '#',
    },
];

// Interface untuk data form
interface PurchaseOrderFormData {
    id_purchase_request: string;
    id_supplier: string;
    tanggal_po: string;
    eta: string | Date;
    mata_uang: string;
    ppn: number;
    ongkir: number;
    dp: number;
    items: Record<string, any>[];
    [key: string]: any;
}

// Interface untuk props komponen
interface EditProps {
    purchaseOrder: any;
    purchaseRequests: any[];
    suppliers: any[];
    currencies: string[];
}

export default function Edit({ purchaseOrder, purchaseRequests = [], suppliers = [], currencies = [] }: EditProps) {
    const [poItems, setPoItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Initialize form data with purchase order data
    const { data, setData, put, processing, errors } = useForm<PurchaseOrderFormData>({
        id_purchase_request: purchaseOrder.id_purchase_request || '',
        id_supplier: purchaseOrder.id_supplier || '',
        tanggal_po: purchaseOrder.tanggal_po || new Date().toISOString().split('T')[0],
        eta: purchaseOrder.eta || new Date().toISOString().split('T')[0],
        mata_uang: purchaseOrder.mata_uang || 'IDR',
        ppn: purchaseOrder.ppn || 0,
        ongkir: purchaseOrder.ongkir || 0,
        dp: purchaseOrder.dp || 0,
        items: [],
    });

    // Track perubahan di Form-PO
    const handleFormChange = (fieldName: string, value: any) => {
        setData(fieldName, value);
    };

    // Initialize data on component mount
    useEffect(() => {
        console.log('purchaseOrder raw data:', purchaseOrder);

        // Format items for the table
        if (purchaseOrder.items && purchaseOrder.items.length > 0) {
            const formattedItems = purchaseOrder.items.map((item: any) => ({
                ...item,
                id: item.id, // Penting untuk update
                id_purchase_order: item.id_purchase_order,
                id_purchase_request_item: item.id_purchase_request_item,
                id_master_item: item.id_master_item,
                qty_po: parseFloat(item.qty_po), // Pastikan number
                id_satuan_po: item.id_satuan_po,
                qty_after_conversion: parseFloat(item.qty_after_conversion) || 0,
                harga_satuan: parseFloat(item.harga_satuan) || 0,
                diskon_satuan: parseFloat(item.diskon_satuan) || 0,
                jumlah: parseFloat(item.jumlah) || 0,
                remark_item_po: item.remark_item_po || '',

                // --- PERBAIKAN DISINI ---
                // Ambil dari snake_case (bawaan Laravel) jika camelCase tidak ada
                master_item: item.master_item || item.masterItem,
                satuan: item.satuan || item.unit, // Kadang relasi dinamakan unit atau satuan

                // Mapping purchaseRequestItem sangat krusial untuk Error no 2
                // Biasanya relasi di Laravel bernama purchase_request_item
                purchaseRequestItem: item.purchase_request_item || item.purchaseRequestItem,
                // Kita tambahkan juga key purchase_request_items agar kompatibel dengan tipe data Create jika perlu
                purchase_request_items: item.purchase_request_item || item.purchaseRequestItem,
            }));

            console.log('Formatted items (Fixed):', formattedItems);
            setPoItems(formattedItems);
            setData('items', formattedItems);
        }
    }, [purchaseOrder]);

    // Handler untuk submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (poItems.length === 0) {
            toast.error('Tidak ada item yang ditambahkan');
            return;
        }

        // Validasi semua item
        const invalidItems = poItems.filter((item) => !item.qty_po || !item.id_satuan_po);
        if (invalidItems.length > 0) {
            toast.error('Terdapat item yang belum lengkap');
            return;
        }

        // Format items untuk dikirim ke server
        const formattedItems = poItems.map((item) => ({
            id: item.id, // Include ID for existing items
            id_purchase_order: item.id_purchase_order,
            id_purchase_request_item: item.id_purchase_request_item,
            id_master_item: item.id_master_item,
            qty_po: item.qty_po,
            id_satuan_po: item.id_satuan_po,
            harga_satuan: item.harga_satuan,
            diskon_satuan: item.diskon_satuan || 0,
            jumlah: item.jumlah,
            remark_item_po: item.remark_item_po || '',
        }));

        // Final data to submit
        const finalData = {
            id_purchase_request: data.id_purchase_request,
            id_supplier: data.id_supplier,
            tanggal_po: data.tanggal_po,
            eta: data.eta,
            mata_uang: data.mata_uang,
            ppn: data.ppn,
            ongkir: data.ongkir,
            dp: data.dp,
            items: formattedItems,
        };

        console.log('Submitting data:', finalData);

        // Use put for update
        put(route('purchaseOrders.update', purchaseOrder.id), {
            ...finalData,
            onSuccess: () => {
                toast.success('Purchase Order berhasil diperbarui');
            },
            onError: (errors: any) => {
                console.error('Validation errors:', errors);
                toast.error('Gagal memperbarui Purchase Order');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Purchase Order" />

            <div className="container py-8">
                <h1 className="mb-6 text-2xl font-bold">Edit Purchase Order</h1>

                <form onSubmit={handleSubmit}>
                    {/* Form PO Component khusus untuk edit */}
                    <EditFormPO
                        data={data}
                        setData={handleFormChange}
                        errors={errors}
                        purchaseRequests={purchaseRequests}
                        suppliers={suppliers}
                        currencies={currencies}
                        purchaseOrder={purchaseOrder}
                    />

                    <div className="mb-6 flex justify-end">
                        <Button type="submit" disabled={processing || poItems.length === 0} className="ml-2">
                            {processing ? 'Memperbarui...' : 'Update Purchase Order'}
                        </Button>
                    </div>

                    {/* PR Items Component khusus untuk edit */}
                    {poItems.length > 0 && (
                        <EditPrItems
                            poItems={poItems}
                            setPoItems={(updatedItems) => {
                                setPoItems(updatedItems);
                                setData('items', updatedItems);
                            }}
                        />
                    )}
                </form>
            </div>
        </AppLayout>
    );
}

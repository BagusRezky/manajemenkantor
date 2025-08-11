/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PurchaseRequest, PurchaseRequestItem } from '@/types/purchaseRequest';
import { Supplier } from '@/types/supplier';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import FormPO from './components/form-po';
import PrItems from './components/pr-items';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase Order',
        href: '/purchaseOrders',
    },
    {
        title: 'Buat Purchase Order',
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
    items: Record<string, any>[]; // Gunakan Record<string, any>[] untuk array items
    [key: string]: any;
}

// Interface untuk props komponen
interface CreateProps {
    purchaseRequests: PurchaseRequest[];
    suppliers: Supplier[];
    currencies: string[];
}

export default function Create({ purchaseRequests = [], suppliers = [], currencies = [] }: CreateProps) {
    const [selectedPR, setSelectedPR] = useState<PurchaseRequest | null>(null);
    const [prItems, setPrItems] = useState<any[]>([]);
    const [poItems, setPoItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formChanged, setFormChanged] = useState(false);
    const { data, setData, post, processing, errors } = useForm<PurchaseOrderFormData>({
        id_purchase_request: '',
        id_supplier: '',
        tanggal_po: new Date().toISOString().split('T')[0],
        eta: new Date().toISOString().split('T')[0],
        mata_uang: 'IDR',
        ppn: 0,
        ongkir: 0,
        dp: 0,
        items: [],
    });

    // Track perubahan di Form-PO
    const handleFormChange = (fieldName: string, value: any) => {
        setData(fieldName, value);
        setFormChanged(true); // Tandai bahwa form telah berubah
    };

    // Handler untuk memilih PR dari dropdown
    const handlePRSelection = (prId: string) => {
        setData('id_purchase_request', prId);
        // Cari PR yang dipilih dari daftar
        const selectedRequest = purchaseRequests.find((pr) => pr.id === prId) || null;
        setSelectedPR(selectedRequest);
        // Reset poItems karena perlu klik Get Data lagi
        setPoItems([]);
    };

    // Handler untuk tombol Get Data
    const handleGetData = () => {
        if (!data.id_purchase_request) {
            toast.error('Pilih Purchase Request terlebih dahulu');
            return;
        }

        setLoading(true);

        // Tambahkan header Accept: application/json untuk memberi tahu server bahwa kita mengharapkan JSON
        fetch(route('purchaseOrders.getPurchaseRequestItems', [data.id_purchase_request, 'items']), {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest', // Ini juga membantu Laravel mengenali permintaan AJAX
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok (${response.status})`);
                }

                // Periksa Content-Type header untuk memastikan kita mendapatkan JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error(`Expected JSON response but got ${contentType}`);
                }

                return response.json();
            })
            .then((data) => {
                // Simpan data PR items
                const purchaseRequest = data.purchaseRequest;

                // Debug
                console.log('Received data:', data);

                if (!purchaseRequest) {
                    throw new Error('Invalid response format: missing purchaseRequest data');
                }

                setPrItems(purchaseRequest.purchase_request_items || []);

                // Inisialisasi poItems berdasarkan PR items
                const initialPoItems = (purchaseRequest.purchase_request_items || []).map((item: PurchaseRequestItem) => ({
                    id_purchase_request_item: item.id,
                    id_master_item: item.id_master_item,
                    qty_po: 0,
                    id_satuan_po: '',
                    harga_satuan: 0,
                    diskon_satuan: 0,
                    jumlah: 0,
                    remark_item_po: '',
                    // Data tambahan untuk UI
                    master_item: item.master_item,
                    purchase_request_items: item,
                }));

                setPoItems(initialPoItems);

                setData('items', initialPoItems);

                toast.success('Data berhasil dimuat');
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error(`Gagal memuat data PR: ${error.message}`);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Perbarui form data items saat poItems berubah
    useEffect(() => {
        if (poItems.length > 0) {
            setData('items', poItems);
        }
    }, [poItems]);

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
            id_purchase_request_item: item.id_purchase_request_item,
            id_master_item: item.id_master_item,
            qty_po: item.qty_po,
            id_satuan_po: item.id_satuan_po,
            harga_satuan: item.harga_satuan,
            diskon_satuan: item.diskon_satuan || 0,
            jumlah: item.jumlah,
            remark_item_po: item.remark_item_po || '',
        }));

        // Dapatkan current state terbaru dari form
        const currentFormData = {
            id_purchase_request: data.id_purchase_request,
            id_supplier: data.id_supplier,
            tanggal_po: data.tanggal_po,
            eta: data.eta,
            mata_uang: data.mata_uang,
            ppn: data.ppn,
            ongkir: data.ongkir,
            dp: data.dp,
        };

        // Log state saat ini untuk debugging
        console.log('Current form data:', currentFormData);
        console.log('Formatted items:', formattedItems);

        // PENTING: Update items array di form data final
        const finalData = {
            ...currentFormData,
            items: formattedItems,
        };

        // Then post the form data after updating the state
        // A small timeout ensures the state update is completed
        post(route('purchaseOrders.store'), {
            ...finalData,
            onSuccess: () => {
                toast.success('Purchase Order berhasil dibuat');
            },
            onError: (errors: any) => {
                console.error('Validation errors:', errors);
                toast.error('Gagal membuat Purchase Order');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Purchase Order" />

            <div className="container py-8">
                <h1 className="mb-6 text-2xl font-bold">Buat Purchase Order</h1>

                <form onSubmit={handleSubmit}>
                    {/* Form PO Component */}
                    <FormPO
                        data={data}
                        setData={handleFormChange}
                        errors={errors}
                        purchaseRequests={purchaseRequests}
                        suppliers={suppliers}
                        currencies={currencies}
                        handlePRSelection={handlePRSelection}
                        selectedPR={selectedPR}
                    />

                    <div className="mb-6 flex justify-end">
                        <Button type="button" onClick={handleGetData} disabled={!data.id_purchase_request || loading} className="mr-2">
                            {loading ? 'Loading...' : 'Get Data'}
                        </Button>
                        <Button type="submit" disabled={processing || poItems.length === 0}>
                            Simpan Purchase Order
                        </Button>
                    </div>

                    {/* PR Items Component - hanya tampilkan jika ada poItems */}
                    {poItems.length > 0 && (
                        <PrItems
                            poItems={poItems}
                            setPoItems={(updatedItems) => {
                                setPoItems(updatedItems);
                                // PENTING: Perbarui form data items saat poItems diupdate
                                setData('items', updatedItems);
                            }}
                        />
                    )}
                </form>
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CategoryItem } from '@/types/categoryItem';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import EditCategoryItemModal from './modal/edit-modal';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Category Items',
        href: '/categoryItems',
    },
];

export default function CategoryItems({ categoryItems }: { categoryItems: CategoryItem[] }) {
    const [data, setData] = useState<CategoryItem[]>([]);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [selectedCategoryItem, setSelectedCategoryItem] = useState<CategoryItem | null>(null);

    useEffect(() => {
        setData(categoryItems);
    }, [categoryItems]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Category Item" />
            <div className="mx-5 py-5">
                <DataTable columns={columns(() => {}, setEditModalOpen, setSelectedCategoryItem)} data={data} categoryItems={categoryItems} />
            </div>

            <EditCategoryItemModal isOpen={editModelOpen} onClose={() => setEditModalOpen(false)} categoryItem={selectedCategoryItem} />
        </AppLayout>
    );
}

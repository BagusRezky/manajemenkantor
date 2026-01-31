import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';
import { MasterCoaClass } from '@/types/masterCoaClass';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Master COA Class', href: '/masterCoaClasses' }];

export default function MasterCoaClassesIndex({ masterCoaClasses }: { masterCoaClasses: MasterCoaClass[] }) {
    const [data, setData] = useState<MasterCoaClass[]>([]);

    useEffect(() => {
        setData(masterCoaClasses);
    }, [masterCoaClasses]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master COA Class" />
            <div className="mx-5 py-5">
                <DataTable columns={columns()} data={data} />
            </div>
        </AppLayout>
    );
}

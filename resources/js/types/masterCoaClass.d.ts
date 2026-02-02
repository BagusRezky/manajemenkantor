import { Karyawan } from './karyawan';

export interface MasterCoaClass {
    id: string;
    id_karyawan: string;
    code: string;
    name: string;
    status: number; 
    karyawan?: Karyawan;
    created_at?: string;
    updated_at?: string;
}

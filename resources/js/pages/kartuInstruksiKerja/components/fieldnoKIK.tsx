/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';

type KartuInstruksiKerjaProps = {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    latestId?: number; // You'll need to pass the latest ID from your backend
};

const KartuInstruksiKerjaInput = ({ data, setData, errors, latestId = 1 }: KartuInstruksiKerjaProps) => {
    const [ikCode, setIkCode] = useState('10'); // Default value for IK code

    useEffect(() => {
        // Generate number when component mounts or IK code changes
        generateKartuNumber();
    }, [ikCode, latestId]);

    const generateKartuNumber = () => {
        // Get current date for MMYY part
        const date = new Date();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const mmyy = `${month}${year}`;

        // Format ID with leading zeros (5 digits)
        const formattedId = String(latestId).padStart(5, '0');

        // Create the complete card number
        const cardNumber = `${formattedId}/SPK-IK${ikCode}/${mmyy}`;

        // Update the form data
        setData('no_kartu_instruksi_kerja', cardNumber);
    };

    const handleIkCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIkCode(e.target.value);
    };

    return (
        <>
            {/* No Surat Perintah Kerja */}
            <div className="space-y-2">
                <Label htmlFor="no_kartu_instruksi_kerja">No. Surat Perintah Kerja</Label>
                <Input id="no_kartu_instruksi_kerja" name="no_kartu_instruksi_kerja" value={data.no_kartu_instruksi_kerja} readOnly />
                {errors.no_kartu_instruksi_kerja && <p className="text-sm text-red-500">{errors.no_kartu_instruksi_kerja}</p>}
            </div>

            {/* IK Code Input */}
            <div className="space-y-2">
                <Label htmlFor="ik_code">Kode IK</Label>
                <Input id="ik_code" name="ik_code" value={ikCode} onChange={handleIkCodeChange} placeholder="10" />
                <p className="text-xs text-gray-500">Masukkan kode untuk format SPK-IK[XX]</p>
            </div>
        </>
    );
};

export default KartuInstruksiKerjaInput;

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.5; }
        .header { text-align: center; border-bottom: 2px solid #444; margin-bottom: 20px; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { border: none; padding: 2px; font-size: 12px; }
        .main-table { width: 100%; border-collapse: collapse; }
        .main-table th { background-color: #f2f2f2; text-align: left; font-size: 12px; }
        .main-table td { border: 1px solid #eee; padding: 8px; font-size: 12px; }
        .section-title { background: #eee; font-weight: bold; padding: 5px 8px; }
        .total-row { background: #f9f9f9; font-weight: bold; font-size: 14px; }
        .footer { margin-top: 30px; text-align: right; font-size: 12px; }
        .text-red { color: #d9534f; }
    </style>
</head>
<body>
    <div class="header">
        <h1>SLIP GAJI KARYAWAN</h1>
        <p>Periode: {{ $bulan }} {{ $tahun }}</p>
    </div>

    <table class="info-table">
        <tr>
            <td width="15%">Nama</td><td>: {{ $karyawan->nama }}</td>
            <td width="15%">Hadir</td><td>: {{ $data['hadir'] }} Hari</td>
        </tr>
        <tr>
            <td>Jabatan</td><td>: {{ $karyawan->jabatan ?? '-' }}</td>
            <td>Izin/Cuti/Alpha</td><td>: {{ $data['total_izin'] }}/{{ $data['total_cuti'] }}/{{ $data['total_alpha'] }}</td>
        </tr>
    </table>

    <table class="main-table">
        <thead>
            <tr><th colspan="2" class="section-title">PENGHASILAN</th></tr>
        </thead>
        <tbody>
            <tr><td>Gaji Pokok</td><td>Rp {{ number_format($data['gaji_pokok'], 0, ',', '.') }}</td></tr>
            <tr><td>Tunjangan Kompetensi</td><td>Rp {{ number_format($data['tunj_kompetensi'], 0, ',', '.') }}</td></tr>
            <tr><td>Tunjangan Jabatan</td><td>Rp {{ number_format($data['tunj_jabatan'], 0, ',', '.') }}</td></tr>
            <tr><td>Tunjangan Intensif</td><td>Rp {{ number_format($data['tunj_intensif'], 0, ',', '.') }}</td></tr>
            <tr><td>Bonus</td><td>Rp {{ number_format($data['bonus'], 0, ',', '.') }}</td></tr>
        </tbody>
        <thead>
            <tr><th colspan="2" class="section-title">POTONGAN TUNJANGAN</th></tr>
        </thead>
        <tbody>
            <tr class="text-red"><td>Potongan Kompetensi</td><td>- Rp {{ number_format($data['pot_kompetensi'], 0, ',', '.') }}</td></tr>
            <tr class="text-red"><td>Potongan Jabatan</td><td>- Rp {{ number_format($data['pot_jabatan'], 0, ',', '.') }}</td></tr>
            <tr class="text-red"><td>Potongan Intensif</td><td>- Rp {{ number_format($data['pot_intensif'], 0, ',', '.') }}</td></tr>
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td style="text-align: right;">GAJI BERSIH (TAKE HOME PAY)</td>
                <td style="color: #2e7d32;">Rp {{ number_format($data['total_gaji'], 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="footer">
        <p>Dicetak pada: {{ date('d/m/Y') }}</p>
        <br><br>
        <p>HR</p>
    </div>
</body>
</html>

<table>
    {{-- Header Perusahaan --}}
    <tr>
        <td colspan="4"></td>
        <td colspan="5"><strong>CV. Indigama Khatulistiwa</strong></td>
        <td colspan="7"></td>
        <td colspan="3"><strong>JURNAL UMUM</strong></td>
    </tr>
    <tr>
        <td colspan="4"></td>
        <td colspan="5">Jurangpelem Satu, Bulusari, Kec. Gempol, Pasuruan, Jawa Timur 67155</td>
        <td colspan="7"></td>
        <td colspan="3">{{ \Carbon\Carbon::parse($startDate)->format('d/m/Y') }} s/d {{ \Carbon\Carbon::parse($endDate)->format('d/m/Y') }}</td>
    </tr>
    <tr>
        <td colspan="1">Email : indigama.khatulistiwa01@gmail.com</td>
    </tr>
    <tr>
        <td colspan="1">Telp. 08131361056</td>
    </tr>

    {{-- Spasi Kosong --}}
    <tr></tr>

    <tbody>
        @foreach($data as $accountGroup)
            {{-- Nama Akun yang sedang diproses --}}
            <tr style="background-color: #f0f7ff;">
                <td colspan="1" style="border: 1px solid #000; font-weight: bold;">AKUN:</td>
                <td colspan="3" style="border: 1px solid #000; font-weight: bold; color: #1d4ed8;">{{ $accountGroup['account_kode'] }}</td>
                <td colspan="15" style="border: 1px solid #000; font-weight: bold;">{{ $accountGroup['account_nama'] }}</td>
            </tr>

            {{-- Header Tabel Mutasi --}}
            <tr style="background-color: #e0e0e0;">
                <th style="border: 1px solid #000; font-weight: bold; text-align: center;">Tgl. Trans</th>
                <th colspan="3" style="border: 1px solid #000; font-weight: bold; text-align: center;">No. Bukti</th>
                <th colspan="5" style="border: 1px solid #000; font-weight: bold; text-align: center;">Keterangan</th>
                <th style="border: 1px solid #000; font-weight: bold; text-align: center;">Account</th>
                <th colspan="3" style="border: 1px solid #000; font-weight: bold; text-align: center;">Debet</th>
                <th colspan="3" style="border: 1px solid #000; font-weight: bold; text-align: center;">Kredit</th>
                <th colspan="3" style="border: 1px solid #000; font-weight: bold; text-align: center;">Saldo Kumulatif</th>
            </tr>

            {{-- Baris Saldo Awal --}}
            <tr>
                <td style="border: 1px solid #ccc; text-align: center;">{{ \Carbon\Carbon::parse($startDate)->format('d-M-Y') }}</td>
                <td colspan="3" style="border: 1px solid #ccc;">-</td>
                <td colspan="5" style="border: 1px solid #ccc; font-style: italic;">SALDO AWAL</td>
                <td style="border: 1px solid #ccc; text-align: center;">-</td>
                <td colspan="3" align="right" style="border: 1px solid #ccc;">{{ number_format($accountGroup['saldo_awal'], 2) }}</td>
                <td colspan="3" align="right" style="border: 1px solid #ccc;">0.00</td>
                <td colspan="3" align="right" style="border: 1px solid #ccc; font-weight: bold; background-color: #fafafa;">{{ number_format($accountGroup['saldo_awal'], 2) }}</td>
            </tr>

            @php
                $totalDebet = 0;
                $totalKredit = 0;
                $runningSaldo = $accountGroup['saldo_awal'];
            @endphp

            {{-- Detail Transaksi --}}
            @foreach($accountGroup['mutations'] as $m)
                @php
                    $debet = ($m->tipe == 'D') ? $m->nominal : 0;
                    $kredit = ($m->tipe == 'K') ? $m->nominal : 0;
                    $totalDebet += $debet;
                    $totalKredit += $kredit;
                    $runningSaldo += ($debet - $kredit);
                @endphp
                <tr>
                    <td style="border: 1px solid #ccc; text-align: center;">{{ \Carbon\Carbon::parse($m->tgl)->format('d-M-Y') }}</td>
                    <td colspan="3" style="border: 1px solid #ccc;">{{ $m->no_bukti }}</td>
                    <td colspan="5" style="border: 1px solid #ccc;">{{ $m->keterangan }}</td>
                    <td style="border: 1px solid #ccc; text-align: center;">{{ $m->lawan_akun ?? '-' }}</td>
                    <td colspan="3" align="right" style="border: 1px solid #ccc;">{{ number_format($debet, 2) }}</td>
                    <td colspan="3" align="right" style="border: 1px solid #ccc;">{{ number_format($kredit, 2) }}</td>
                    <td colspan="3" align="right" style="border: 1px solid #ccc; background-color: #fafafa;">{{ number_format($runningSaldo, 2) }}</td>
                </tr>
            @endforeach

            {{-- Footer per Akun --}}
            <tr style="font-weight: bold; background-color: #f9fafb;">
                <td colspan="9" style="border-top: 2px solid #000;"></td>
                <td style="border: 1px solid #000; text-align: center;">TOTAL MUTASI</td>
                <td colspan="3" align="right" style="border: 1px solid #000;">{{ number_format($totalDebet, 2) }}</td>
                <td colspan="3" align="right" style="border: 1px solid #000;">{{ number_format($totalKredit, 2) }}</td>
                <td colspan="3" style="border: 1px solid #000;"></td>
            </tr>

            <tr style="font-weight: bold; background-color: #f3f4f6;">
                <td colspan="9"></td>
                <td style="border: 1px solid #000; text-align: center; color: #b91c1c;">SALDO PER ACCOUNT</td>
                <td colspan="9" align="right" style="border: 1px solid #000; color: #1d4ed8; font-size: 12pt;">
                    {{ number_format($runningSaldo, 2) }}
                </td>
            </tr>

            {{-- Jarak antar Akun --}}
            <tr></tr>
            <tr></tr>
        @endforeach
    </tbody>
</table>

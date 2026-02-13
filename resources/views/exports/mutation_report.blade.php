<table>
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
        <td colspan="3">{{ $startDate }} s/d {{ $endDate }}</td>
    </tr>
    <tr>
        <td colspan="1">Email : indigama.khatulistiwa01@gmail.com</td>
    </tr>
    <tr>
        <td colspan="1">Telp. 08131361056</td>
    </tr>

    <tr></tr> <thead>
        <tr style="background-color: #e0e0e0;">
            <th style="border: 1px solid #000; font-weight: bold;">Tgl. Trans</th>
            <th colspan="3" style="border: 1px solid #000; font-weight: bold;">No. Bukti</th>
            <th colspan="5" style="border: 1px solid #000; font-weight: bold;">Keterangan</th>
            <th style="border: 1px solid #000; font-weight: bold;">Account</th>
            <th colspan="3" style="border: 1px solid #000; font-weight: bold;">Debet</th>
            <th colspan="3" style="border: 1px solid #000; font-weight: bold;">Kredit</th>
        </tr>
    </thead>

    <tbody>
        @foreach($data as $accountGroup)
            <tr>
                <td colspan="5"></td>
                <td style="font-weight: bold;">{{ $accountGroup['account_kode'] }}</td>
                <td colspan="4" style="font-weight: bold;">{{ $accountGroup['account_nama'] }}</td>
            </tr>

            <tr>
                <td>{{ \Carbon\Carbon::parse($startDate)->format('d-M-Y') }}</td>
                <td colspan="3"></td>
                <td colspan="5">Saldo awal</td>
                <td></td>
                <td colspan="3" align="right">{{ number_format($accountGroup['saldo_awal'], 2) }}</td>
                <td colspan="3" align="right">0.00</td>
            </tr>

            @php
                $totalDebet = 0;
                $totalKredit = 0;
            @endphp

            @foreach($accountGroup['mutations'] as $m)
                @php
                    $debet = ($m->tipe == 'D') ? $m->nominal : 0;
                    $kredit = ($m->tipe == 'K') ? $m->nominal : 0;
                    $totalDebet += $debet;
                    $totalKredit += $kredit;
                @endphp
                <tr>
                    <td>{{ \Carbon\Carbon::parse($m->tgl)->format('d-M-Y') }}</td>
                    <td colspan="3">{{ $m->no_bukti }}</td>
                    <td colspan="5">{{ $m->keterangan }}</td>
                    <td>{{ $m->lawan_akun }}</td>
                    <td colspan="3" align="right">{{ number_format($debet, 2) }}</td>
                    <td colspan="3" align="right">{{ number_format($kredit, 2) }}</td>
                </tr>
            @endforeach

            <tr style="font-weight: bold;">
                <td colspan="9"></td>
                <td>Total Mutasi</td>
                <td colspan="3" align="right">{{ number_format($totalDebet, 2) }}</td>
                <td colspan="3" align="right">{{ number_format($totalKredit, 2) }}</td>
            </tr>

            <tr style="font-weight: bold;">
                <td colspan="9"></td>
                <td>Saldo Per Account</td>
                <td colspan="3" align="right">{{ number_format($accountGroup['saldo_awal'] + $totalDebet - $totalKredit, 2) }}</td>
                <td colspan="3"></td>
            </tr>
            <tr></tr> @endforeach
    </tbody>
</table>

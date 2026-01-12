<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Slip Gaji</title>
</head>
<body style="font-family: sans-serif;">
    <p>Halo <strong>{{ $karyawan->nama }}</strong>,</p>

    <p>Berikut adalah slip gaji Anda untuk periode <strong>{{ $bulan }} {{ $tahun }}</strong>.</p>

    <p>Silakan periksa lampiran PDF untuk melihat rincian gaji Anda.</p>

    <br>
    <p>Terima kasih,</p>
    <p><strong>HR Department</strong></p>
</body>
</html>

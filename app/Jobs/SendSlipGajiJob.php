<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Bus\Dispatchable;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
use App\Mail\SlipGajiMail;

class SendSlipGajiJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $karyawan;
    public $bulan;
    public $tahun;
    public $dataGaji;

    /**
     * Create a new job instance.
     */
    public function __construct($karyawan, $bulan, $tahun, $dataGaji)
    {
        $this->karyawan = $karyawan;
        $this->bulan = $bulan;
        $this->tahun = $tahun;
        $this->dataGaji = $dataGaji;
    }


    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if (!$this->karyawan->user || !$this->karyawan->user->email) {
            return;
        }

        // Generate PDF slip gaji
        $pdf = Pdf::loadView('pdf.slip-gaji-pdf', [
            'karyawan' => $this->karyawan,
            'bulan' => $this->bulan,
            'tahun' => $this->tahun,
            'data' => $this->dataGaji,
        ])->output(); // hasil binary PDF

        // Kirim email
        Mail::to($this->karyawan->user->email)
            ->send(new SlipGajiMail($this->karyawan, $this->bulan, $this->tahun, $pdf));
    }
}

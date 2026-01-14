<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SlipGajiMail extends Mailable
{
    use Queueable, SerializesModels;

    public $karyawan;
    public $bulan;
    public $tahun;
    public $pdf;

    /**
     * Create a new message instance.
     */
   public function __construct($karyawan, $bulan, $tahun, $pdf)
    {
        $this->karyawan = $karyawan;
        $this->bulan = $bulan;
        $this->tahun = $tahun;
        $this->pdf = $pdf;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Slip Gaji ' . $this->bulan . ' ' . $this->tahun,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.slip-gaji',
            with: [
                'karyawan' => $this->karyawan,
                'bulan' => $this->bulan,
                'tahun' => $this->tahun,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [
            Attachment::fromData(fn () => $this->pdf, 'Slip-Gaji-' . $this->bulan . '-' . $this->tahun . '.pdf')
                ->withMime('application/pdf'),
        ];
    }
}

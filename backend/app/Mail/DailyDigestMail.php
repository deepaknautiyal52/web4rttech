<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class DailyDigestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Collection $renewals,
        public Collection $invoices,
        public Collection $followUps,
        public Collection $staleLeads,
        public Collection $tickets,
    ) {
    }

    public function build()
    {
        return $this->subject('Web4rtTech daily digest: '.today()->format('d M Y'))
            ->view('emails.daily-digest');
    }
}

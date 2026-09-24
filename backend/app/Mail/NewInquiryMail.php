<?php

namespace App\Mail;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewInquiryMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Contact $contact)
    {
    }

    public function build()
    {
        return $this->subject('New inquiry: '.$this->contact->subject)
            ->replyTo($this->contact->email, $this->contact->name)
            ->view('emails.new-inquiry');
    }
}

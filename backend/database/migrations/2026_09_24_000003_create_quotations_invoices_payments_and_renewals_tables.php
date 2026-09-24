<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->foreignId('contact_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('status')->default('draft'); // draft, sent, accepted, rejected
            $table->string('currency', 8)->default('INR');
            $table->json('items'); // [{description, quantity, unit_price}]
            $table->decimal('tax_rate', 5, 2)->default(18);
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->date('issue_date');
            $table->date('valid_until')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status')->default('draft'); // draft, sent, partially_paid, paid, cancelled (overdue is derived)
            $table->string('currency', 8)->default('INR');
            $table->json('items');
            $table->decimal('tax_rate', 5, 2)->default(18);
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->decimal('amount_paid', 12, 2)->default(0);
            $table->date('issue_date');
            $table->date('due_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::table('finance_entries', function (Blueprint $table) {
            $table->string('recurrence')->nullable()->after('notes'); // null (one-off), monthly, quarterly, yearly
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->date('paid_on');
            $table->string('method')->nullable(); // bank transfer, UPI, card, cash...
            $table->string('reference')->nullable();
            $table->foreignId('finance_entry_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('renewals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete(); // null = our own asset
            $table->string('type'); // domain, hosting, ssl, amc, other
            $table->string('name');
            $table->string('provider')->nullable();
            $table->decimal('cost', 12, 2)->nullable(); // what it costs us
            $table->decimal('price', 12, 2)->nullable(); // what we charge the client
            $table->string('currency', 8)->default('INR');
            $table->string('billing_cycle')->default('yearly'); // monthly, quarterly, yearly
            $table->date('expiry_date');
            $table->boolean('auto_renew')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('renewals');
        Schema::dropIfExists('payments');
        Schema::table('finance_entries', function (Blueprint $table) {
            $table->dropColumn('recurrence');
        });
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('quotations');
    }
};

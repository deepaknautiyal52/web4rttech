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
        Schema::create('finance_entries', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['expense', 'income']);
            $table->string('category'); // domain, hosting, salary, sale, other
            $table->string('title');
            $table->string('party_name')->nullable(); // vendor/provider, employee, or client name
            $table->decimal('amount', 12, 2);
            $table->string('currency', 8)->default('INR');
            $table->date('period_start');
            $table->date('period_end')->nullable();
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
        Schema::dropIfExists('finance_entries');
    }
};

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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // primary contact person
            $table->string('company')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('website')->nullable();
            $table->string('gst_number', 30)->nullable();
            $table->text('billing_address')->nullable();
            $table->string('status')->default('active'); // active, inactive
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('designation')->nullable();
            $table->decimal('monthly_salary', 12, 2)->nullable();
            $table->decimal('hourly_cost', 10, 2)->nullable(); // used for project labour cost
            $table->string('currency', 8)->default('INR');
            $table->date('joined_on')->nullable();
            $table->string('status')->default('active'); // active, inactive
            $table->timestamps();
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->foreignId('client_id')->nullable()->after('won_at')->constrained()->nullOnDelete();
            $table->date('next_follow_up_at')->nullable()->after('client_id');
            $table->string('lost_reason')->nullable()->after('next_follow_up_at');
        });

        Schema::create('contact_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type')->default('note'); // note, call, email, meeting
            $table->text('body');
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('service_id')->nullable(); // id from src/data/services.js
            $table->string('status')->default('planning'); // planning, in_progress, review, delivered, maintenance, on_hold
            $table->date('start_date')->nullable();
            $table->date('deadline')->nullable();
            $table->decimal('budget', 12, 2)->nullable();
            $table->decimal('other_costs', 12, 2)->nullable(); // non-labour costs (licences, freelancers...)
            $table->string('currency', 8)->default('INR');
            $table->foreignId('employee_id')->nullable()->constrained()->nullOnDelete(); // project lead
            $table->text('description')->nullable();
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
        Schema::dropIfExists('projects');
        Schema::dropIfExists('contact_activities');
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('client_id');
            $table->dropColumn(['next_follow_up_at', 'lost_reason']);
        });
        Schema::dropIfExists('employees');
        Schema::dropIfExists('clients');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
        Schema::create('timesheets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->date('work_date');
            $table->decimal('hours', 5, 2);
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained()->nullOnDelete(); // assignee
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('priority')->default('medium'); // low, medium, high, urgent
            $table->string('status')->default('open'); // open, in_progress, waiting, resolved, closed
            $table->timestamp('due_at')->nullable(); // SLA deadline, set from priority
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });

        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('excerpt', 500)->nullable();
            $table->longText('body');
            $table->boolean('is_published')->default(true);
            $table->date('published_at')->nullable();
            $table->timestamps();
        });

        // Carry over the articles that used to be hardcoded in the frontend.
        $now = now();
        $articles = [
            [
                'slug' => 'ai-first-delivery',
                'title' => 'Web4rtTech Launches AI-First Delivery Framework',
                'excerpt' => 'A new approach to project delivery that embeds AI-assisted engineering across every stage.',
                'body' => 'Web4rtTech announced a new AI-first delivery framework designed to embed applied AI and automation across every stage of a project. The framework emphasizes faster iteration, higher code quality, and closer collaboration between engineering and design teams.',
            ],
            [
                'slug' => 'cloud-fabric',
                'title' => 'Web4rtTech Cloud Fabric™ Now Live',
                'excerpt' => 'A composable stack of cloud services and connectors built to accelerate enterprise migrations.',
                'body' => 'Cloud Fabric is a composable stack of cloud services, connectors, and reusable components built to accelerate enterprise cloud migrations. It allows organizations to combine pre-built modules to speed up deployments and reduce time-to-value.',
            ],
            [
                'slug' => 'innovations-2025',
                'title' => 'New Innovations in Tech',
                'excerpt' => "Discover how we're driving innovation and digital excellence for growing enterprises.",
                'body' => 'Web4rtTech continues to invest in research and experimentation, pushing boundaries in cloud-native architectures, AI, and sustainability-focused solutions to help clients navigate their next.',
            ],
        ];

        foreach ($articles as $article) {
            DB::table('articles')->insert($article + [
                'is_published' => true,
                'published_at' => $now->toDateString(),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('articles');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('timesheets');
    }
};

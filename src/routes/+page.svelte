<script lang="ts">
	import Synaptica from '$lib/img/synaptica.png';
	import Practice from '$lib/img/practice.png';
	import Webapp from '$lib/img/webapp.png';
	import Phone from '$lib/img/phone.png';
	import Exams from '$lib/img/exams.png';
	import Quiz from '$lib/img/quiz.png';
	import Flashcards from '$lib/img/flashcards.png';
</script>

<nav class="sticky top-0 z-50 w-full border-b bg-white/80 px-4 py-4 backdrop-blur-lg md:px-8">
	<div class="mx-auto flex max-w-7xl items-center justify-between">
		<div class="flex items-center space-x-3">
			<img src="/logo.svg" alt="Synapsis logo" class="h-10 w-10 rounded-xl" />
			<span class="text-2xl font-bold text-gray-800">Synapsis</span>
		</div>

		<div class="flex items-center space-x-6">
			<a
				href="/signin"
				class="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">Sign In</a
			>
			<a
				href="/signup"
				class="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
				>Sign Up</a
			>
		</div>
	</div>
</nav>

<header class="bg-gradient-to-br from-blue-50 to-indigo-100">
	<div
		class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8"
	>
		<h1
			class="mb-6 max-w-3xl text-5xl font-extrabold leading-tight text-gray-900 sm:text-6xl lg:text-7xl"
		>
			Make learning <span class="text-blue-600">fun</span> and
			<span class="text-indigo-600">effective</span>
		</h1>

		<p class="mb-10 max-w-2xl text-xl text-gray-600 sm:text-2xl">
			Synapsis helps you learn and retain information through interactive and engaging methods.
		</p>

		<a
			href="/signup"
			class="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition duration-300 ease-out hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600"
		>
			<span
				class="absolute right-0 translate-x-full transition-transform duration-300 ease-out group-hover:-translate-x-4"
			>
				<svg
					class="h-5 w-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 7l5 5m0 0l-5 5m5-5H6"
					></path></svg
				>
			</span>
			<span class="transition-all duration-300 ease-out group-hover:mr-4">Get Started</span>
		</a>
	</div>
</header>

<section class="py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="mb-12 text-center text-4xl font-bold text-gray-900 sm:text-5xl">
			Why Choose Synapsis?
		</h2>
		<p class="mx-auto mb-16 max-w-3xl text-center text-xl text-gray-600">
			Synapsis offers a variety of features designed to enhance your learning experience and improve
			information retention.
		</p>

		<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
			<div class="rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
				<!-- <img src="/images/feature-1.svg" alt="" class="mx-auto mb-6 h-24 w-24" /> -->
				<h3 class="mb-4 text-2xl font-bold text-gray-900">Interactive Flashcards</h3>
				<p class="text-gray-600">
					Create and study with dynamic flashcards to memorize information quickly and effectively.
				</p>
			</div>

			<div class="rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
				<!-- <img src="/images/feature-2.svg" alt="" class="mx-auto mb-6 h-24 w-24" /> -->
				<h3 class="mb-4 text-2xl font-bold text-gray-900">Adaptive Quizzes</h3>
				<p class="text-gray-600">
					Test your knowledge with personalized quizzes that adapt to your learning progress.
				</p>
			</div>

			<div class="rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
				<!-- <img src="/images/feature-3.svg" alt="" class="mx-auto mb-6 h-24 w-24" /> -->
				<h3 class="mb-4 text-2xl font-bold text-gray-900">Gamified Learning</h3>
				<p class="text-gray-600">
					Earn XP, unlock achievements, and climb the leaderboard as you learn and improve.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="bg-gray-100 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="mb-12 text-center text-4xl font-bold text-gray-900 sm:text-5xl">
			Meet Synaptica - A <span class="text-primary">based</span> Study Buddy
		</h2>

		<img src={Synaptica} alt="Synaptica" class="mx-auto mb-12 max-w-full rounded-xl shadow-xl" />

		<p class="mx-auto max-w-3xl text-center text-xl text-gray-600">
			Synaptica is your AI-powered study buddy, always ready to assist you in learning and retaining
			information through engaging and interactive methods.
		</p>
	</div>
</section>

<section class="py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="mb-12 text-center text-4xl font-bold text-gray-900 sm:text-5xl">
			Practice Makes Perfect
		</h2>

		<img src={Practice} alt="Practice" class="mx-auto mb-12 max-w-full rounded-xl shadow-xl" />

		<p class="mx-auto max-w-3xl text-center text-xl text-gray-600">
			Track your progress and see how you improve over time through consistent practice with quizzes
			and flashcards.
		</p>
	</div>
</section>

<section class="bg-gradient-to-br from-indigo-50 to-blue-100 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="mb-12 text-center text-4xl font-bold text-gray-900 sm:text-5xl">
			Learn Anytime, Anywhere
		</h2>

		<div class="mb-12 overflow-hidden rounded-xl bg-white shadow-xl">
			<img src={Webapp} alt="Web App" class="w-full" />
		</div>

		<div class="mx-auto mb-12 max-w-sm overflow-hidden rounded-[3rem] bg-gray-800 shadow-xl">
			<div class="h-8 bg-gray-900"></div>
			<img src={Phone} alt="Mobile App" class="w-full" />
		</div>

		<p class="mx-auto max-w-3xl text-center text-xl text-gray-600">
			Access Synapsis on your phone, tablet, or computer. Seamlessly continue your learning journey
			across all devices.
		</p>
	</div>
</section>

<section class="py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="mb-12 text-center text-4xl font-bold text-gray-900 sm:text-5xl">
			Ace Your Exams with Confidence
		</h2>

		<p class="mx-auto mb-12 max-w-3xl text-center text-xl text-gray-600">
			Get a comprehensive overview of your study progress and identify areas that need more
			attention.
		</p>

		<img src={Exams} alt="Exam Overview" class="mx-auto max-w-full rounded-xl shadow-xl" />
	</div>
</section>

<section class="bg-gray-100 py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="mb-12 text-center text-4xl font-bold text-gray-900 sm:text-5xl">
			Effortless Note Digitization
		</h2>

		<p class="mx-auto mb-12 max-w-3xl text-center text-xl text-gray-600">
			Transform your handwritten notes into digital format with our AI-powered OCR technology. Save
			time and reduce errors in the process.
		</p>

		<img src={Exams} alt="OCR Scanning" class="mx-auto max-w-full rounded-xl shadow-xl" />
	</div>
</section>

<section class="py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="mb-12 text-center text-4xl font-bold text-gray-900 sm:text-5xl">
			AI-Generated Learning Materials
		</h2>

		<p class="mx-auto mb-12 max-w-3xl text-center text-xl text-gray-600">
			Benefit from personalized quizzes and flashcards created by our advanced AI. Tailor your
			learning experience to your specific needs.
		</p>

		<div class="grid gap-8 sm:grid-cols-2">
			<img src={Quiz} alt="Quizzes" class="rounded-xl shadow-xl" />
			<img src={Flashcards} alt="Flashcards" class="rounded-xl shadow-xl" />
		</div>
	</div>
</section>

<footer class="bg-gray-900 py-12 text-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
			<div>
				<h3 class="mb-4 text-lg font-semibold">Synapsis</h3>
				<p class="text-gray-400">Making learning fun and effective.</p>
			</div>
			<div>
				<h3 class="mb-4 text-lg font-semibold">Quick Links</h3>
				<ul class="space-y-2">
					<li><a href="#" class="text-gray-400 hover:text-white">Home</a></li>
					<li><a href="#" class="text-gray-400 hover:text-white">Features</a></li>
					<li><a href="#" class="text-gray-400 hover:text-white">Pricing</a></li>
					<li><a href="#" class="text-gray-400 hover:text-white">Contact</a></li>
				</ul>
			</div>
			<div>
				<h3 class="mb-4 text-lg font-semibold">Legal</h3>
				<ul class="space-y-2">
					<li><a href="#" class="text-gray-400 hover:text-white">Privacy Policy</a></li>
					<li><a href="#" class="text-gray-400 hover:text-white">Terms of Service</a></li>
				</ul>
			</div>
			<div>
				<h3 class="mb-4 text-lg font-semibold">Connect</h3>
				<ul class="space-y-2">
					<li><a href="#" class="text-gray-400 hover:text-white">Twitter</a></li>
					<li><a href="#" class="text-gray-400 hover:text-white">Facebook</a></li>
					<li><a href="#" class="text-gray-400 hover:text-white">Instagram</a></li>
				</ul>
			</div>
		</div>
		<div class="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
			© 2024 Synapsis. All rights reserved.
		</div>
	</div>
</footer>

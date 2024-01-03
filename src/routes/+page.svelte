<script lang="ts">
    import comicBookImage from '../assets/images/home_comic_img.png';
</script>

<div class="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto p-4 h-screen">
    <div class="lg:flex-1 px-4 py-2 text-left">
        <h1 class="text-6xl pb-10">LingoComics</h1>
        <p class="text-2xl pb-10">Start your language learning journey with a new interactive way</p>
        <a href="/scenario" class="btn custom-btn-bg shadow text-2xl px-10 w-1/2 hover:bg-transparent hover:text-black">Start</a>
    </div>
    <div class="lg:flex-1 px-4 py-2 text-center">
        <img src={comicBookImage} alt="comic book" class="max-w-full h-auto" />
    </div>
</div>
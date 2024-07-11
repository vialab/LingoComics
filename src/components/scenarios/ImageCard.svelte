<script lang="ts">
    export let image : string = "";
    export let scenario : string = "";
    export let route: string = "";
    export let imageTitle : string = "";
    export let btnText : string = "";
</script>

<div class="scenario-card flex-none w-full sm:w-1/2 md:w-2/3 lg:w-2/4 xl:w-auto h-[30rem] overflow-hidden rounded-lg bg-black relative">
    <img src={image} alt={scenario} class="w-full h-full object-cover" />
    <div class="absolute inset-0" style="background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.95) 90%);"></div>
    <div class="p-4 absolute bottom-0 left-0 right-0 flex flex-col justify-center items-center gap-5">
        <h2 class="text-2xl text-white text-center">{ imageTitle }</h2>
        <a href="{route}" class="btn custom-btn-bg text-black text-2xl w-[10rem] shadow-sm hover:bg-transparent hover:text-white">{ btnText }</a>
    </div>
    <span class="fold"></span>
</div>
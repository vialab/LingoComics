<div class="scenario-page">
    <div class="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto p-3 gap-3 p-container">
        <!-- left side -->
        <div class="w-full h-full left-side flex-items-center justify-center">
            <div class="p-3 bg-gray-100 rounded-lg left-side-content relative">
                <div class="rounded-lg w-[500px] skeleton bg-white"></div>
            </div>
        </div>

        <!-- right side -->
        <div class="w-full right-side h-full flex flex-col flex-grow">
            <div class="bg-gray-100 right-side-content rounded-lg p-3 flex flex-col flex-grow justify-between">
                <div class="upper-content">
                    <hr />
                    <div class="flex flex-col gap-5 py-2">
                        {#each { length: 3 } as _, i}
                            <div class="skeleton w-full bg-white h-16"></div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .scenario-page {
        overflow-y: scroll;
        height: calc(100vh - 80px);
    }
    .p-container {
        height: 85%;
    }
    .left-side {
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .right-side {
        width: 40%;
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .left-side-content {
        flex-grow: 1;
    }
    img {
        height: 100%;
    }
    .right-side-content {
        flex-grow: 1;
    }
    .selected {
        background-color: #fa745955;
    }
    .btn {
        display: block;
        font-weight: 400;
        width: 100%;
        text-align: left;
    }
</style>
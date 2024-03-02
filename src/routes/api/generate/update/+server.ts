export const PUT = async ({ request }) => {
    const body = await request.json();
    
    console.log('update', body);

    const { updateType, editText, story } = body;

    // set the edited text to update type for story structure
    story[updateType] = editText;
    console.log('updating characteristic:', story);

    try {
        // update story

        return new Response(JSON.stringify({ "data": "success" }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "data": "error generation scenario" }), { status: 500 });
    }
}
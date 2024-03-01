export const PUT = async ({ request }) => {
    const body = await request.json();
    
    console.log('update', body);

    const { updateType, editText, story } = body;

    try {
        // 

        return new Response(JSON.stringify({ "data": "success" }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ "data": "error generation scenario" }), { status: 500 });
    }
}
# LingoComics

AI-generated comic-style story-based language learning application designed with tablet devices in mind. 

#
### Technology stack
- SvelteKit web application framework
- Firebase
  - Scenario Storage
- OpenAI API
  - Image Generation
  - Text Generation
- Google Cloud Storage
  - Image Storage

## How to Use
1. `git clone` the repository onto local machine
2. `cd` into `lingocomics/` and run `npm install`
3. In the directory's root (same location of `src/` file) make an `.env` file with the following configuration:

```
OPENAI_API_KEY=""
GOOGLE_API_KEY="./apiKey.json"
```

* The Google API key must be a `.json` file in the project folder's directory.
To create a Google API key, you must have a Google cloud account, create a project with the `Cloud Storage API` enabled and retrieve your personal API key file like so.

* The OpenAI API key must be retrieved by creating an OpenAI account, creating your API key from the API section of the website, and filling out the `.env` appropriately.

4. After all the configurations have been set up, you can run the app with the following command: `npm run dev -- --open`

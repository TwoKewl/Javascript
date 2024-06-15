
module.exports = {
    "description": "Fetches a funny joke. (this was used for testing async stuff)",
    "adminRequired": false,
    "category": "fun",
    "callback": async function(args, context) {
        const joke = await fetch('https://v2.jokeapi.dev/joke/Programming?blacklistFlags=religious,political,racist,sexist,explicit');
        const jokeJson = await joke.json();

        if (jokeJson.type == 'single') {
            console.log(jokeJson.joke);
        } else {
            console.log(jokeJson.setup);
            console.log(jokeJson.delivery);
        }
    }
}
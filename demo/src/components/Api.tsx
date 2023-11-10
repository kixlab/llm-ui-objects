import { GenerationProps } from "llm-ui-objects";

var key: { value: string } = { value: "" };

const generate = (system: string, input: string | string[], parameters: any) => {
    var url = "https://api.openai.com/v1/chat/completions";
    var bearer = 'Bearer ' + key.value;

    if(typeof input === 'string') input = [input];

    const promises: Promise<string>[] = [];
    
    input.forEach((item) => {
        promises.push(new Promise<string>((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...parameters,
                    "messages": [
                        {
                            "role": "system",
                            "content": system
                        },
                        {
                            "role": "user",
                            "content": item
                        }
                    ]
                })
            })
            .then(response => response.json())
            .then(data => {
                resolve(data.choices[0].message.content);
            })
            .catch((error) => {
                reject(error);
            });
        }));
    });

    return Promise.all(promises);
};

const getPositions = async (generations: GenerationProps[]) => {
    var url = "https://api.openai.com/v1/embeddings";
    var bearer = 'Bearer ' + key.value;

    if(generations.length === 0) return Promise.resolve([]);

    const result = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "input": generations.map((generation) => generation.content),
            "model": "text-embedding-ada-002",
            "encoding_format": "float"
        })
    })
    .then(response => response.json())
    .then(response => {
        var embeddingsList = response.data.map((item: any) => item.embedding);
        var positions = embeddingsList.map((item: any) => {
            var averageFirstHalf = item.slice(0, item.length / 2).reduce((a: any, b: any) => a + b) / (item.length / 2);
            var averageSecondHalf = item.slice(item.length / 2, item.length).reduce((a: any, b: any) => a + b) / (item.length / 2);
            return {x: averageFirstHalf, y: averageSecondHalf};
        });
        return positions;
    })
    .catch((error) => {
        console.error(error);
        return [];
    });

    return result;
}

const getRatings = (generations: GenerationProps[]) => {
    const prompt = `You are a helpful and precise assistant that can check the quality of writing by another AI assistant. You should evaluate how well a piece of writing satisfies a set of quality criteria. For each criterion, provide a one sentence explanation on how the writing satisfies the criterion and then provide a score out of 20 for that criterion. You should return your final answer as a valid JSON object.

    [The Start of Criteira]
    Creative: The writing is creative and original. It should include novel ideas and concepts.
    Simple: The writing is simple and easy to understand. It should be able to be understood by a wide audience.
    Positive: The writing is positive and uplifting. It should be able to make the reader feel good.
    Concise: The writing is concise and to the point. It should be able to convey its message in a short amount of time.
    Implicit: The writing is implicit and leaves room for interpretation. It should be able to be interpreted in multiple ways.
    [The End of Criteria]

    When returning your response, first output the token "$$$ANSWER$$$" and then output your answer as a valid JSON object of the following format:
    {"Creative": {"explanation": <one sentence explanation of how well the writing satisfies the criterion>, "score": <the writing's score on the criterion>}, "Simple": {"explanation": <explanation>, "score": <score>}, "Positive": {"explanation": <explanation>, "score": <score>}, "Concise": {"explanation": <explanation>, "score": <score>}, "Implicit": {"explanation": <explanation>, "score": <score>}}`;

    return generate(prompt, generations.map((item) => item.content), {
        "model": "gpt-3.5-turbo",
        "temperature": 0.3,
        "max_tokens": 256
    }).then((response) => {
        var answers = response.map((item) => {
            var answer = JSON.parse(item.split("$$$ANSWER$$$")[1]);
            var ratings: {[key: string]: number} = {};
            Object.keys(answer).forEach((key) => {
                ratings[key] = answer[key].score / 20;
            });
            return ratings;
        });
        return answers;
    });
}

export { key, generate, getPositions, getRatings };

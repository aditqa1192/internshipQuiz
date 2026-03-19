const questions = [
    {
        id: 1,
        question: "What does 'LLM' stand for in the context of Generative AI?",
        options: [
            "Large Language Model",
            "Linear Learning Machine",
            "Logical Language Module",
            "Layered Learning Model",
        ],
        correctAnswers: [0],
        type: "single",
    },
    {
        id: 2,
        question:
            "Which of the following is a popular large language model developed by OpenAI?",
        options: ["BERT", "GPT-4", "LLaMA", "PaLM"],
        correctAnswers: [1],
        type: "single",
    },
    {
        id: 3,
        question:
            "What is 'prompt engineering' in the context of Generative AI?",
        options: [
            "Building hardware for AI systems",
            "Crafting effective input instructions to get desired AI outputs",
            "Engineering the physical prompt screens",
            "Designing database queries for AI",
        ],
        correctAnswers: [1],
        type: "single",
    },
    {
        id: 4,
        question:
            "Which architecture is the foundation of most modern large language models?",
        options: [
            "Recurrent Neural Network (RNN)",
            "Convolutional Neural Network (CNN)",
            "Transformer",
            "Generative Adversarial Network (GAN)",
        ],
        correctAnswers: [2],
        type: "single",
    },
    {
        id: 5,
        question: "What does RAG stand for in Generative AI?",
        options: [
            "Random Access Generation",
            "Retrieval-Augmented Generation",
            "Recursive Algorithm Generation",
            "Rapid AI Gateway",
        ],
        correctAnswers: [1],
        type: "single",
    },
    {
        id: 6,
        question:
            "Which of the following are common use cases of Generative AI? (Select all that apply)",
        options: [
            "Code generation and assistance",
            "Text summarization",
            "Image generation from text prompts",
            "All of the above",
        ],
        correctAnswers: [3],
        type: "single",
    },
    {
        id: 7,
        question:
            "What is 'hallucination' in the context of large language models?",
        options: [
            "The model generating visually appealing images",
            "The model producing confident but factually incorrect information",
            "The model running out of memory",
            "The model refusing to answer questions",
        ],
        correctAnswers: [1],
        type: "single",
    },
    {
        id: 8,
        question: "What is 'fine-tuning' in machine learning?",
        options: [
            "Training a model from scratch on a large dataset",
            "Adapting a pre-trained model to a specific task using a smaller dataset",
            "Reducing the size of a model",
            "Testing a model on unseen data",
        ],
        correctAnswers: [1],
        type: "single",
    },
    {
        id: 9,
        question:
            "Which of the following techniques help reduce hallucinations in LLMs? (Select all that apply)",
        options: [
            "Retrieval-Augmented Generation (RAG)",
            "Providing more context in the prompt",
            "Using a larger font size",
            "Grounding responses with source documents",
        ],
        correctAnswers: [0, 1, 3],
        type: "multiple",
    },
    {
        id: 10,
        question: "What is a 'token' in the context of LLMs?",
        options: [
            "A physical authentication device",
            "A unit of text (word, subword, or character) processed by the model",
            "A type of cryptocurrency",
            "A software license key",
        ],
        correctAnswers: [1],
        type: "single",
    },
    {
        id: 11,
        question:
            "Which company developed the 'Gemini' family of AI models?",
        options: ["OpenAI", "Meta", "Google DeepMind", "Anthropic"],
        correctAnswers: [2],
        type: "single",
    },
    {
        id: 12,
        question: "What is the 'temperature' parameter in LLM generation?",
        options: [
            "The physical temperature of the GPU",
            "A parameter controlling the randomness/creativity of the output",
            "The speed at which the model generates text",
            "The number of tokens in the output",
        ],
        correctAnswers: [1],
        type: "single",
    },
    {
        id: 13,
        question:
            "Which of the following are valid approaches to interact with an LLM? (Select all that apply)",
        options: [
            "Zero-shot prompting",
            "Few-shot prompting",
            "Chain-of-thought prompting",
            "All of the above",
        ],
        correctAnswers: [3],
        type: "single",
    },
    {
        id: 14,
        question: "What does 'AI Ethics' primarily focus on?",
        options: [
            "Making AI models faster",
            "Ensuring AI systems are fair, transparent, and responsible",
            "Reducing the cost of AI training",
            "Increasing the number of parameters in models",
        ],
        correctAnswers: [1],
        type: "single",
    },
    {
        id: 15,
        question:
            "Which of the following are components of a Transformer architecture? (Select all that apply)",
        options: [
            "Self-attention mechanism",
            "Positional encoding",
            "Feed-forward neural network",
            "Convolutional filters",
        ],
        correctAnswers: [0, 1, 2],
        type: "multiple",
    },
];

export default questions;

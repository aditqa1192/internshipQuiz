const questions = [
    {
        id: 1,
        question: "Which component of a GAN is responsible for creating synthetic data that looks like the training data?",
        options: ["The Discriminator", "The Generator", "The Transformer", "The Encoder"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 2,
        question: "In the context of LLMs, what does 'Temperature' control?",
        options: ["Processing speed", "Model size", "Randomness and creativity of the output", "The number of tokens per second"],
        correctAnswers: [2],
        type: "single"
    },
    {
        id: 3,
        question: "What is the primary benefit of 'Retrieval-Augmented Generation' (RAG)?",
        options: ["It makes the model faster", "It allows the model to access up-to-date or private information without retraining", "It reduces the cost of GPU training", "It increases the number of parameters in the model"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 4,
        question: "Which mechanism allows a Transformer model to focus on different parts of an input sequence simultaneously?",
        options: ["Recurrence", "Backpropagation", "Self-Attention", "Convolution"],
        correctAnswers: [2],
        type: "single"
    },
    {
        id: 5,
        question: "What is a 'Hallucination' in Generative AI?",
        options: ["A hardware failure", "When the model generates confident but incorrect or nonsensical information", "When the model refuses to answer a prompt", "A type of data encryption"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 6,
        question: "Which of these is a common method for fine-tuning large models using very few resources?",
        options: ["LoRA (Low-Rank Adaptation)", "Full Parameter Tuning", "Zero-shot Learning", "Data Augmentation"],
        correctAnswers: [0],
        type: "single"
    },
    {
        id: 7,
        question: "What happens during 'Tokenization' in NLP?",
        options: ["The model is compressed", "Text is converted into numerical units like words or sub-words", "The model weights are updated", "Images are converted into text"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 8,
        question: "In Diffusion models, what is the process of removing noise from an image called?",
        options: ["Forward Diffusion", "Reverse Diffusion (Denoising)", "Encoding", "Latent Mapping"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 9,
        question: "Which model architecture is known for being 'bidirectional'?",
        options: ["GPT", "BERT", "Llama", "Claude"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 10,
        question: "What does 'Zero-shot prompting' refer to?",
        options: ["Training a model with zero data", "Asking a model to perform a task without providing any examples in the prompt", "A model that has zero parameters", "Deleting the prompt after use"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 11,
        question: "In a Transformer, what is the purpose of 'Positional Encoding'?",
        options: ["To reduce the model's memory usage", "To give the model information about the order of words in a sentence", "To encrypt the input data", "To normalize the weight distribution"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 12,
        question: "Which of the following is an ethical concern specific to Generative AI?",
        options: ["Deepfakes and misinformation", "High electricity usage", "Slow internet speeds", "Lack of keyboard shortcuts"],
        correctAnswers: [0],
        type: "single"
    },
    {
        id: 13,
        question: "What is 'Chain-of-Thought' prompting?",
        options: ["Connecting multiple LLMs together", "Encouraging the model to explain its reasoning step-by-step", "Limiting the model's response to one word", "Using a chain of GPUs for inference"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 14,
        question: "What does 'RLHF' stand for in the context of training LLMs?",
        options: ["Rapid Learning High Frequency", "Reinforcement Learning from Human Feedback", "Random Linear Hyper-Filtering", "Real-time Logical Hierarchical Flow"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 15,
        question: "Which data structure is most commonly used to store information for RAG systems?",
        options: ["SQL Database", "CSV File", "Vector Database", "JSON Object"],
        correctAnswers: [2],
        type: "single"
    },
    {
        id: 16,
        question: "What does the 'CIA Triad' stand for in security?",
        options: ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Control, Identification, Authentication", "Cyber, Information, Access"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 17,
        question: "Which type of attack involves an attacker sitting between two parties to eavesdrop or modify communication?",
        options: ["DDoS", "SQL Injection", "Man-in-the-Middle (MITM)", "Brute Force"],
        correctAnswers: [2],
        type: "single"
    },
    {
        id: 18,
        question: "What is the primary difference between a 'Virus' and a 'Worm'?",
        options: ["A virus is hardware-based", "A worm can self-replicate and spread without human action", "A virus is always harmless", "There is no difference"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 19,
        question: "What is 'Phishing'?",
        options: ["Testing a network's speed", "Searching for bugs in code", "Fraudulent attempts to obtain sensitive info via email/messages", "Scanning for open ports"],
        correctAnswers: [2],
        type: "single"
    },
    {
        id: 20,
        question: "In encryption, what is a 'Salt' used for?",
        options: ["To speed up the encryption process", "To add random data to a password before hashing", "To compress the data", "To make the data readable to the public"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 21,
        question: "What is a 'Zero-day vulnerability'?",
        options: ["A bug that takes 0 days to fix", "A vulnerability that is known to the vendor but not yet patched", "A vulnerability unknown to the vendor with no patch available", "A flaw in a system that is 0 years old"],
        correctAnswers: [2],
        type: "single"
    },
    {
        id: 22,
        question: "Which protocol is used to provide a secure, encrypted connection over the internet?",
        options: ["HTTP", "FTP", "HTTPS", "SNMP"],
        correctAnswers: [2],
        type: "single"
    },
    {
        id: 23,
        question: "What is the purpose of a 'Honeypot' in a network?",
        options: ["To store backup data", "To lure and trap attackers to study their methods", "To speed up user logins", "To filter spam emails"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 24,
        question: "Which of the following is an example of Multi-Factor Authentication (MFA)?",
        options: ["Using a long password", "Using a password and a fingerprint scan", "Using two different passwords", "Changing your password every 30 days"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 25,
        question: "What does 'Least Privilege' mean?",
        options: ["Giving users the most access possible", "Giving users only the minimum access necessary for their job", "Only allowing executives to access the network", "A system with no security controls"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 26,
        question: "What is 'SQL Injection'?",
        options: ["Deleting a database", "Injecting malicious code into a database query via user input", "A way to speed up database searches", "Encrypting a database"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 27,
        question: "What is the main function of a 'Firewall'?",
        options: ["To detect physical fires in a data center", "To monitor and control incoming/outgoing network traffic", "To increase the internet bandwidth", "To host a company's website"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 28,
        question: "Which type of malware encrypts a user's files and demands payment for the decryption key?",
        options: ["Spyware", "Adware", "Ransomware", "Trojan"],
        correctAnswers: [2],
        type: "single"
    },
    {
        id: 29,
        question: "What is 'Social Engineering'?",
        options: ["Writing code for social media", "Manipulating people into giving up confidential information", "Building a network of servers", "A type of software testing"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 30,
        question: "What is the purpose of 'Penetration Testing'?",
        options: ["To install new software", "To intentionally attack a system to find security weaknesses", "To check if the hardware is plugged in", "To train employees on how to use Excel"],
        correctAnswers: [1],
        type: "single"
    }
]

export default questions;

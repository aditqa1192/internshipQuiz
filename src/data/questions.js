const questions = [

    {
        id: 1,
        question: "What does the 'CIA Triad' stand for in security?",
        options: ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Control, Identification, Authentication", "Cyber, Information, Access"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 2,
        question: "Which type of attack involves an attacker sitting between two parties to eavesdrop or modify communication?",
        options: ["DDoS", "SQL Injection", "Man-in-the-Middle (MITM)", "Brute Force"],
        correctAnswers: [2],
        type: "single"
    },
    {
        id: 3,
        question: "What is the primary difference between a 'Virus' and a 'Worm'?",
        options: ["A virus is hardware-based", "A worm can self-replicate and spread without human action", "A virus is always harmless", "There is no difference"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 4,
        question: "What is 'Phishing'?",
        options: ["Testing a network's speed", "Searching for bugs in code", "Fraudulent attempts to obtain sensitive info via email/messages", "Scanning for open ports"],
        correctAnswers: [2],
        type: "single"
    },
    {
        id: 5,
        question: "In encryption, what is a 'Salt' used for?",
        options: ["To speed up the encryption process", "To add random data to a password before hashing", "To compress the data", "To make the data readable to the public"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 6,
        question: "What is a 'Zero-day vulnerability'?",
        options: ["A bug that takes 0 days to fix", "A vulnerability that is known to the vendor but not yet patched", "A vulnerability unknown to the vendor with no patch available", "A flaw in a system that is 0 years old"],
        correctAnswers: [2],
        type: "single"
    },
    {
        id: 7,
        question: "Which protocol is used to provide a secure, encrypted connection over the internet?",
        options: ["HTTP", "FTP", "HTTPS", "SNMP"],
        correctAnswers: [2],
        type: "single"
    },
    {
        id: 8,
        question: "What is the purpose of a 'Honeypot' in a network?",
        options: ["To store backup data", "To lure and trap attackers to study their methods", "To speed up user logins", "To filter spam emails"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 9,
        question: "Which of the following is an example of Multi-Factor Authentication (MFA)?",
        options: ["Using a long password", "Using a password and a fingerprint scan", "Using two different passwords", "Changing your password every 30 days"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 10,
        question: "What does 'Least Privilege' mean?",
        options: ["Giving users the most access possible", "Giving users only the minimum access necessary for their job", "Only allowing executives to access the network", "A system with no security controls"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 11,
        question: "What is 'SQL Injection'?",
        options: ["Deleting a database", "Injecting malicious code into a database query via user input", "A way to speed up database searches", "Encrypting a database"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 12,
        question: "What is the main function of a 'Firewall'?",
        options: ["To detect physical fires in a data center", "To monitor and control incoming/outgoing network traffic", "To increase the internet bandwidth", "To host a company's website"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 13,
        question: "Which type of malware encrypts a user's files and demands payment for the decryption key?",
        options: ["Spyware", "Adware", "Ransomware", "Trojan"],
        correctAnswers: [2],
        type: "single"
    },
    {
        id: 14,
        question: "What is 'Social Engineering'?",
        options: ["Writing code for social media", "Manipulating people into giving up confidential information", "Building a network of servers", "A type of software testing"],
        correctAnswers: [1],
        type: "single"
    },
    {
        id: 15,
        question: "What is the purpose of 'Penetration Testing'?",
        options: ["To install new software", "To intentionally attack a system to find security weaknesses", "To check if the hardware is plugged in", "To train employees on how to use Excel"],
        correctAnswers: [1],
        type: "single"
    }
]

export default questions;

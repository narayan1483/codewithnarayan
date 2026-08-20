import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, Circle, Target, Flame, Trophy, Award, Sparkles, BookOpen, ChevronRight, X, HelpCircle, ExternalLink, Plus, Pencil, Trash2, Check, Layers } from "lucide-react";
import { fetchProgress, saveProgress, fetchRoadmaps, seedRoadmaps, updateRoadmapTrack, createRoadmapTrack, deleteRoadmapTrack } from "../api.js";
import TopicNotesViewer from "./TopicNotesViewer.jsx";

const INITIAL_ROADMAP_DATA = {
  dsa: {
    id: "dsa",
    title: "DSA Placement Roadmap",
    icon: "🌲",
    color: "#3D5AFE",
    description: "45 essential patterns to crack technical interview coding rounds.",
    steps: [
      {
        id: "dsa_1",
        name: "Arrays & Strings Basics (Prefix Sum, Two Pointers)",
        level: "Beginner",
        subtopics: ["1D & 2D Arrays Memory Allocation", "Prefix Sum Array & Range Sum Query", "Two Pointers Technique (Opposite & Same Direction)", "String Immutability & StringBuilder in Java"],
        interviewQuestions: ["Two Sum in O(N)", "Maximum Subarray (Kadane's Algorithm)", "Trapping Rain Water"],
        noteLinkSubject: "dsa",
      },
      {
        id: "dsa_2",
        name: "Sliding Window & Hashing Patterns",
        level: "Beginner",
        subtopics: ["Fixed-size sliding window", "Dynamic-size sliding window", "HashMap vs HashSet internal collision handling", "Subarray sum equals K"],
        interviewQuestions: ["Longest Substring Without Repeating Characters", "Minimum Window Substring", "Find All Anagrams in a String"],
        noteLinkSubject: "dsa",
      },
      {
        id: "dsa_3",
        name: "Fast & Slow Pointers (Linked List Cycle)",
        level: "Intermediate",
        subtopics: ["Floyd's Tortoise and Hare Cycle Detection", "Finding middle element in single pass", "Reversing singly linked list iteratively & recursively", "Merging two sorted lists"],
        interviewQuestions: ["Detect and Remove Cycle in Linked List", "LRU Cache Implementation", "Palindrome Linked List"],
        noteLinkSubject: "dsa",
      },
      {
        id: "dsa_4",
        name: "Stack & Monotonic Stack (Next Greater Element)",
        level: "Intermediate",
        subtopics: ["LIFO structure & Balanced Parentheses", "Monotonic increasing / decreasing stack", "Largest Rectangle in Histogram", "Infix to Postfix conversion"],
        interviewQuestions: ["Next Greater Element I & II", "Daily Temperatures", "Min Stack in O(1)"],
        noteLinkSubject: "dsa",
      },
      {
        id: "dsa_5",
        name: "Binary Search & Search Space Reduction",
        level: "Intermediate",
        subtopics: ["Standard binary search condition & mid overflow", "Search in Rotated Sorted Array", "Binary Search on Answer (Book Allocation, Capacity to Ship)"],
        interviewQuestions: ["Find First and Last Position of Element", "Koko Eating Bananas", "Median of Two Sorted Arrays"],
        noteLinkSubject: "dsa",
      },
      {
        id: "dsa_6",
        name: "Tree Traversals (BFS, DFS, Inorder, LCA)",
        level: "Intermediate",
        subtopics: ["Preorder, Inorder, Postorder Traversals", "Level Order Traversal (Queue BFS)", "Lowest Common Ancestor in Binary Tree", "Diameter & Maximum Path Sum"],
        interviewQuestions: ["Lowest Common Ancestor", "Serialize & Deserialize Binary Tree", "Binary Tree Right Side View"],
        noteLinkSubject: "dsa",
      },
      {
        id: "dsa_7",
        name: "Binary Search Trees & Tree Construction",
        level: "Intermediate",
        subtopics: ["BST Properties & Inorder Sorted Nature", "Validate BST", "Insert, Delete, Search in BST", "Kth Smallest Element in BST"],
        interviewQuestions: ["Validate Binary Search Tree", "Convert Sorted Array to BST", "BST Iterator"],
        noteLinkSubject: "dsa",
      },
      {
        id: "dsa_8",
        name: "Graph BFS & DFS (Topological Sort, Cycle Detection)",
        level: "Advanced",
        subtopics: ["Adjacency Matrix vs Adjacency List", "Connected Components & Number of Islands", "Kahn's Algorithm (Topological Sort BFS)", "Bipartite Graph Check"],
        interviewQuestions: ["Course Schedule I & II", "Number of Islands", "Word Ladder"],
        noteLinkSubject: "dsa",
      },
      {
        id: "dsa_9",
        name: "Shortest Paths (Dijkstra, Bellman-Ford)",
        level: "Advanced",
        subtopics: ["Dijkstra using PriorityQueue (Min-Heap)", "Bellman-Ford for negative weight cycles", "Floyd-Warshall all-pairs shortest path", "Disjoint Set Union (DSU / Kruskal's)"],
        interviewQuestions: ["Network Delay Time", "Cheapest Flights Within K Stops", "Redundant Connection"],
        noteLinkSubject: "dsa",
      },
      {
        id: "dsa_10",
        name: "Dynamic Programming (1D, 2D Grid, Knapsack, LCS)",
        level: "Advanced",
        subtopics: ["Memoization (Top-down) vs Tabulation (Bottom-up)", "0/1 Knapsack & Unbounded Knapsack", "Longest Common Subsequence (LCS)", "DP on Trees & Partition DP"],
        interviewQuestions: ["Coin Change I & II", "Longest Increasing Subsequence", "Edit Distance"],
        noteLinkSubject: "dsa",
      },
    ],
  },
  web: {
    id: "web",
    title: "Fullstack Web Dev 2026",
    icon: "🌐",
    color: "#00B37E",
    description: "Modern MERN & Fullstack web development track from zero to deploy.",
    steps: [
      {
        id: "web_1",
        name: "HTML5 Semantic Elements & Responsive CSS Layouts",
        level: "Beginner",
        subtopics: ["Semantic tags (<header>, <main>, <nav>, <article>)", "Flexbox Alignment & Grid Template Areas", "Mobile-first responsive media queries", "CSS Variables & Themes"],
        interviewQuestions: ["Difference between div and span", "CSS Box Model (margin, border, padding, content)", "Explain CSS Grid vs Flexbox"],
        noteLinkSubject: "web",
      },
      {
        id: "web_2",
        name: "JavaScript ES6+ (Promises, Async/Await, Closures)",
        level: "Beginner",
        subtopics: ["Event Loop, Call Stack & Microtask Queue", "Closures & Lexical Scoping", "Promises, async/await and Promise.all", "ES6 Destructuring, Spread, Rest operators"],
        interviewQuestions: ["Explain Closures with real-world example", "What is Event Bubbling vs Capturing?", "Difference between var, let, and const"],
        noteLinkSubject: "web",
      },
      {
        id: "web_3",
        name: "DOM Manipulation & Browser Storage (LocalStorage)",
        level: "Beginner",
        subtopics: ["Selecting & updating DOM elements", "Event Listeners & Event Delegation", "LocalStorage vs SessionStorage vs Cookies", "Debouncing & Throttling event handlers"],
        interviewQuestions: ["How does browser render a web page?", "Difference between localStorage and cookies", "What is Event Delegation?"],
        noteLinkSubject: "web",
      },
      {
        id: "web_4",
        name: "React Fundamentals (State, Props, Hooks, Router)",
        level: "Intermediate",
        subtopics: ["Virtual DOM & React Reconciliation (Fiber)", "useState, useEffect, useRef, useMemo, useCallback", "Props drilling & Lifting State Up", "React Router v6 routing"],
        interviewQuestions: ["Why do we need Virtual DOM?", "Rules of Hooks in React", "How does useEffect dependency array work?"],
        noteLinkSubject: "web",
      },
      {
        id: "web_5",
        name: "React State Management & Performance Tuning",
        level: "Intermediate",
        subtopics: ["Context API & Custom Hooks", "Zustand / Redux Toolkit state flow", "React.memo, code-splitting with React.lazy", "Preventing unnecessary re-renders"],
        interviewQuestions: ["When to use useMemo vs useCallback?", "Explain Redux unidirectional data flow", "How to optimize large React app performance?"],
        noteLinkSubject: "web",
      },
      {
        id: "web_6",
        name: "Node.js & Express REST API Architecture",
        level: "Intermediate",
        subtopics: ["Node.js Single Threaded Event Loop & libuv", "Express Middleware chain (cors, json, auth)", "REST API design best practices & status codes", "File upload with Multer"],
        interviewQuestions: ["How does Node.js handle concurrency?", "What is Middleware in Express?", "Difference between PUT and PATCH"],
        noteLinkSubject: "web",
      },
      {
        id: "web_7",
        name: "SQL (MySQL) & NoSQL (MongoDB) Database Design",
        level: "Intermediate",
        subtopics: ["Relational Schema vs Document Database", "ACID Properties & Indexes in MySQL", "MongoDB Aggregation Pipeline & Mongoose Models", "Connection Pooling"],
        interviewQuestions: ["SQL vs NoSQL database comparison", "Explain DB Indexing and B-Tree", "How to prevent SQL Injection?"],
        noteLinkSubject: "dbms",
      },
      {
        id: "web_8",
        name: "Authentication (JWT, Cookies, OAuth2)",
        level: "Advanced",
        subtopics: ["JWT Header, Payload, Signature format", "HttpOnly Cookies & XSS / CSRF protection", "Password hashing with bcrypt & salt rounds", "Role-based access control (RBAC)"],
        interviewQuestions: ["How does JWT authentication work?", "Difference between Authentication & Authorization", "What is CSRF token?"],
        noteLinkSubject: "web",
      },
      {
        id: "web_9",
        name: "Cloud Deployment (Vercel, Render, AWS, Docker)",
        level: "Advanced",
        subtopics: ["Frontend deployment on Vercel/Netlify", "Node.js backend deployment on Render/Railway", "Environment variables management", "Docker containerization basics"],
        interviewQuestions: ["Explain CI/CD Pipeline workflow", "What is CORS error and how to fix it in production?", "Difference between horizontal and vertical scaling"],
        noteLinkSubject: "web",
      },
    ],
  },
  java: {
    id: "java",
    title: "Java & Backend Master",
    icon: "☕",
    color: "#FF8A3D",
    description: "Core Java to Spring Boot enterprise backend development roadmap.",
    steps: [
      {
        id: "java_1",
        name: "Java Syntax, Data Types & Control Flow",
        level: "Beginner",
        subtopics: ["JVM, JRE, JDK Architecture", "Primitive types vs Wrapper Classes", "String vs StringBuffer vs StringBuilder", "Control statements & Loops"],
        interviewQuestions: ["Why is Java platform independent?", "Why Strings are immutable in Java?", "Difference between == and .equals()"],
        noteLinkSubject: "java",
      },
      {
        id: "java_2",
        name: "OOP 4 Pillars (Inheritance, Polymorphism, Encapsulation, Abstraction)",
        level: "Beginner",
        subtopics: ["Class, Object, Constructor overloading", "Method Overloading vs Overriding (Static vs Dynamic Binding)", "Abstract classes vs Interfaces", "Access modifiers & Encapsulation"],
        interviewQuestions: ["Can we override private or static methods?", "Multiple inheritance in Java using Interfaces", "Difference between Abstract Class and Interface"],
        noteLinkSubject: "java",
      },
      {
        id: "java_3",
        name: "Java Collections Framework (List, Set, Map, Queue)",
        level: "Intermediate",
        subtopics: ["ArrayList vs LinkedList internal working", "HashSet vs TreeSet vs LinkedHashSet", "HashMap working (hashCode & equals, bucketing)", "ConcurrentHashMap vs Hashtable"],
        interviewQuestions: ["How does HashMap work internally in Java 8?", "Difference between Comparable and Comparator", "Why ConcurrentHashMap is faster than Hashtable?"],
        noteLinkSubject: "java",
      },
      {
        id: "java_4",
        name: "Multithreading, Concurrency & ExecutorService",
        level: "Intermediate",
        subtopics: ["Thread Lifecycle & Creating Threads (Thread vs Runnable)", "Synchronization, volatile, atomic variables", "Thread pool & ExecutorService framework", "Deadlocks & Inter-thread communication (wait, notify)"],
        interviewQuestions: ["Difference between Callable and Runnable", "What does 'volatile' keyword do in Java?", "Explain Producer-Consumer problem in Java"],
        noteLinkSubject: "java",
      },
      {
        id: "java_5",
        name: "Java 8 Features (Streams, Lambdas, Optional)",
        level: "Intermediate",
        subtopics: ["Lambda Expressions & Functional Interfaces (@FunctionalInterface)", "Stream API (filter, map, reduce, collect)", "Optional class to avoid NullPointerException", "Default & Static methods in interfaces"],
        interviewQuestions: ["Explain Stream Intermediate vs Terminal operations", "What is Java 8 Optional?", "Find duplicates in a list using Streams"],
        noteLinkSubject: "java",
      },
      {
        id: "java_6",
        name: "Spring Boot Basics (Dependency Injection, Controllers)",
        level: "Advanced",
        subtopics: ["Inversion of Control (IoC) & Dependency Injection (@Autowired)", "Spring Boot Starters & Auto-configuration", "@RestController, @GetMapping, @PostMapping, @PathVariable", "application.properties config"],
        interviewQuestions: ["What is Spring Boot Auto-configuration?", "Difference between @Controller and @RestController", "Explain Bean scopes in Spring"],
        noteLinkSubject: "java",
      },
      {
        id: "java_7",
        name: "Spring Data JPA & Hibernate Relations",
        level: "Advanced",
        subtopics: ["ORM concepts & Hibernate SessionFactory", "@Entity, @Table, @Id, @GeneratedValue", "Entity Relationships (@OneToMany, @ManyToOne, @ManyToMany)", "JpaRepository custom query methods & JPQL"],
        interviewQuestions: ["What is N+1 Select Problem in Hibernate?", "Difference between CrudRepository and JpaRepository", "Lazy vs Eager loading in JPA"],
        noteLinkSubject: "java",
      },
      {
        id: "java_8",
        name: "Spring Security & Microservices Architecture",
        level: "Advanced",
        subtopics: ["Spring Security Filter Chain & SecurityContext", "JWT Token generation and validation filter", "Microservices communication (FeignClient, RestTemplate)", "API Gateway & Service Discovery (Eureka)"],
        interviewQuestions: ["How does Spring Security filter chain work?", "Monolithic vs Microservices architecture", "Explain Circuit Breaker pattern (Resilience4j)"],
        noteLinkSubject: "java",
      },
    ],
  },
  core: {
    id: "core",
    title: "Core CS Subjects for Interviews",
    icon: "💻",
    color: "#A855F7",
    description: "DBMS, OS and Computer Networking concepts asked in MNC interviews.",
    steps: [
      {
        id: "core_1",
        name: "DBMS: Normalization (1NF, 2NF, 3NF, BCNF)",
        level: "Beginner",
        subtopics: ["Functional Dependencies & Candidate Keys", "1NF (Atomic values)", "2NF (Removal of Partial Dependency)", "3NF & Boyce-Codd Normal Form (BCNF)"],
        interviewQuestions: ["What is Database Normalization?", "Explain 2NF vs 3NF with example", "Difference between 3NF and BCNF"],
        noteLinkSubject: "dbms",
      },
      {
        id: "core_2",
        name: "DBMS: ACID Properties & Transactions",
        level: "Intermediate",
        subtopics: ["Atomicity, Consistency, Isolation, Durability", "Concurrency anomalies (Dirty Read, Non-repeatable read, Phantom read)", "Transaction isolation levels", "Two-Phase Locking (2PL) Protocol"],
        interviewQuestions: ["Explain ACID properties with bank transfer example", "What is Dirty Read anomaly?", "Explain Deadlock in DBMS"],
        noteLinkSubject: "dbms",
      },
      {
        id: "core_3",
        name: "DBMS: Indexing, B-Trees & SQL Query Optimization",
        level: "Advanced",
        subtopics: ["Clustered vs Non-Clustered Index", "B-Tree and B+ Tree internal structure", "SQL EXPLAIN Query Plan", "HAVING vs WHERE clause"],
        interviewQuestions: ["Why B+ Tree is used in Database Indexing?", "Difference between Clustered & Non-Clustered Index", "Find 2nd highest salary in SQL"],
        noteLinkSubject: "dbms",
      },
      {
        id: "core_4",
        name: "OS: Process vs Thread, Process Scheduling",
        level: "Intermediate",
        subtopics: ["Process Control Block (PCB) & Context Switching", "User Threads vs Kernel Threads", "CPU Scheduling algorithms (FCFS, SJF, Round Robin, Priority)", "Multiprogramming vs Multitasking"],
        interviewQuestions: ["Difference between Process and Thread", "Explain Round Robin CPU Scheduling with Gantt Chart", "What is Context Switching overhead?"],
        noteLinkSubject: "os",
      },
      {
        id: "core_5",
        name: "OS: Deadlocks (Detection, Prevention, Avoidance)",
        level: "Intermediate",
        subtopics: ["4 Coffman Conditions for Deadlock", "Resource Allocation Graph (RAG)", "Banker's Algorithm for Deadlock Avoidance", "Deadlock Detection & Recovery techniques"],
        interviewQuestions: ["What are the 4 conditions of Deadlock?", "Explain Banker's Algorithm", "How to prevent Deadlock in OS?"],
        noteLinkSubject: "os",
      },
      {
        id: "core_6",
        name: "OS: Virtual Memory & Page Replacement Algorithms",
        level: "Advanced",
        subtopics: ["Paging, Segmentation & Page Table", "Translation Lookaside Buffer (TLB)", "Page Fault & Thrashing", "Page Replacement (FIFO, LRU, Optimal - Belady's Anomaly)"],
        interviewQuestions: ["What is Virtual Memory and why is it needed?", "Explain LRU Page Replacement algorithm", "What is Thrashing in OS?"],
        noteLinkSubject: "os",
      },
      {
        id: "core_7",
        name: "CN: OSI Model vs TCP/IP Layers & Protocols",
        level: "Beginner",
        subtopics: ["7 Layers of OSI (Physical to Application)", "TCP/IP 4-layer model", "MAC Address vs IP Address", "Routers, Switches, Hubs & Gateways"],
        interviewQuestions: ["Explain 7 layers of OSI Model and their protocols", "Difference between TCP and UDP", "What happens when you type google.com in browser?"],
        noteLinkSubject: "networking",
      },
      {
        id: "core_8",
        name: "CN: HTTP/HTTPS, DNS, WebSockets & TCP Handshake",
        level: "Intermediate",
        subtopics: ["TCP 3-Way Handshake (SYN, SYN-ACK, ACK)", "DNS Resolution Process step-by-step", "HTTP 1.1 vs HTTP/2 vs HTTP/3 (QUIC)", "SSL/TLS Handshake & Symmetric vs Asymmetric Encryption"],
        interviewQuestions: ["Explain TCP 3-Way Handshake", "How does HTTPS encryption work?", "Difference between WebSocket and HTTP polling"],
        noteLinkSubject: "networking",
      },
    ],
  },
  aiml: {
    id: "aiml",
    title: "Artificial Intelligence & Machine Learning",
    icon: "🤖",
    color: "#8B5CF6",
    description: "Learn AI, Machine Learning, Deep Learning, NLP, Generative AI and LLMs from fundamentals to advanced concepts.",
    steps: [
      {
        id: "aiml_1",
        name: " Python for AI/ML",
        level: "Beginner",
        subtopics: ["Python Fundamentals & OOP in Python", "List Comprehensions, Lambda Functions & Generators", "File I/O, Exception Handling & JSON", "Virtual Environments & Package Management (pip, conda)"],
        interviewQuestions: ["Why is Python the preferred language for AI/ML?", "Difference between shallow copy and deep copy in Python", "What are Python Generators and why are they memory efficient?"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_2",
        name: " Mathematics for Machine Learning",
        level: "Beginner",
        subtopics: ["Linear Algebra: Vectors, Matrices, Dot Products, Eigenvalues & Eigenvectors", "Calculus: Partial Derivatives, Gradients & Chain Rule", "Probability & Statistics: Distributions, Bayes Theorem, Mean, Variance, Covariance", "Hypothesis Testing & p-values"],
        interviewQuestions: ["What is the role of Eigenvalues and Eigenvectors in PCA?", "Explain Gradient Descent mathematically", "What is Bayes' Theorem and its application in Naive Bayes?"],
        noteLinkSubject: "dsa",
      },
      {
        id: "aiml_3",
        name: " NumPy & Pandas",
        level: "Beginner",
        subtopics: ["NumPy N-Dimensional Arrays, Broadcasting & Vectorization", "Matrix Operations & Linear Algebra functions (np.linalg)", "Pandas Series & DataFrames (Indexing, Filtering, GroupBy)", "Merging, Joining, Reshaping & Handling Missing Values"],
        interviewQuestions: ["Why is NumPy faster than standard Python lists?", "What is Array Broadcasting in NumPy?", "Difference between .loc and .iloc in Pandas"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_4",
        name: " Data Preprocessing",
        level: "Beginner",
        subtopics: ["Handling Missing Data (Imputation: Mean, Median, KNN)", "Feature Scaling: Normalization (MinMax) vs Standardization (StandardScaler)", "Encoding Categorical Variables: One-Hot, Ordinal, Target Encoding", "Outlier Detection & Treatment (IQR, Z-Score)"],
        interviewQuestions: ["When should you use Standardization vs Normalization?", "What is Data Leakage and how do you prevent it during preprocessing?", "How do you handle severe class imbalance in datasets?"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_5",
        name: "  Supervised Learning",
        level: "Intermediate",
        subtopics: ["Linear Regression (Cost Function, Ordinary Least Squares, Ridge, Lasso)", "Logistic Regression (Sigmoid, Odds Ratio, Cross-Entropy Loss)", "Decision Trees & Random Forests (Gini Impurity, Entropy, Bagging)", "Support Vector Machines (SVM) & Kernel Trick", "K-Nearest Neighbors (KNN) & Naive Bayes Classifier"],
        interviewQuestions: ["Difference between Ridge (L2) and Lasso (L1) Regularization", "Explain Bias-Variance Tradeoff with examples", "Why are Random Forests resistant to overfitting?"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_6",
        name: " Unsupervised Learning",
        level: "Intermediate",
        subtopics: ["K-Means Clustering & Elbow Method (Inertia)", "Hierarchical Clustering (Dendrograms, Agglomerative)", "DBSCAN (Density-Based Spatial Clustering of Applications with Noise)", "Dimensionality Reduction: PCA (Principal Component Analysis) & t-SNE"],
        interviewQuestions: ["How do you determine the optimal number of clusters in K-Means?", "Difference between K-Means and DBSCAN", "What is the Curse of Dimensionality and how does PCA solve it?"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_7",
        name: " Model Evaluation",
        level: "Intermediate",
        subtopics: ["Classification Metrics: Accuracy, Precision, Recall, F1-Score, ROC-AUC curve", "Confusion Matrix & Type I / Type II Errors", "Regression Metrics: MSE, RMSE, MAE, R-Squared, Adjusted R-Squared", "K-Fold Cross-Validation & Stratified K-Fold"],
        interviewQuestions: ["When is Precision more important than Recall? (Give real examples)", "What is the Area Under ROC Curve (ROC-AUC)?", "Difference between R-Squared and Adjusted R-Squared"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_8",
        name: " Deep Learning",
        level: "Advanced",
        subtopics: ["Artificial Neural Networks (ANN): Perceptrons, Multi-Layer Perceptron (MLP)", "Activation Functions: ReLU, Sigmoid, Tanh, Softmax, LeakyReLU", "Backpropagation & Optimizers (SGD, Momentum, RMSProp, Adam)", "Convolutional Neural Networks (CNN): Filters, Pooling, Strides, ResNet", "Recurrent Neural Networks (RNN), LSTM & GRU for sequential data"],
        interviewQuestions: ["What is the Vanishing/Exploding Gradient problem and how is it solved?", "Why is Adam optimizer widely preferred over vanilla SGD?", "Difference between RNN and LSTM"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_9",
        name: " Feature Engineering",
        level: "Intermediate",
        subtopics: ["Feature Creation & Polynomial Features", "Feature Selection: Filter methods, Wrapper methods, Embedded methods", "Feature Importance using Tree Models & SHAP values", "Dimensionality reduction & Correlation Matrix analysis"],
        interviewQuestions: ["What is the difference between Feature Selection and Feature Extraction?", "How do SHAP values explain black-box ML model predictions?", "How do you detect and handle multicollinearity?"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_10",
        name: " Scikit-Learn & ML Pipeline",
        level: "Beginner",
        subtopics: ["Scikit-Learn Estimator, Transformer & Predictor API", "Building robust Pipelines with ColumnTransformer & Pipeline", "Hyperparameter Tuning with GridSearchCV & RandomizedSearchCV", "Model Persistence with Joblib & Pickle"],
        interviewQuestions: ["Why should you always use Scikit-Learn Pipelines?", "Difference between GridSearchCV and RandomizedSearchCV", "How do you deploy a serialized model (.joblib/.pkl)?"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_11",
        name: " Natural Language Processing",
        level: "Advanced",
        subtopics: ["Text Preprocessing: Tokenization, Stemming, Lemmatization, Stopwords removal", "Vectorization: Bag of Words (BoW), TF-IDF, N-grams", "Word Embeddings: Word2Vec, GloVe, FastText", "Named Entity Recognition (NER), Sentiment Analysis & POS Tagging using Spacy/NLTK"],
        interviewQuestions: ["What is the difference between Stemming and Lemmatization?", "How does TF-IDF score calculate term importance?", "Explain Cosine Similarity in Word Embeddings"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_12",
        name: " Generative AI",
        level: "Advanced",
        subtopics: ["Generative vs Discriminative Models", "Variational Autoencoders (VAEs) & Generative Adversarial Networks (GANs)", "Diffusion Models: Latent Diffusion, Stable Diffusion, DALL-E", "Prompt Engineering: Few-shot, Chain-of-Thought (CoT), Tree-of-Thoughts"],
        interviewQuestions: ["How do Generative Adversarial Networks (GANs) work?", "What is Prompt Engineering and Chain-of-Thought prompting?", "Difference between Autoencoders and Variational Autoencoders"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_13",
        name: " Transformers & LLMs",
        level: "Advanced",
        subtopics: ["Transformer Architecture: Self-Attention mechanism, Multi-Head Attention, Positional Encodings", "Encoder-only (BERT), Decoder-only (GPT), Encoder-Decoder (T5)", "LLM Training Pipeline: Pretraining, Fine-Tuning (LoRA, QLoRA), RLHF / DPO", "Tokenization (BPE, WordPiece, SentencePiece) & Context Windows"],
        interviewQuestions: ["Explain the Self-Attention mechanism in Transformers", "What is LoRA (Low-Rank Adaptation) and why is it parameter-efficient?", "What is RLHF (Reinforcement Learning from Human Feedback)?"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_14",
        name: " RAG — Retrieval Augmented Generation",
        level: "Advanced",
        subtopics: ["RAG Architecture Overview: Ingestion, Chunking, Embedding, Vector DB, Retrieval, Generation", "Vector Databases: ChromaDB, Pinecone, FAISS, Milvus, Qdrant", "Embedding Models & Semantic Search (Cosine, Dot Product)", "Advanced RAG: Hybrid Search (BM25 + Dense), Reranking (Cross-Encoder), Query Transformation"],
        interviewQuestions: ["What is RAG and why is it preferred over fine-tuning for dynamic knowledge?", "What chunking strategies are best for document RAG?", "How does Reranking improve RAG answer accuracy?"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_15",
        name: " AI Agents",
        level: "Advanced",
        subtopics: ["Agent Frameworks: LangChain, LangGraph, CrewAI, AutoGen", "Agent Cognitive Architecture: Planning, Memory (Short-term / Long-term), Tool Calling", "ReAct Pattern (Reasoning + Acting)", "Multi-agent Collaboration, Orchestration & Human-in-the-loop workflows"],
        interviewQuestions: ["What is an AI Agent and how does it differ from a standard LLM chat?", "Explain the ReAct (Reasoning and Acting) prompt pattern", "How do you manage agent loops and prevent infinite execution?"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_16",
        name: " MLOps",
        level: "Advanced",
        subtopics: ["Experiment Tracking with MLflow & Weights & Biases (W&B)", "Model Registry & Versioning (DVC - Data Version Control)", "Model Deployment: FastAPI, TorchServe, Docker containers", "Model Monitoring: Data Drift, Concept Drift, Latency & Prometheus metrics"],
        interviewQuestions: ["What is Data Drift vs Concept Drift and how do you monitor it?", "What is MLOps and how does it differ from standard DevOps?", "How do you containerize and serve an ML model with FastAPI and Docker?"],
        noteLinkSubject: "python",
      },
      {
        id: "aiml_17",
        name: " AI/ML Projects",
        level: "Advanced",
        subtopics: ["End-to-End Production ML Pipeline with CI/CD", "Fullstack RAG Knowledge Base Search Engine", "Autonomous Multi-Agent Researcher System", "Computer Vision Object Detection & Fine-Tuned Domain LLM"],
        interviewQuestions: ["How do you architect an end-to-end ML project from data ingestion to production API?", "How do you evaluate and benchmark an LLM RAG application?", "What are the common scalability bottlenecks in serving ML models?"],
        noteLinkSubject: "python",
      },
    ],
  },
};

const ROADMAP_STORAGE_KEY = "codewithnarayan_custom_roadmaps";
const PROGRESS_STORAGE_KEY = "codewithnarayan_roadmap_progress";
const ACTIVE_TRACK_STORAGE_KEY = "codewithnarayan_active_track";

const ROADMAP_TOPIC_HIGHLIGHTS = [
  "🎯 Interactive Study Roadmaps • Track Your SDE Prep",
  "🌲 DSA Placement Roadmap • 45 Essential Patterns & LeetCode",
  "🤖 AI & Machine Learning • Python, Math, PyTorch & LLMs",
  "💻 Core CS Subjects • OS, DBMS, CN & System Design",
  "☕ Java & Backend Master • Spring Boot, Streams & Microservices",
  "🌐 Fullstack Web Dev 2026 • React, Node.js, Next.js & TypeScript",
];

function useRoadmapTypewriter(topics, typingSpeed = 40, deletingSpeed = 20, pauseTime = 2200) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!topics || topics.length === 0) return;

    if (!isDeleting && subIndex === topics[index].length) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && subIndex === 0) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % topics.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index, topics, typingSpeed, deletingSpeed, pauseTime]);

  return topics[index] ? topics[index].substring(0, subIndex) : "";
}

export default function RoadmapSection({ onFilterNotesBySubject, isAdmin }) {
  // Always start with INITIAL_ROADMAP_DATA — backend se override hoga mount pe
  const [roadmaps, setRoadmaps] = useState(INITIAL_ROADMAP_DATA);
  const [roadmapsLoaded, setRoadmapsLoaded] = useState(false); // backend se load hua?

  const typedRoadmap = useRoadmapTypewriter(ROADMAP_TOPIC_HIGHLIGHTS);

  const [activeTrack, setActiveTrack] = useState(() => {
    try {
      return localStorage.getItem(ACTIVE_TRACK_STORAGE_KEY) || "dsa";
    } catch {
      return "dsa";
    }
  });
  const [selectedStep, setSelectedStep] = useState(null);
  // Topic Notes Viewer — when set, show full notepad view
  const [viewingTopicNotes, setViewingTopicNotes] = useState(null);
  // Progress — starts empty, loaded from backend on mount
  const [completed, setCompleted] = useState(new Set());
  const [syncStatus, setSyncStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"
  const saveTimerRef = useRef(null);

  // Admin Topic Modal (Add / Edit)
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [topicForm, setTopicForm] = useState({
    name: "",
    level: "Beginner",
    subtopicsText: "",
    questionsText: "",
    noteLinkSubject: "dsa",
  });

  // Admin New Track Modal
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [trackForm, setTrackForm] = useState({
    id: "",
    title: "",
    icon: "🚀",
    color: "#3D5AFE",
    description: "",
  });

  // ─── Backend Sync: Load roadmaps from DB on mount ────────────────
  // Agar DB mein data hai → use karo; agar nahi (first time) → seed karo
  useEffect(() => {
    fetchRoadmaps()
      .then(({ roadmaps: dbRoadmaps, seeded }) => {
        if (seeded && dbRoadmaps) {
          // DB mein data hai — use karo (admin ke latest changes)
          setRoadmaps(dbRoadmaps);
        } else {
          // DB empty hai — INITIAL_ROADMAP_DATA already set hai
          // Agar admin logged in hai to auto-seed kar do
          if (isAdmin) {
            seedRoadmaps(INITIAL_ROADMAP_DATA).catch(() => {});
          }
        }
        setRoadmapsLoaded(true);
      })
      .catch(() => {
        // Offline/error — localStorage fallback
        try {
          const saved = localStorage.getItem(ROADMAP_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            setRoadmaps((prev) => ({ ...prev, ...parsed }));
          }
        } catch { }
        setRoadmapsLoaded(true);
      });
  }, [isAdmin]);

  // ─── Backend Sync: Load global progress on mount ─────────────────
  useEffect(() => {
    fetchProgress()
      .then((ids) => {
        if (ids.length > 0) {
          setCompleted(new Set(ids));
        }
      })
      .catch(() => { /* offline fallback — no crash */ });
  }, []);

  // ─── Backend Sync: Auto-save whenever completed changes ───────────
  // Debounced — 800ms baad save hoga (rapid clicks pe ek hi request)
  useEffect(() => {
    // localStorage mein bhi rakhte hain offline fallback ke liye
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify([...completed]));
    } catch (e) { }

    // Debounce: previous timer cancel karo, naya set karo
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSyncStatus("saving");
    saveTimerRef.current = setTimeout(() => {
      saveProgress([...completed])
        .then(() => setSyncStatus("saved"))
        .catch(() => setSyncStatus("error"));
    }, 800);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [completed]);

  // ─── localStorage fallback: roadmaps ka cache (offline ke liye) ──
  useEffect(() => {
    if (!roadmapsLoaded) return; // load hone se pehle mat likho
    try {
      localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(roadmaps));
    } catch (e) { }
  }, [roadmaps, roadmapsLoaded]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_TRACK_STORAGE_KEY, activeTrack);
    } catch (e) { }
  }, [activeTrack]);

  const trackKeys = Object.keys(roadmaps);
  const currentKey = roadmaps[activeTrack] ? activeTrack : trackKeys[0] || "dsa";
  const track = roadmaps[currentKey] || { title: "Roadmap", icon: "🎯", color: "#3D5AFE", description: "", steps: [] };
  const totalInTrack = track.steps ? track.steps.length : 0;
  const doneInTrack = track.steps ? track.steps.filter((s) => completed.has(s.id)).length : 0;
  const progressPercent = totalInTrack > 0 ? Math.round((doneInTrack / totalInTrack) * 100) : 0;

  const toggleStep = (id, e) => {
    if (e) e.stopPropagation();
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Admin: Open Add Topic
  const openAddTopicModal = () => {
    setTopicForm({
      name: "",
      level: "Beginner",
      subtopicsText: "",
      questionsText: "",
      noteLinkSubject: currentKey,
    });
    setIsEditingTopic(false);
    setEditingTopicId(null);
    setTopicModalOpen(true);
  };

  // Admin: Open Edit Topic
  const openEditTopicModal = (step, e) => {
    if (e) e.stopPropagation();
    setTopicForm({
      name: step.name || "",
      level: step.level || "Beginner",
      subtopicsText: (step.subtopics || []).join("\n"),
      questionsText: (step.interviewQuestions || []).join("\n"),
      noteLinkSubject: step.noteLinkSubject || currentKey,
    });
    setIsEditingTopic(true);
    setEditingTopicId(step.id);
    setTopicModalOpen(true);
  };

  // Admin: Save Topic (Add or Edit) — Backend mein bhi save karo
  const handleSaveTopic = () => {
    if (!topicForm.name.trim()) return;

    const subtopics = topicForm.subtopicsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const interviewQuestions = topicForm.questionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    let updatedSteps;

    if (isEditingTopic) {
      setRoadmaps((prev) => {
        updatedSteps = (prev[currentKey].steps || []).map((s) => {
          if (s.id === editingTopicId) {
            return {
              ...s,
              name: topicForm.name,
              level: topicForm.level,
              subtopics: subtopics.length ? subtopics : ["Core concepts"],
              interviewQuestions: interviewQuestions.length ? interviewQuestions : ["Common interview questions"],
              noteLinkSubject: topicForm.noteLinkSubject,
            };
          }
          return s;
        });
        // Backend call: updated steps save karo
        updateRoadmapTrack(currentKey, { steps: updatedSteps }).catch((err) =>
          console.error("Roadmap sync error:", err.message)
        );
        return {
          ...prev,
          [currentKey]: { ...prev[currentKey], steps: updatedSteps },
        };
      });
    } else {
      const newStep = {
        id: `${currentKey}_${Date.now()}`,
        name: topicForm.name,
        level: topicForm.level,
        subtopics: subtopics.length ? subtopics : ["Core concepts"],
        interviewQuestions: interviewQuestions.length ? interviewQuestions : ["Common interview questions"],
        noteLinkSubject: topicForm.noteLinkSubject,
      };

      setRoadmaps((prev) => {
        const newSteps = [...(prev[currentKey].steps || []), newStep];
        // Backend call: naya step add hone ke baad save karo
        updateRoadmapTrack(currentKey, { steps: newSteps }).catch((err) =>
          console.error("Roadmap sync error:", err.message)
        );
        return {
          ...prev,
          [currentKey]: { ...prev[currentKey], steps: newSteps },
        };
      });
    }

    setTopicModalOpen(false);
    setSelectedStep(null);
  };

  // Admin: Delete Topic — Backend mein bhi delete karo
  const handleDeleteTopic = (stepId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this roadmap topic?")) return;

    setRoadmaps((prev) => {
      const newSteps = (prev[currentKey].steps || []).filter((s) => s.id !== stepId);
      // Backend call: topic delete ke baad updated steps save karo
      updateRoadmapTrack(currentKey, { steps: newSteps }).catch((err) =>
        console.error("Roadmap sync error:", err.message)
      );
      return {
        ...prev,
        [currentKey]: { ...prev[currentKey], steps: newSteps },
      };
    });
    if (selectedStep && selectedStep.id === stepId) setSelectedStep(null);
  };

  // Admin: Add New Track — Backend mein bhi create karo
  const handleCreateTrack = () => {
    if (!trackForm.title.trim() || !trackForm.id.trim()) return;
    const cleanId = trackForm.id.toLowerCase().replace(/[^a-z0-9]/g, "");

    const newTrack = {
      id: cleanId,
      title: trackForm.title,
      icon: trackForm.icon || "🎯",
      color: trackForm.color || "#3D5AFE",
      description: trackForm.description || "Comprehensive learning track.",
      steps: [],
    };

    // Backend call: naya track DB mein create karo
    createRoadmapTrack(newTrack).catch((err) =>
      console.error("Roadmap track create error:", err.message)
    );

    setRoadmaps((prev) => ({ ...prev, [cleanId]: newTrack }));
    setActiveTrack(cleanId);
    setTrackForm({ id: "", title: "", icon: "🚀", color: "#3D5AFE", description: "" });
    setTrackModalOpen(false);
  };

  // ─── If viewing topic notes, show the full notepad viewer ──────
  if (viewingTopicNotes) {
    return (
      <div id="roadmap">
        <TopicNotesViewer
          topic={viewingTopicNotes}
          track={track}
          isAdmin={isAdmin}
          onBack={() => setViewingTopicNotes(null)}
        />
      </div>
    );
  }

  return (
    <div id="roadmap" style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px 60px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        {/* Dynamic Typewriter Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(61, 90, 254, 0.08)",
            border: "1px solid rgba(61, 90, 254, 0.2)",
            borderRadius: 999,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 700,
            color: "#3D5AFE",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 10,
            maxWidth: "96%",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(61, 90, 254, 0.08)",
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>{typedRoadmap}</span>
          <span className="hub-typewriter-cursor">|</span>
        </div>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 8px" }}>
          Structured Preparation Roadmaps
        </h2>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "var(--text-secondary)", maxWidth: 540, margin: "0 auto" }}>
          Click on any topic to see <strong>subtopics & interview questions</strong>. Check topics as completed to track progress!
        </p>
      </div>

      {/* Track Selector Tabs & Admin Create Track */}
      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          scrollbarWidth: "none",
          paddingBottom: 12,
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {Object.entries(roadmaps).map(([key, data]) => {
            const isActive = currentKey === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTrack(key);
                  setSelectedStep(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: `1.5px solid ${isActive ? data.color : "var(--border)"}`,
                  background: isActive ? data.color : "var(--surface)",
                  color: isActive ? "#FFFFFF" : "var(--text-primary)",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{data.icon}</span>
                <span>{data.title}</span>
              </button>
            );
          })}
        </div>

        {isAdmin && (
          <button
            onClick={() => setTrackModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#14151A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              padding: "9px 14px",
              fontFamily: "'Sora', sans-serif",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Plus size={14} /> Add New Track (Admin)
          </button>
        )}
        {isAdmin && (
          <button
            title="Sab roadmaps ko database mein sync karo"
            onClick={() => {
              seedRoadmaps(roadmaps)
                .then(() => alert("✅ Roadmaps successfully synced to database! Ab har device pe same data dikhega."))
                .catch((err) => alert("❌ Sync failed: " + err.message));
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#0f4c2a",
              color: "#4ade80",
              border: "1px solid #166534",
              borderRadius: 8,
              padding: "9px 14px",
              fontFamily: "'Sora', sans-serif",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ☁️ Sync to DB
          </button>
        )}
      </div>

      {/* Roadmap Card Container */}
      <div
        style={{
          marginTop: 14,
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderTop: `4px solid ${track.color}`,
          borderRadius: 16,
          padding: "24px 24px 28px",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.06)",
        }}
      >
        {/* Track Header, Progress & Admin Add Topic */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
          <div>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 4px" }}>
              {track.icon} {track.title}
            </h3>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "var(--text-secondary)", margin: 0 }}>
              {track.description}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {isAdmin && (
              <button
                onClick={openAddTopicModal}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: `1.5px dashed ${track.color}`,
                  background: `${track.color}10`,
                  color: track.color,
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Plus size={14} /> Add Topic to {track.title}
              </button>
            )}

            {/* Progress Bar Badge */}
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 16px", minWidth: 200 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: "var(--text-secondary)" }}>Your Progress</span>
                <span style={{ color: track.color }}>{doneInTrack}/{totalInTrack} ({progressPercent}%)</span>
              </div>
              <div style={{ height: 8, background: "var(--border)", borderRadius: 999, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    background: track.color,
                    borderRadius: 999,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              {/* Sync Status */}
              <div style={{ marginTop: 6, fontSize: 11, fontFamily: "Inter, sans-serif", color: syncStatus === "error" ? "#EF4444" : syncStatus === "saving" ? "#F59E0B" : "#10B981", display: "flex", alignItems: "center", gap: 4 }}>
                {syncStatus === "saving" && <span>⟳ Syncing...</span>}
                {syncStatus === "saved" && <span>☁ Saved to cloud</span>}
                {syncStatus === "error" && <span>⚠ Offline — saved locally</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Topic Checklists with Clickable Detail View */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
          {track.steps && track.steps.map((step, idx) => {
            const isDone = completed.has(step.id);
            return (
              <div
                key={step.id}
                onClick={() => setSelectedStep(step)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: `1.5px solid ${isDone ? track.color + "55" : "var(--border)"}`,
                  background: isDone ? `${track.color}0D` : "var(--bg-secondary)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = track.color)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = isDone ? track.color + "55" : "var(--border)")}
              >
                <div onClick={(e) => toggleStep(step.id, e)} style={{ flexShrink: 0, padding: 2 }}>
                  {isDone ? (
                    <CheckCircle2 size={20} color={track.color} fill={`${track.color}22`} />
                  ) : (
                    <Circle size={20} color="var(--text-muted)" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      textDecoration: isDone ? "line-through" : "none",
                      opacity: isDone ? 0.75 : 1,
                      lineHeight: 1.4,
                    }}
                  >
                    {idx + 1}. {step.name}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {isAdmin && (
                    <>
                      <button
                        onClick={(e) => openEditTopicModal(step, e)}
                        title="Edit Topic (Admin)"
                        style={{ background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 5, padding: "3px 5px", cursor: "pointer", display: "flex" }}
                      >
                        <Pencil size={11} color="#4F46E5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteTopic(step.id, e)}
                        title="Delete Topic (Admin)"
                        style={{ background: "#FFF1F2", border: "1px solid #FFD5DA", borderRadius: 5, padding: "3px 5px", cursor: "pointer", display: "flex" }}
                      >
                        <Trash2 size={11} color="#FF4D6D" />
                      </button>
                    </>
                  )}
                  <span
                    style={{
                      fontSize: 10.5,
                      fontFamily: "'JetBrains Mono', monospace",
                      padding: "2px 7px",
                      borderRadius: 6,
                      background: "var(--surface)",
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    {step.level}
                  </span>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Detail Modal */}
      {selectedStep && (
        <div
          onClick={() => setSelectedStep(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(16,18,24,0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              borderTop: `4px solid ${track.color}`,
              borderRadius: 18,
              maxWidth: 580,
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "24px 24px 26px",
              animation: "popIn .18s ease",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", color: track.color, background: `${track.color}17`, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>
                  {track.title}
                </span>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: "8px 0 4px", lineHeight: 1.3 }}>
                  {selectedStep.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStep(null)}
                style={{ background: "var(--bg-secondary)", border: "none", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} color="var(--text-muted)" />
              </button>
            </div>

            {/* Subtopics */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <BookOpen size={15} color={track.color} /> Core Subtopics to Master:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(selectedStep.subtopics || []).map((st, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)", background: "var(--bg-secondary)", padding: "8px 12px", borderRadius: 8 }}>
                    <span style={{ color: track.color, fontWeight: 700 }}>•</span> {st}
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Questions */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <HelpCircle size={15} color="#FF4D6D" /> Top MNC Interview Questions:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(selectedStep.interviewQuestions || []).map((iq, i) => (
                  <div key={i} style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", background: "rgba(255, 77, 109, 0.06)", border: "1px solid rgba(255, 77, 109, 0.2)", padding: "8px 12px", borderRadius: 8 }}>
                    Q{i + 1}: {iq}
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
              <button
                onClick={() => toggleStep(selectedStep.id)}
                style={{
                  flex: 1,
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: completed.has(selectedStep.id) ? "var(--bg-secondary)" : track.color,
                  color: completed.has(selectedStep.id) ? "var(--text-primary)" : "#FFFFFF",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {completed.has(selectedStep.id) ? (
                  <>
                    <CheckCircle2 size={16} color="#00B37E" /> Mark Incomplete
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Mark as Completed
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setViewingTopicNotes(selectedStep);
                  setSelectedStep(null);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "11px 16px",
                  borderRadius: 10,
                  border: "1.5px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--text-primary)",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                View Notes <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add / Edit Topic Modal */}
      {topicModalOpen && (
        <div onClick={() => setTopicModalOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(16,18,24,0.65)", backdropFilter: "blur(4px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 16, maxWidth: 540, width: "100%", padding: 24, animation: "popIn .15s ease", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, margin: 0 }}>
                {isEditingTopic ? "Edit Roadmap Topic" : `Add Topic to ${track.title}`}
              </h3>
              <button onClick={() => setTopicModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>TOPIC TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Graph Algorithms (Dijkstra, Topological Sort)"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm((f) => ({ ...f, name: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>DIFFICULTY LEVEL</label>
                  <select
                    value={topicForm.level}
                    onChange={(e) => setTopicForm((f) => ({ ...f, level: e.target.value }))}
                    style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)" }}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>LINK TO NOTE SUBJECT</label>
                  <input
                    type="text"
                    placeholder="e.g. dsa, web, java, dbms"
                    value={topicForm.noteLinkSubject}
                    onChange={(e) => setTopicForm((f) => ({ ...f, noteLinkSubject: e.target.value }))}
                    style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>SUBTOPICS (1 PER LINE)</label>
                <textarea
                  placeholder="Prefix Sum Technique&#10;Two Pointers opposite direction&#10;Kadane's Algorithm"
                  rows={4}
                  value={topicForm.subtopicsText}
                  onChange={(e) => setTopicForm((f) => ({ ...f, subtopicsText: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--input-bg)", color: "var(--text-primary)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>TOP INTERVIEW QUESTIONS (1 PER LINE)</label>
                <textarea
                  placeholder="Two Sum in O(N)&#10;Trapping Rain Water&#10;Container With Most Water"
                  rows={3}
                  value={topicForm.questionsText}
                  onChange={(e) => setTopicForm((f) => ({ ...f, questionsText: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--input-bg)", color: "var(--text-primary)" }}
                />
              </div>

              <button
                onClick={handleSaveTopic}
                style={{ background: "#14151A", color: "#fff", padding: "12px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}
              >
                {isEditingTopic ? "Save Changes" : "Add Topic"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add New Track Modal */}
      {trackModalOpen && (
        <div onClick={() => setTrackModalOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(16,18,24,0.65)", backdropFilter: "blur(4px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 16, maxWidth: 480, width: "100%", padding: 24, animation: "popIn .15s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, margin: 0 }}>Create New Roadmap Track</h3>
              <button onClick={() => setTrackModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="text"
                placeholder="Track ID (e.g. python, devops, aiml)"
                value={trackForm.id}
                onChange={(e) => setTrackForm((f) => ({ ...f, id: e.target.value }))}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              />
              <input
                type="text"
                placeholder="Track Title (e.g. Python for Data Science)"
                value={trackForm.title}
                onChange={(e) => setTrackForm((f) => ({ ...f, title: e.target.value }))}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              />
              <div style={{ display: "flex", gap: 12 }}>
                <input
                  type="text"
                  placeholder="Emoji Icon (e.g. 🐍, ⚙️, 🤖)"
                  value={trackForm.icon}
                  onChange={(e) => setTrackForm((f) => ({ ...f, icon: e.target.value }))}
                  style={{ width: "120px", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                />
                <input
                  type="text"
                  placeholder="Color Hex (e.g. #00B37E)"
                  value={trackForm.color}
                  onChange={(e) => setTrackForm((f) => ({ ...f, color: e.target.value }))}
                  style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                />
              </div>
              <textarea
                placeholder="Short track description..."
                rows={2}
                value={trackForm.description}
                onChange={(e) => setTrackForm((f) => ({ ...f, description: e.target.value }))}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--input-bg)", color: "var(--text-primary)" }}
              />
              <button
                onClick={handleCreateTrack}
                style={{ background: "#14151A", color: "#fff", padding: "12px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}
              >
                Create Track
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



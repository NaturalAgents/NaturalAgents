<div align="center">
    <img src="./frontend/public/static/images/logo.svg" alt="Logo" width="200">
    <h1 align="center">NaturalAgents</h1>
    <div align="center">Anyone can build custom agents!</div>
    <div align="center" style="margin-top: 20px;">
        <!-- Navigation Links with Dashes -->
        <a href="https://naturalagents.github.io/NaturalAgents/learn/installation" style="margin: 0 15px; text-decoration: none; font-weight: bold;">Docs</a>
        - 
        <a href="https://naturalagents.github.io/NaturalAgents/showcase" style="margin: 0 15px; text-decoration: none; font-weight: bold;">Showcase</a>
        - 
        <a href="https://naturalagents.github.io/NaturalAgents/roadmap" style="margin: 0 15px; text-decoration: none; font-weight: bold;">Roadmap</a>
    </div>
</div>

## 😎 Demo

https://github.com/user-attachments/assets/4a2c5c10-e2c0-4b2f-b979-c5a07d42471d

## ⚡ Quick Start

1. Clone the github

```
git clone https://github.com/NaturalAgents/NaturalAgents.git
cd NaturalAgents
```

2. Make workspace folder

```
mkdir workspace
cd workspace
```

3. Create a .env file and store openai api key credentials

```
OPENAI_API_KEY=<your_api_key>
```

4. Run playground from root directory

```
docker-compose up --build
```

## 🤝 How to Contribute

NaturalAgents is a community-driven project, and we welcome contributions from everyone! There are many ways to be involved:

1. Code contributions - help us develop new macros, frontend interfaces, and backend infrastructure for executing agentic workflows
2. Usability research/design - ideate best possible features and UI/UX organizations with us (we want this software to be as usable/inuitive as possible)
3. Feedback and testing - let us know what is working well, what could be improved, and what you'd like to see

## 💪 Motivation

We're making it easy for anyone to build Agents and custom workflows with AI using just plain english. We aim to democratize the power of agents to everyone

## 🚀 Updates

- Oct 11, 2024 - save and recall recipe files for later
- Oct 9, 2024 - added summarization macro
- Oct 6, 2024 - MVP editor; includes prompting and image generation macros

## 🔥 Upcoming Roadmap

- **Create more diverse macros:** `search the web`, `text to audio`, `repeat`
- **Include inputs:** `user inputs`, `PDFs`, `images`, `audio`, `postgres database`
- **Better agent communication -** explore most usuable editor rules to chain agent responses together

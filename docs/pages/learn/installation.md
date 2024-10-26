# Installation

## System Requirements

- Docker

## Setup

Clone the repo

```git
git clone https://github.com/NaturalAgents/NaturalAgents.git
```

Create your workspace

```bash
mkdir workspace
```

Create .env file with OpenAI API credentials

```bash
echo OPENAI_API_KEY=<your_api_key> > workspace/.env
```

Start the docker!

```bash
docker-compose up --build
```

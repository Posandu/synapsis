# Synapsis

View the web app [here](https://synapsis.posandu.com/).

Synapsis is a web app designed to enhance note-taking and study efficiency through advanced AI features. This README provides an overview of the project, installation instructions, and usage guidelines.

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Contributing](#contributing)
5. [License](#license)

## Introduction

Synapsis aims to revolutionize how users interact with their study materials by offering intelligent note organization, context-aware insights, and seamless integration with various educational tools. Built with cutting-edge technology, Synapsis is designed to make learning more efficient and effective.

## Installation

To get started with Synapsis, follow these steps:

### Environment Setup

Make sure to add these in an .env file:

```yaml
DATABASE_URL="" # Postgres database URL
GOOGLE_AI_API_KEY="" # Google Gemini API key
OPENAI_API_KEY="" # OpenAI API key
INNGEST="" # Inngest API key
```

1. **Clone the repository**:

```bash
git clone https://github.com/Posandu/synapsis.git
```

2. **Navigate to the project directory**:

```bash
cd synapsis
```

3. **Install dependencies**:

```bash
bun install
```

4. **Start the development server**:

```bash
bun run dev
```

5. **Open your browser** and go to `http://localhost:5173` to see the app in action.

## Usage

1. **Create an account** or **log in** to access your study materials.
2. **Upload your notes** and **explore** the AI-powered features.

## Contributing

We welcome contributions to Synapsis! If you'd like to help improve the app, please follow these guidelines:

1. **Fork the repository** and create a new branch for your changes.
2. **Submit a pull request** with a detailed description of your modifications.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

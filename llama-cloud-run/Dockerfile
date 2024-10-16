# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies and supervisord
RUN apt-get update && apt-get install -y \
    curl \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama CLI using the correct install script
RUN curl -fsSL https://ollama.com/install.sh | sh

# Add Ollama to PATH
ENV PATH="/root/.ollama/bin:${PATH}"

# Verify Ollama installation
RUN ollama --version

# Create and set the working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY app/ .

# Pull the LLaMA 3.2 1B model
RUN ollama pull llama3.2:1b

# Copy supervisord configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose the necessary ports
EXPOSE 8000 11434

# Start supervisord to manage Ollama and FastAPI
CMD ["/usr/bin/supervisord"]

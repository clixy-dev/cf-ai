# Product Requirements Document (PRD) - Co-Founder AI Tool

## Overview
This PRD outlines the features of the Co-Founder AI Tool, a platform designed to act as a **central dashboard and hub** for startup founders, providing persistent, context-aware advice, business insights, financial analysis, and organizational tools. The tool leverages Retrieval-Augmented Generation (RAG) to remember past interactions and tailors responses based on user-defined settings. It also processes documents to enrich its memory and provide deeper insights. The technical stack includes **Supabase**, **PostgreSQL**, **Pinecone**, **n8n**, **OpenAI**, **Next.js**, and **Vercel**.

---

## Features

### 1. Persistent Memory
- **Description**: The AI remembers conversation history and contextual information across sessions.
- **Functionality**:
  - Stores and retrieves historical conversation context using **Supabase (PostgreSQL)** as the memory store.
  - Updates memory with new interactions after each chat session.
  - Utilizes Supabase’s real-time capabilities to ensure seamless context retrieval and updates.

### 2. Customization (updated)
- **Description**: Allows founders to define preferences such as tone, terminology, personality traits, and **a custom name for the AI**.
- **Functionality**:
  - **Customization Dashboard**:
    - A dedicated page in the **Next.js** application where users can configure preferences (e.g., AI name, tone, terminology).
    - Users can personalize the AI’s name to create a more engaging experience.
  - Fetches user preferences (including AI name) from **Supabase** during chat processing.
  - Personalizes responses based on stored customization settings.

### 3. Dynamic Processing
- **Description**: Uses a multi-agent workflow to decide whether a query requires deep, high-context processing or can be handled with a simpler response.
- **Functionality**:
  - **Pre-Processing Decision Node**:
    - Analyzes the query and available context to set a flag (`useHighContext`).
  - **High-Context Branch**:
    - Aggregates historical context from **Supabase**.
    - Retrieves customization settings from **Supabase**.
    - Constructs detailed prompts combining context, query, and settings.
    - Sends the prompt to the LLM API for a context-rich response.
    - Optionally reviews the response through a secondary LLM call for refinement.
  - **Normal Chat Branch**:
    - Processes simpler queries with a lightweight chat agent.
    - Updates the memory store in **Supabase** accordingly.

### 4. Document Integration
- **Description**: Supports document uploads and processing to integrate external data into the conversation context.
- **Functionality**:
  - **File Upload API**:
    - Handles file uploads and stores metadata (e.g., `userId`, file URL, document identifier) in **Supabase**.
  - **Text Extraction**:
    - Calls an external API (e.g., OpenAI Document AI) to extract text from uploaded files.
  - **Document Chunking**:
    - Splits extracted text into manageable segments (e.g., 1,000-token chunks).
  - **Embedding Generation**:
    - Creates vector embeddings for each text chunk using an embedding generation API (e.g., OpenAI’s text-embedding model).
  - **Upsert Embeddings**:
    - Updates the **Pinecone vector database** with embeddings, tagging them with the user’s UID **and associated business ID** (updated).
  - **Update Document Metadata**:
    - Logs the processing status in **Supabase** (e.g., from "pending" to "processed").
  - **Notifications**:
    - Notifies users via WebSocket server when document processing is complete.

### 5. Business Management (updated)
- **Description**: Enables users to organize data, folders, and insights into separate workspaces for multiple businesses while allowing reference across businesses.
- **Functionality**:
  - **Business Creation & Switching**:
    - Users can create, name, and switch between distinct business profiles.
  - **Data Segregation & Cross-Referencing**:
    - All stored data (conversations, documents, insights) are tagged with a `businessId` to ensure accurate separation while allowing cross-referencing.
  - **Unified Dashboard**:
    - A central hub displays aggregated insights, tasks, and updates across all businesses.
  - **Role-Based Access** (future):
    - Supports team collaboration with permissions tied to specific business profiles.

### 6. Real-Time Interaction
- **Description**: Provides fast, real-time chat capabilities along with asynchronous notifications.
- **Functionality**:
  - **Chat Interface**:
    - A responsive Progressive Web App (PWA) built with **Next.js**, featuring a custom chat UI with auto-scrolling and message display.
  - **Real-Time Notifications**:
    - Integrates with **Supabase’s real-time capabilities** for immediate updates on chat interactions and document processing.

### 7. Business & Financial Analysis Module (updated)
- **Description**: Analyzes business ideas, financial data, and market trends to generate actionable insights.
- **Functionality**:
  - **Financial Modeling**:
    - Interprets financial data (e.g., revenue projections, cash flow, market trends) to provide forecasts and risk assessments (updated).
  - **Idea Validation**:
    - Generates market insights or feasibility reports based on user input.
  - **Insight Storage**:
    - Stores analysis outputs in **Supabase**, tagged to the relevant business profile.

### 8. Robust Error Handling
- **Description**: Ensures the system is reliable and can handle errors gracefully.
- **Functionality**:
  - Includes catch nodes in workflows for centralized error logging (e.g., Sentry or similar tools).
  - Implements retries with exponential backoff for failed operations.
  - Logs errors to **Supabase** for monitoring and debugging.

### 9. Deployment & Scaling
- **Description**: Ensures the system can be deployed and scaled efficiently using **Vercel** and **Supabase**.
- **Functionality**:
  - **Local Development & Prototyping**:
    - Start with local development using **Next.js** and **Supabase**.
  - **Cloud Deployment**:
    - Deploy the **Next.js** application to **Vercel** for seamless scaling and performance optimization.
    - Use **Supabase** for backend services, including database, authentication, and real-time capabilities.
  - **CI/CD Pipeline**:
    - Use **Vercel’s built-in CI/CD pipeline** for automated testing and deployment.
  - **Monitoring**:
    - Set up monitoring and logging using **Vercel’s analytics** and **Supabase’s logging features** to track performance, usage, and errors.

---

## Conclusion
The Co-Founder AI Tool is designed to be a **central hub** for startup founders, combining persistent memory, multi-business management, financial analysis, and real-time collaboration. By leveraging **Supabase**, **PostgreSQL**, **Next.js**, **Vercel**, **n8n for automation**, and **Pinecone for document vector storage**, the platform ensures scalability, real-time capabilities, and a seamless user experience. The tool now includes enhanced personalization (e.g., AI naming), robust organization for multiple businesses, and advanced financial modeling to deliver a comprehensive solution for founders.

---

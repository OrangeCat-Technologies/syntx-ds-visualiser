<h1 align="center">
  <img src="./public/favicon.ico" alt="DS Visualiser icon" width="28">&nbsp;
  DS Visualiser: AI-powered Data Visualization
</h1>


<p align="center">
  🪄 Explore data with visualizations, powered by AI agents.
</p>

## Overview

**DS Visualiser** is an OrangeCat project for data exploration with visualizations powered by AI agents.

DS Visualiser enables analysts to iteratively explore and visualize data. Started with data in any format (screenshot, text, csv, or database), users can work with AI agents with a novel blended interface that combines *user interface interactions (UI)* and *natural language (NL) inputs* to communicate their intents, control branching exploration directions, and create reports to share their insights. 

## Get Started

  You can build DS Visualiser locally if you prefer full control over your development environment and develop your own version on top. For detailed instructions, refer to [DEVELOPMENT.md](DEVELOPMENT.md).


## Using DS Visualiser

### Load Data

Besides uploading csv, tsv or xlsx files that contain structured data, you can ask DS Visualiser to extract data from screenshots, text blocks or websites, or load data from databases use connectors. Then you are ready to explore.

<img width="1920" alt="image" src="https://github.com/user-attachments/assets/e23cdb47-984c-4ce4-a014-8f36e025e393" />

### Explore Data

There are four levels to explore data based depending on whether you want more vibe or more control:

- Level 1 (most control): Create charts with UI via drag-and-drop, if all fields to be visualized are already in the data.
- Level 2: Specify chart designs with natural language + NL. Describe how new fields should be visualized in your chart, AI will automatically transform data to realize the design.
- Level 3: Get recommendations: Ask AI agents to recommend charts directly from NL descriptions, or even directly ask for exploration ideas.
- Level 4 (most vibe): In agent mode, provide a high-level goal and let AI agents automatically plan and explore data in multiple turns. Exploration threads will be created automatically.

https://github.com/user-attachments/assets/164aff58-9f93-4792-b8ed-9944578fbb72

- Level 5: In practice, leverage all of them to keep up with both vibe and control!

### Create Reports

Use the report builder to compose a report of the style you like, based on selected charts. Then share the reports to others!

<!-- 
### The basics of data visualization
* Set up model provider, for agentic experience, model with reasoning and strong code generation ablity is recommended.
* Describe the exploration 

https://github.com/user-attachments/assets/0fbea012-1d2d-46c3-a923-b1fc5eb5e5b8


### Create visualization beyond the initial dataset (powered by 🤖)
* You can type names of **fields that do not exist in current data** in the encoding shelf:
    - this tells DS Visualiser that you want to create visualizations that require computation or transformation from existing data,
    - you can optionally provide a natural language prompt to explain and clarify your intent (not necessary when field names are self-explanatory).
* Click the **Formulate** button.
    - DS Visualiser will transform data and instantiate the visualization based on the encoding and prompt.
* Inspect the data, chart and code.
* To create a new chart based on existing ones, follow up in natural language:
    - provide a follow up prompt (e.g., *``show only top 5!''*),
    - you may also update visual encodings for the new chart.

https://github.com/user-attachments/assets/160c69d2-f42d-435c-9ff3-b1229b5bddba

https://github.com/user-attachments/assets/c93b3e84-8ca8-49ae-80ea-f91ceef34acb

Repeat this process as needed to explore and understand your data. Your explorations are trackable in the **Data Threads** panel.  -->

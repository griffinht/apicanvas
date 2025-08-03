# [APICanvas](https://oas2tree2.vercel.app)

Node Based OpenAPI Design tool

<img width="1470" alt="Screenshot 2025-04-16 at 2 30 45 PM" src="https://github.com/user-attachments/assets/d2aa65db-3daf-403c-9b1c-dc0c94cad71e" />


https://github.com/user-attachments/assets/f354705c-2653-4b47-bca7-515b4981e187


## Features

| | [APICanvas](https://oas2tree2.vercel.app) | [Apibldr](https://www.apibldr.com/) | [Swagger Editor](https://editor.swagger.io/) | [Stoplight Studio](https://github.com/stoplightio/studio) | [Postman](https://www.postman.com/api-design/) | [API Fiddle](https://api-fiddle.com/) | [OpenAPI-GUI](https://mermade.github.io/openapi-gui/) |
|---------|----------|----------|----------------|-----------|-----------|-----------|-----------|
| Visual API Design | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Code Generation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Path Edit | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Schema Edit | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Node Based UI](https://github.com/xyflow/awesome-node-based-uis) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Alternatives

https://apis.guru/awesome-openapi3/category.html#editors

https://openapi.tools/#gui-editors

## Research Paper (todo)

## Conferences (todo)

## Implementation Details

Our tool is implemented using React, with [React Flow](https://reactflow.dev/) used for the node-based visual editor and [Monaco](https://github.com/microsoft/monaco-editor) for the YAML editing interface.  Monaco Editor offers syntax highlighting, code folding, and autocompletion for YAML. The highlight-jump feature is implemented using a custom string matching algorithm over the raw YAML, a manually engineered workaround that mimics the interactive behavior of IDEs despite having no formal AST tracking.

The YAML editor is implemented using Monaco Editor, which offers syntax highlighting, code folding, and autocompletion for YAML. Inspired by [OAS2Tree](https://github.com/souhailaS/OAS2Tree), the application also includes a highlight-jump feature: When users click on a node in the tree, the corresponding YAML is highlighted in the editor. The highlight is implemented using a custom string matching algorithm over the raw YAML - a manually engineered workaround that mimics the interactive behavior of IDEs despite having no formal AST tracking.

The synchronization feature is handled by a custom serialization/deserialization system that converts React Flow nodes and edges to and from a valid OpenAPI JSON object. This object is then serialized into YAML using a lightweight [YAML-to-JSON library](https://www.npmjs.com/package/js-yaml). In practice, dual sync mode is convenient but may result in lost work if synchronization conflicts between the graphical representation and its corresponding OpenAPI specification arise, especially when manual edits do not align with the internal JSON structure. To mitigate this, users are advised to select their sync mode carefully and are prompted with warnings when enabling dual sync.

Specification state is stored locally in the browser, and the tree visualization is generated from a custom transformation between OpenAPI JSON and a graph structure compatible with React Flow. The tree structure is rendered as a directed graph using the [Dagre.js](https://github.com/dagrejs/dagre) layout engine.

Currently, our tool is deployed as a static frontend-only web application, hosted via Vercel. It requires no installation and does not rely on backend services, and runs entirely in the browser. This makes it possible to work offline or be embedded into other web-based applications and development environments without requiring server modifications or backend support. 

flowchart TD

subgraph group_frontend["React frontend"]
  node_routes_ui["App routes<br/>[app.routes.jsx]"]
  node_auth_pages["Auth pages"]
  node_auth_hook["Auth hook<br/>[useAuth.js]"]
  node_auth_api["Auth API<br/>[auth.api.js]"]
  node_protected["Protected route<br/>[Protected.jsx]"]
  node_dashboard["Chat dashboard<br/>[Dashboard.jsx]"]
  node_chat_api["Chat API<br/>[chat.api.js]"]
  node_chat_socket["Chat socket<br/>[chat.socket.js]"]
end

subgraph group_backend["Express backend"]
  node_auth_routes["Auth routes<br/>[auth.routes.js]"]
  node_chat_routes["Chat routes<br/>[chat.routes.js]"]
  node_auth_middleware["Auth middleware<br/>[auth.middleware.js]"]
  node_auth_controller["Auth controller<br/>[auth.controller.js]"]
  node_chat_controller["Chat controller<br/>[chat.controller.js]"]
  node_socket_server["Socket server<br/>[server.socket.js]"]
  node_ai_service["AI agent<br/>[ai.service.js]"]
  node_web_service["Web search tool<br/>[web.service.js]"]
  node_mail_service["Mail service<br/>[mail.service.js]"]
end

subgraph group_data["Chat and account data"]
  node_user_model["User model<br/>[user.model.js]"]
  node_chat_model["Chat model<br/>[chat.model.js]"]
  node_message_model["Message model<br/>[message.model.js]"]
end

subgraph group_integrations["External integrations"]
  node_mongo[("MongoDB")]
  node_ai_provider{{"Groq AI"}}
  node_email_provider{{"Email service"}}
  node_search_provider{{"Web search"}}
end

node_user(("User"))

node_user -->|"uses"| node_routes_ui
node_routes_ui -->|"routes to"| node_auth_pages
node_routes_ui -->|"protects"| node_protected
node_protected -->|"shows"| node_dashboard
node_auth_pages -->|"submits to"| node_auth_hook
node_auth_hook -->|"calls"| node_auth_api
node_auth_api -->|"HTTP requests"| node_auth_routes
node_auth_routes -->|"guards"| node_auth_middleware
node_auth_routes -->|"dispatches"| node_auth_controller
node_auth_controller -->|"reads and writes"| node_user_model
node_auth_controller -->|"sends verification"| node_mail_service
node_mail_service -->|"delivers email"| node_email_provider
node_dashboard -->|"uses"| node_chat_api
node_chat_api -->|"HTTP requests"| node_chat_routes
node_chat_routes -->|"guards"| node_auth_middleware
node_chat_routes -->|"dispatches"| node_chat_controller
node_chat_controller -->|"reads and writes"| node_chat_model
node_chat_controller -->|"reads and writes"| node_message_model
node_chat_controller -->|"generates title and reply"| node_ai_service
node_ai_service -->|"invokes"| node_ai_provider
node_ai_service -->|"uses tool"| node_web_service
node_web_service -.->|"searches"| node_search_provider
node_chat_controller -->|"emits events"| node_socket_server
node_chat_socket -->|"connects and joins"| node_socket_server
node_user_model -->|"persists users"| node_mongo
node_chat_model -->|"persists chats"| node_mongo
node_message_model -->|"persists messages"| node_mongo

click node_routes_ui "https://github.com/dakshchauhan2005/snapseek/blob/main/FRONTEND/src/app/app.routes.jsx"
click node_auth_pages "https://github.com/dakshchauhan2005/snapseek/tree/main/FRONTEND/src/features/auth/pages"
click node_auth_hook "https://github.com/dakshchauhan2005/snapseek/blob/main/FRONTEND/src/features/auth/hook/useAuth.js"
click node_auth_api "https://github.com/dakshchauhan2005/snapseek/blob/main/FRONTEND/src/features/auth/services/auth.api.js"
click node_protected "https://github.com/dakshchauhan2005/snapseek/blob/main/FRONTEND/src/features/auth/components/Protected.jsx"
click node_dashboard "https://github.com/dakshchauhan2005/snapseek/blob/main/FRONTEND/src/features/chat/pages/Dashboard.jsx"
click node_chat_api "https://github.com/dakshchauhan2005/snapseek/blob/main/FRONTEND/src/features/chat/services/chat.api.js"
click node_chat_socket "https://github.com/dakshchauhan2005/snapseek/blob/main/FRONTEND/src/features/chat/chat.socket.js"
click node_auth_routes "https://github.com/dakshchauhan2005/snapseek/blob/main/BACKEND/routes/auth.routes.js"
click node_chat_routes "https://github.com/dakshchauhan2005/snapseek/blob/main/BACKEND/routes/chat.routes.js"
click node_auth_middleware "https://github.com/dakshchauhan2005/snapseek/blob/main/BACKEND/middleware/auth.middleware.js"
click node_auth_controller "https://github.com/dakshchauhan2005/snapseek/blob/main/BACKEND/controller/auth.controller.js"
click node_chat_controller "https://github.com/dakshchauhan2005/snapseek/blob/main/BACKEND/controller/chat.controller.js"
click node_socket_server "https://github.com/dakshchauhan2005/snapseek/blob/main/BACKEND/socket/server.socket.js"
click node_ai_service "https://github.com/dakshchauhan2005/snapseek/blob/main/BACKEND/services/ai.service.js"
click node_web_service "https://github.com/dakshchauhan2005/snapseek/blob/main/BACKEND/services/web.service.js"
click node_mail_service "https://github.com/dakshchauhan2005/snapseek/blob/main/BACKEND/services/mail.service.js"
click node_user_model "https://github.com/dakshchauhan2005/snapseek/blob/main/BACKEND/model/user.model.js"
click node_chat_model "https://github.com/dakshchauhan2005/snapseek/blob/main/BACKEND/model/chat.model.js"
click node_message_model "https://github.com/dakshchauhan2005/snapseek/blob/main/BACKEND/model/message.model.js"

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a
class node_routes_ui,node_auth_pages,node_auth_hook,node_auth_api,node_protected,node_dashboard,node_chat_api,node_chat_socket,node_user toneBlue
class node_auth_routes,node_chat_routes,node_auth_middleware,node_auth_controller,node_chat_controller,node_socket_server,node_ai_service,node_web_service,node_mail_service toneAmber
class node_user_model,node_chat_model,node_message_model toneMint
class node_mongo,node_ai_provider,node_email_provider,node_search_provider toneRose
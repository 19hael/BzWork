import { Database } from "@/lib/supabase/database.types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];
type Project = Database["public"]["Tables"]["projects"]["Row"];

const simulateDelay = (ms = 1500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function simulateTaskSuggestions(project: Project) {
  await simulateDelay(2000);
  const suggestions = {
    development: [
      "Set up development environment and dependencies",
      "Create database schema and migrations",
      "Implement authentication system",
      "Build API endpoints for core features",
      "Write unit tests for critical components",
      "Set up CI/CD pipeline",
      "Create documentation for API",
    ],
    marketing: [
      "Research target audience and competitors",
      "Develop brand messaging and positioning",
      "Create content calendar for Q1",
      "Design social media campaign",
      "Set up analytics and tracking",
      "Launch email marketing campaign",
      "Prepare case studies and testimonials",
    ],
    design: [
      "Conduct user research and interviews",
      "Create user personas and journey maps",
      "Design wireframes for key screens",
      "Develop high-fidelity mockups",
      "Create design system and component library",
      "Run usability testing sessions",
      "Prepare design handoff documentation",
    ],
  };
  const projectText = `${project.name} ${project.description ?? ""}`.toLowerCase();
  if (
    projectText.includes("dev") ||
    projectText.includes("tech") ||
    projectText.includes("software")
  ) {
    return suggestions.development.slice(0, 5);
  }
  if (
    projectText.includes("market") ||
    projectText.includes("campaign") ||
    projectText.includes("content")
  ) {
    return suggestions.marketing.slice(0, 5);
  }
  if (
    projectText.includes("design") ||
    projectText.includes("ui") ||
    projectText.includes("ux")
  ) {
    return suggestions.design.slice(0, 5);
  }
  return [
    suggestions.development[0],
    suggestions.marketing[0],
    suggestions.design[0],
    suggestions.development[1],
    suggestions.marketing[1],
  ];
}

export async function simulateFormulaAssist(naturalLanguageQuery: string) {
  await simulateDelay(1800);
  const query = naturalLanguageQuery.toLowerCase();
  if (
    query.includes("sum") ||
    query.includes("total") ||
    query.includes("suma")
  ) {
    return {
      formula: "=SUM(B2:B10)",
      explanation:
        "Suma los valores del rango B2 a B10. Útil para calcular totales rápidos.",
      example:
        "Si B2:B10 contiene [10, 20, 30, 40, 50], el resultado será 150.",
    };
  }
  if (
    query.includes("average") ||
    query.includes("promedio") ||
    query.includes("mean")
  ) {
    return {
      formula: "=AVERAGE(C2:C50)",
      explanation:
        "Calcula el promedio aritmético del rango seleccionado.",
      example: "Ideal para obtener la media de ingresos mensuales.",
    };
  }
  if (
    query.includes("count") ||
    query.includes("contar") ||
    query.includes("cuantos")
  ) {
    return {
      formula: '=COUNTIF(D2:D100, "Completed")',
      explanation:
        "Cuenta cuántas celdas contienen el texto solicitado en un rango.",
      example: "Útil para contar tareas completadas por estado.",
    };
  }
  if (query.includes("if") || query.includes("condition") || query.includes("si")) {
    return {
      formula: '=IF(E2>1000, "High Value", "Standard")',
      explanation:
        "Evalúa una condición y devuelve diferentes resultados según el valor.",
      example:
        "Clasifica clientes según el monto de contrato esperado.",
    };
  }
  if (
    query.includes("vlookup") ||
    query.includes("buscar") ||
    query.includes("lookup")
  ) {
    return {
      formula: "=VLOOKUP(A2, DataSheet!A:C, 3, FALSE)",
      explanation:
        "Busca un valor en la primera columna de otra hoja y devuelve una columna relacionada.",
      example:
        "Trae el contacto asignado para una oportunidad desde otra tabla.",
    };
  }
  return {
    formula: "=SUM(A2:A10) / COUNT(A2:A10)",
    explanation:
      "Calcula el promedio manual dividiendo la suma entre la cantidad de elementos.",
    example:
      "Punto de partida cuando necesitas un cálculo rápido sin conocer la función precisa.",
  };
}

export async function simulateAutomationBuilder(description: string) {
  await simulateDelay(2500);
  const desc = description.toLowerCase();
  let trigger = { type: "manual", config: {} };
  if (desc.includes("when task") || desc.includes("cuando tarea")) {
    trigger = { type: "task_update", config: { field: "status", value: "done" } };
  } else if (
    desc.includes("every day") ||
    desc.includes("cada día") ||
    desc.includes("daily")
  ) {
    trigger = { type: "schedule", config: { cron: "0 9 * * *", timezone: "UTC" } };
  } else if (
    desc.includes("new project") ||
    desc.includes("nuevo proyecto")
  ) {
    trigger = { type: "project_create", config: {} };
  }
  const actions: Array<{
    type: string;
    config: Record<string, unknown>;
    description: string;
  }> = [];
  if (
    desc.includes("email") ||
    desc.includes("correo") ||
    desc.includes("notify")
  ) {
    actions.push({
      type: "send_email",
      config: {
        to: "{{assigned_user.email}}",
        subject: "Task Update Notification",
        body: 'Task "{{task.title}}" changed to {{task.status}}',
      },
      description: "Notify task owner by email",
    });
  }
  if (desc.includes("slack") || desc.includes("message")) {
    actions.push({
      type: "send_slack",
      config: {
        channel: "#general",
        message: "Task {{task.title}} completed by {{user.name}}",
      },
      description: "Post outcome in Slack",
    });
  }
  if (
    desc.includes("update") ||
    desc.includes("actualizar") ||
    desc.includes("change")
  ) {
    actions.push({
      type: "update_task",
      config: { field: "tags", value: ["completed", "automated"] },
      description: "Tag the task for analytics",
    });
  }
  if (desc.includes("create") || desc.includes("crear")) {
    actions.push({
      type: "create_task",
      config: {
        title: "Follow-up: Review {{task.title}}",
        project_id: "{{task.project_id}}",
        assigned_to: "{{task.created_by}}",
        due_date: "{{now + 7 days}}",
      },
      description: "Create a follow-up task",
    });
  }
  if (
    desc.includes("spreadsheet") ||
    desc.includes("hoja") ||
    desc.includes("log")
  ) {
    actions.push({
      type: "append_spreadsheet",
      config: {
        spreadsheet_id: "auto-detect",
        row: ["{{task.title}}", "{{task.status}}", "{{now}}", "{{user.name}}"],
      },
      description: "Log activity in spreadsheets",
    });
  }
  if (actions.length === 0) {
    actions.push({
      type: "send_notification",
      config: {
        user_id: "{{trigger.user_id}}",
        message: "Automation triggered",
      },
      description: "Send in-app alert",
    });
  }
  return {
    name: `Auto-generated: ${description.slice(0, 50)}`,
    trigger,
    actions,
    estimatedExecutionTime: `${actions.length * 500}ms`,
  };
}

export async function simulateProjectInsights(project: Project, tasks: Task[]) {
  await simulateDelay(2200);
  const projectTasks = tasks.filter((task) => task.project_id === project.id);
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((task) => task.status === "done").length;
  const inProgressTasks = projectTasks.filter(
    (task) => task.status === "in_progress"
  ).length;
  const overdueTasks = projectTasks.filter(
    (task) =>
      task.due_date &&
      new Date(task.due_date) < new Date() &&
      task.status !== "done"
  ).length;
  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const highPriorityTasks = projectTasks.filter((task) =>
    ["high", "urgent"].includes(task.priority)
  ).length;
  const unassignedTasks = projectTasks.filter((task) => !task.assigned_to).length;
  const estimatedHours = projectTasks.reduce(
    (sum, task) => sum + (Number(task.estimated_hours) || 0),
    0
  );
  const actualHours = projectTasks.reduce(
    (sum, task) => sum + (Number(task.actual_hours) || 0),
    0
  );
  const hoursVariance =
    estimatedHours === 0
      ? 0
      : Math.round(((actualHours - estimatedHours) / estimatedHours) * 100);
  const recommendations: string[] = [];
  if (unassignedTasks > totalTasks * 0.2) {
    recommendations.push(
      `Asignar ${unassignedTasks} tareas sin responsable para mejorar accountability`
    );
  }
  if (overdueTasks > 0) {
    recommendations.push(
      `Reprogramar o priorizar ${overdueTasks} tareas vencidas para recuperar el timeline`
    );
  }
  if (completionRate < 50 && totalTasks > 10) {
    recommendations.push(
      "Considerar dividir tareas grandes en subtareas más manejables"
    );
  }
  if (hoursVariance > 20) {
    recommendations.push(
      "Las estimaciones se desvían más de 20%. Revisar proceso de estimación"
    );
  }
  if (highPriorityTasks > totalTasks * 0.5) {
    recommendations.push(
      "Exceso de tareas críticas. Re-evaluar prioridades del sprint"
    );
  }
  if (recommendations.length === 0) {
    recommendations.push("El proyecto está en buen camino. Mantener el ritmo actual");
  }
  const risks: { level: "low" | "medium" | "high"; message: string }[] = [];
  if (overdueTasks > totalTasks * 0.3) {
    risks.push({
      level: "high",
      message: `${overdueTasks} tareas vencidas representan riesgo significativo al timeline`,
    });
  } else if (overdueTasks > 0) {
    risks.push({
      level: "medium",
      message: `${overdueTasks} tareas vencidas requieren atención`,
    });
  }
  if (
    completionRate < 30 &&
    project.end_date &&
    new Date(project.end_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ) {
    risks.push({
      level: "high",
      message: "Deadline en menos de 30 días con menos del 30% completado",
    });
  }
  if (unassignedTasks > totalTasks * 0.3) {
    risks.push({
      level: "medium",
      message: `${unassignedTasks} tareas sin asignar pueden frenar entregas`,
    });
  }
  if (risks.length === 0) {
    risks.push({
      level: "low",
      message: "No se detectaron riesgos significativos",
    });
  }
  return {
    summary: `Proyecto "${project.name}" está ${completionRate}% completo con ${inProgressTasks} tareas activas.`,
    metrics: [
      { label: "Completion Rate", value: `${completionRate}%`, trend: completionRate > 50 ? "up" : "down" },
      { label: "Tasks Completed", value: `${completedTasks}/${totalTasks}` },
      { label: "In Progress", value: inProgressTasks },
      { label: "Overdue", value: overdueTasks, trend: overdueTasks > 0 ? "down" : "neutral" },
      { label: "Estimated Hours", value: Math.round(estimatedHours) },
      {
        label: "Actual Hours",
        value: Math.round(actualHours),
        insight: hoursVariance !== 0 ? `${hoursVariance > 0 ? "+" : ""}${hoursVariance}% vs estimate` : undefined,
      },
      { label: "High Priority", value: highPriorityTasks },
      { label: "Unassigned", value: unassignedTasks, trend: unassignedTasks > 0 ? "down" : "neutral" },
    ],
    recommendations,
    risks,
  };
}

export async function simulateAIChatResponse(
  userMessage: string,
  context: { workspaceId: string; userId: string }
) {
  await simulateDelay(1500);
  const msg = userMessage.toLowerCase();
  const workspaceSuffix = context.workspaceId.slice(-4);
  if (msg.includes("create") || msg.includes("new") || msg.includes("add")) {
    if (msg.includes("project")) {
      return {
        message:
          "I can help you create a new project. Provide a name, optional description, dates, and budget. Ready to start?",
        suggestedActions: [
          { label: "Create from template", action: "show_templates" },
          { label: "Create blank project", action: "open_create_dialog" },
        ],
      };
    }
    if (msg.includes("task")) {
      return {
        message:
          "Happy to add a task. Share the project name or let me fetch your active initiatives.",
        suggestedActions: [
          { label: "Show active projects", action: "list_projects" },
          { label: "Quick add to last project", action: "quick_add_task" },
        ],
      };
    }
  }
  if (msg.includes("status") || msg.includes("how") || msg.includes("progress")) {
    return {
      message:
        `Workspace ${workspaceSuffix} snapshot: 3 active projects, 24 tasks in progress, 67% completion, 2 overdue items. Want a deeper dive?`,
      suggestedActions: [
        { label: "Show overdue tasks", action: "filter_overdue" },
        { label: "Project breakdown", action: "show_insights" },
      ],
    };
  }
  if (msg.includes("help") || msg.includes("what can you")) {
    return {
      message:
        "I can assist with project planning, spreadsheet formulas, automation ideas, and portfolio insights. What should we tackle?",
      suggestedActions: [
        { label: "Analyze my projects", action: "run_analysis" },
        { label: "Build an automation", action: "open_automation_builder" },
      ],
    };
  }
  return {
    message:
      "Sure. Tell me if you want to manage projects, analyze data, or build automations and I will jump in.",
    suggestedActions: [
      { label: "Manage projects", action: "navigate_projects" },
      { label: "Analyze data", action: "navigate_spreadsheets" },
      { label: "Build automation", action: "navigate_automations" },
    ],
  };
}

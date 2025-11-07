CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
  color TEXT DEFAULT '#3b82f6',
  start_date DATE,
  end_date DATE,
  budget NUMERIC(12, 2),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.profiles(id),
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_hours NUMERIC(6, 2),
  actual_hours NUMERIC(6, 2),
  tags TEXT[],
  position INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.spreadsheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  data JSONB DEFAULT '[]'::jsonb,
  columns JSONB DEFAULT '[]'::jsonb,
  linked_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB DEFAULT '{}'::jsonb,
  actions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  execution_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'running')),
  execution_time_ms INTEGER,
  error_message TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  interaction_type TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  is_simulated BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_workspace ON public.projects(workspace_id);
CREATE INDEX idx_tasks_project ON public.tasks(project_id);
CREATE INDEX idx_tasks_assigned ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_spreadsheets_workspace ON public.spreadsheets(workspace_id);
CREATE INDEX idx_automations_workspace ON public.automations(workspace_id);
CREATE INDEX idx_automation_logs_automation ON public.automation_logs(automation_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spreadsheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own workspaces" ON public.workspaces
  FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can create workspaces" ON public.workspaces
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own workspaces" ON public.workspaces
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can view workspace projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = projects.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );
CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = projects.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );
CREATE POLICY "Users can update workspace projects" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = projects.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete workspace projects" ON public.projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = projects.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view project tasks" ON public.tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      JOIN public.workspaces ON workspaces.id = projects.workspace_id
      WHERE projects.id = tasks.project_id
      AND workspaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage workspace spreadsheets" ON public.spreadsheets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = spreadsheets.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage workspace automations" ON public.automations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE workspaces.id = automations.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view automation logs" ON public.automation_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.automations
      JOIN public.workspaces ON workspaces.id = automations.workspace_id
      WHERE automations.id = automation_logs.automation_id
      AND workspaces.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own AI interactions" ON public.ai_interactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create AI interactions" ON public.ai_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.spreadsheets;

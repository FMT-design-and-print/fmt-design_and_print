-- Create activity_logs table for audit trailing
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL, -- e.g., CREATE, UPDATE, DELETE, RECORD_PAYMENT, PRINT_RECEIPT, LOGIN
    entity_type TEXT NOT NULL, -- e.g., SALE, EXPENSE, CUSTOMER, PRODUCT_CATEGORY, PRODUCT_TYPE, AUTH
    entity_id TEXT, -- ID of the affected record, can be null for general actions
    description TEXT NOT NULL, -- Human readable description
    metadata JSONB, -- Additional details, like previous vs new state
    user_details JSONB, -- Snapshot of the user who performed the action { userId, name, role, image }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster querying on dashboard and activities page
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON public.activity_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);

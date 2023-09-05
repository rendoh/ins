CREATE TABLE public.posts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp WITH time zone NOT NULL DEFAULT now(),
    description text NULL,
    CONSTRAINT posts_pkey PRIMARY KEY (id)
);

-- ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
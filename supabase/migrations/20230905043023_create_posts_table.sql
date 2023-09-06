CREATE TABLE public.posts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    object_path text NOT NULL,
    created_at timestamp WITH time zone NOT NULL DEFAULT now(),
    description text NULL,
    CONSTRAINT posts_pkey PRIMARY KEY (id)
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read posts"
ON public.posts
FOR SELECT
USING ( true );

CREATE POLICY "Users can create posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update posts"
ON public.posts
FOR UPDATE
TO authenticated
USING ( auth.uid() = user_id )
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete posts"
ON public.posts
FOR DELETE
TO authenticated
USING ( auth.uid() = user_id );

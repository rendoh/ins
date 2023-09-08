-- ユーザサインアップ時にプロフィールを作成する

CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,

  PRIMARY KEY (id),
  CONSTRAINT username_length CHECK (char_length(username) >= 3),
  CONSTRAINT valid_username CHECK (username ~ '^[a-z_\-]+$')
);

ALTER TABLE profiles
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $insert_profiles$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
end;
$insert_profiles$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
